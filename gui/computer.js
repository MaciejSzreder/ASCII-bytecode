let image = (new Machine).image();

function start()
{
	const serviceCode = tapeIterator(document.getElementById`serviceInput`.value);
	const input = tapeIterator(document.getElementById`input`.value);
	const output = document.getElementById`output`;

	let {machine} = Machine.prepare('', (port)=>port==0?input():null, serviceCode);
	machine.outputs((port,value)=>{
		if(port==0){
			output.value = tapeEncode([[value]]) + '\n' + output.value;
		}
		console.log(`${port}: ${value}`);
	});
	
	machine.restart();

	image = machine.image();
}

class Computer
{
	static screenEdgeGap = 10;
	static buttonEdgeGap = Computer.screenEdgeGap;
	static buttonScreenGap = Computer.buttonEdgeGap;
	static width = image.length + 2*Computer.screenEdgeGap;
	
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		render(this.screen = new Screen(x+Computer.screenEdgeGap,y+Computer.screenEdgeGap, ()=>image));
		render(this.button = new Button(
			x+Computer.buttonEdgeGap,
			y + image[0].length + Computer.buttonScreenGap + Computer.screenEdgeGap,
			'▶',
			start
		));
	}

	draw(ctx)
	{
		this.hitBox = {
			x: this.x,
			y: this.y,
			width: Computer.width,
			height: this.button.hitBox.y - this.y + this.button.hitBox.height + Computer.buttonEdgeGap
		}
		ctx.fillStyle = 'black';
		ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.hitBox.width, this.hitBox.height);
	
	}
}