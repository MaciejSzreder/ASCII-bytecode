const tapeGap = Tape.holeGap;
const tapeComputerGap = tapeGap;

let serviceTape, inputTape, outputTape, computer;

document.addEventListener('DOMContentLoaded', ()=>{
	let view = document.getElementsByTagName`html`[0]
	let main = document.getElementById`main`;
	main.style.height = main.height = view.clientHeight;
	main.style.width = main.width = view.clientWidth;
	
	render(serviceTape = new Tape(document.getElementById`serviceInput`, 0));
	render(inputTape = new Tape(document.getElementById`input`, Tape.width + tapeGap));
	render(computer = new Computer(2*Tape.width + 2*tapeGap,0, ()=>image));
	render(outputTape = new Tape(document.getElementById`output`, 2*Tape.width + tapeGap + 2*tapeComputerGap + Computer.width));

	computer.connectServiceInput(document.getElementById`serviceInput`);
	computer.connectInput(document.getElementById`input`);
	computer.connectOutput(document.getElementById`output`);
});