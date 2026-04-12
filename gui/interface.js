const tapeGap = Tape.holeGap;
const tapeScreenGap = tapeGap;
const buttonScreenGap = tapeScreenGap;
const buttonTapeGap = buttonScreenGap;

function start()
{
	const serviceCode = tapeIterator(document.getElementById`serviceInput`.value);
	const input = tapeIterator(document.getElementById`input`.value);
	const output = document.getElementById`output`;
	const outputTape = document.getElementById`outputTape`;
	const main = document.getElementById`main`;
	const ctx = main.getContext`2d`;

	let {machine} = Machine.prepare('', (port)=>port==0?input():null, serviceCode);
	machine.outputs((port,value)=>{
		if(port==0){
			output.value = tapeEncode([[value]]) + '\n' + output.value;
		}
		console.log(`${port}: ${value}`);
	});
	
	machine.restart();

	function drawScreen()
	{
		const screen = {
			x: 2*Tape.width + 2*tapeGap,
			y: 0
		};
		const image = machine.image();
		for(let x=0; x<image.length; ++x){
			for(let z=0; z<image[x].length; ++z){
				const [r,g,b] = image[x][z];
				ctx.fillStyle = `rgb(${r&255},${g&255},${b&255})`;
				ctx.fillRect(screen.x+x,screen.y+z,1,1);
			}
		}
		requestAnimationFrame(drawScreen);
	}

	drawScreen();
}

document.addEventListener('DOMContentLoaded', ()=>{
	let view = document.getElementsByTagName`html`[0]
	let main = document.getElementById`main`;
	main.style.height = main.height = view.clientHeight;
	main.style.width = main.width = view.clientWidth;
	
	render(new Tape(document.getElementById`serviceInput`, 0));
	render(new Tape(document.getElementById`input`, Tape.width + tapeGap));
	render(new Button(2*Tape.width + tapeGap + buttonTapeGap, (new Machine).image()[0].length + buttonScreenGap, '▶', start));
	render(new Tape(document.getElementById`output`, 2*Tape.width + tapeGap + 2*tapeScreenGap + (new Machine).image().length));
});