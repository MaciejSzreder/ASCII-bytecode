class Computer
{
	static screenEdgeGap = 10;
	static buttonEdgeGap = Computer.screenEdgeGap;
	static buttonScreenGap = Computer.buttonEdgeGap;
	static width = (new Machine).image().length + 2*Computer.screenEdgeGap;

	image =  (new Machine).image()

	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		render(this.screen = new Screen(x+Computer.screenEdgeGap,y+Computer.screenEdgeGap, ()=>this.image));
		render(this.button = new Button(
			x+Computer.buttonEdgeGap,
			y + this.image[0].length + Computer.buttonScreenGap + Computer.screenEdgeGap,
			'▶',
			()=>this.start()
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
		ctx.strokeStyle = color.off;
		ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.hitBox.width, this.hitBox.height);
	
	}

	connectServiceInput(source)
	{
		this.serviceCode = source;
	}

	connectInput(source)
	{
		this.input = source;
	}

	connectOutput(destination)
	{
		this.output = destination;
	}

	start()
	{
		let input = tapeIterator(this.input.value);
		let {machine} = Machine.prepare('', (port)=>port==0?input():null, tapeIterator(this.serviceCode.value));
		machine.outputs((port,value)=>{
			if(port==0){
				this.output.value = tapeEncode([[value]]) + '\n' + this.output.value;
			}
			console.log(`${port}: ${value}`);
		});
		
		machine.restart();

		this.image = machine.image();
	}
}