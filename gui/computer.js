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
	static buttonScreenGap = 10;
	
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		render(new Screen(x,y, ()=>image));
		render(new Button(x, y + image[0].length + Computer.buttonScreenGap, '▶', start));
	}
}