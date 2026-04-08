const holeRadius = 10;
const holeGap = 10;
const holeMargin = holeGap;
const holeCenterDistance = 2*holeRadius + holeGap;
const holeCenterEdgeDistance = holeRadius + holeMargin;
const tapeWith = 8*2*holeRadius + 7*holeGap + 2*holeMargin;
const tapeGap = holeGap

const holeColor = 'black';
const potentialHoleColor = 'gray';
const glueColor = 'black';
const potentialGlueColor = 'gray';

function tapeDecode(encoded)
{
	let loop = false;
	if(encoded.startsWith('========\n') || encoded.startsWith('~~~~~~~~\n')){
		encoded = encoded.slice(9);
		loop = true;
	}
	if(encoded.endsWith('========') || encoded.endsWith('~~~~~~~~')){
		encoded = encoded.slice(0, -9);
		loop = true;
	};

	let data = encoded.split('\n').map((row)=>parseInt(row.slice(0,8).padEnd(8, ' ').replaceAll(' ', '0').replaceAll('O', '1'),2));

	return [data, loop];
}

function tapeEncode(data, loop = false)
{
	return(
		data[0].map((value)=>
			value
			.toString(2)
			.padStart(8,' ')
			.replaceAll('0',' ')
			.replaceAll('1','O')
		).join('\n')
		+(loop?'\n========':'')
	);
}

function tapeIterator(encoded)
{

	let [decoded, loop] = tapeDecode(encoded);

	if(loop){
		return ()=>{
			const data = decoded.shift();
			decoded.push(data);
			return data;
		}
	}else{
		return ()=>{
			return decoded.shift();
		}
	}
}


function glueCovering(ctx, x,y, potential)
{
	ctx.fillStyle = potential ? potentialGlueColor : glueColor;
	ctx.fillRect(x, y, tapeWith, holeCenterEdgeDistance-holeRadius);
}

function punchHole(ctx, x, y, potential = false)
{
	ctx.beginPath();
	ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
	ctx.fillStyle = potential ? potentialHoleColor : holeColor;
	ctx.fill();
}

function punchValue(ctx, value, x,y)
{
	for(let idx=0; value>0; value>>=1, ++idx){
		if(value&1){
			punchHole(ctx, x + holeCenterEdgeDistance + holeCenterDistance*(7-idx), y);
		}
	}
}

function punchTape(canvas, values, loop, x)
{
	const ctx = canvas.getContext?canvas.getContext`2d`:canvas;
	ctx.clearRect(x,0, tapeWith,ctx.canvas.height);
	ctx.strokeRect(x+0.5,0.5, tapeWith-1,ctx.canvas.height-1);
	if(loop){
		glueCovering(ctx, x,0);
	}
	for(const [index,value] of values.entries()){
		let y = holeCenterEdgeDistance + (values.length - index - 1)*holeCenterDistance;
		punchValue(ctx, value, x,y);
	}
	if(loop){
		let y = holeCenterEdgeDistance + (values.length - 1)*holeCenterDistance + holeRadius;
		glueCovering(ctx, x,y);
	}
}

class Tape
{
	constructor(source, x)
	{
		this.source = source;
		this.x = x;
		this.hitBox = {
			x: this.x,
			y: 0,
			width: tapeWith,
			height: Infinity
		};
	}

	draw(ctx, {mouse})
	{
		let [data, loop] = tapeDecode(this.source.value);
		punchTape(ctx, data.reverse(), loop, this.x);

		if(mouse.isOver){
			const cell = {
				column: Math.max(0,Math.min(Math.round((mouse.x-this.x-holeCenterEdgeDistance)/holeCenterDistance), 7)),
				row: Math.floor(mouse.y / holeCenterDistance)
			};
			const hole = {
				x: cell.column*holeCenterDistance + holeCenterEdgeDistance + this.x,
				y: cell.row*holeCenterDistance + holeCenterEdgeDistance
			}
			const rowY = mouse.y % holeCenterDistance;

			if(rowY <= holeGap){
				glueCovering(ctx, this.x,mouse.y-rowY, true);
			}else{
				punchHole(ctx, hole.x, hole.y, true);
			}
		}
	}

	click(mouse)
	{
		const cell = {
			column: Math.max(0,Math.min(Math.round((mouse.x-holeCenterEdgeDistance)/holeCenterDistance), 7)),
			row: Math.floor(mouse.y / holeCenterDistance)
		};
		
		let [decoded, loop] = tapeDecode(this.source.value);
		const rowY = mouse.y % holeCenterDistance;
		if(rowY <= holeGap){
			// set loop if there was no glue or did not clicked on glue
			loop = !loop || (decoded.length!==cell.row && cell.row!==0);
			if(cell.row!==0){
				decoded.length = cell.row;
			}
		}else{
			decoded[cell.row] ^= 1 << (7-cell.column);
		}
		this.source.value = tapeEncode([decoded], loop);
	}
}