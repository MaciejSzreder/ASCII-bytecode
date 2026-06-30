const tapeGap = Tape.holeGap;
const tapeComputerGap = tapeGap;

let serviceTape, inputTape, outputTape, computer;

document.addEventListener('DOMContentLoaded', ()=>{
	let view = HtmlId`html`;
	let main = HtmlId`main`;
	main.style.height = main.height = view.clientHeight;
	main.style.width = main.width = view.clientWidth;
	
	render(serviceTape = new Tape(HtmlId`serviceInput`, 0));
	render(inputTape = new Tape(HtmlId`input`, Tape.width + tapeGap));
	render(computer = new Computer(2*Tape.width + 2*tapeGap,0, ()=>image));
	render(outputTape = new Tape(HtmlId`output`, 2*Tape.width + tapeGap + 2*tapeComputerGap + Computer.width));

	computer.connectServiceInput(HtmlId`serviceInput`);
	computer.connectInput(HtmlId`input`);
	computer.connectOutput(HtmlId`output`);
});