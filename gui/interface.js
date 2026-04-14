const tapeGap = Tape.holeGap;
const tapeScreenGap = tapeGap;
const buttonScreenGap = tapeScreenGap;
const buttonTapeGap = buttonScreenGap;

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

document.addEventListener('DOMContentLoaded', ()=>{
	let view = document.getElementsByTagName`html`[0]
	let main = document.getElementById`main`;
	main.style.height = main.height = view.clientHeight;
	main.style.width = main.width = view.clientWidth;
	
	render(new Tape(document.getElementById`serviceInput`, 0));
	render(new Tape(document.getElementById`input`, Tape.width + tapeGap));
	render(new Screen(2*Tape.width + 2*tapeGap,0, ()=>image));
	render(new Button(2*Tape.width + tapeGap + buttonTapeGap, (new Machine).image()[0].length + buttonScreenGap, '▶', start));
	render(new Tape(document.getElementById`output`, 2*Tape.width + tapeGap + 2*tapeScreenGap + (new Machine).image().length));
});