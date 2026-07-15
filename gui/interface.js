import render from './render.js';
import Computer from './computer.js';
import Tape from './tape.js';
import Cable from './cable.js';
import { HtmlId } from './utils.js';

const tapeGap = Tape.holeGap;
const tapeComputerGap = tapeGap;

export let serviceTape, inputTape, outputTape, computer;

function positionClamp(position, width, max){
	if(position < 0){
		return 0;
	}
	if(position+width <= max){
		return position;
	}
	return max-width;
}

document.addEventListener('DOMContentLoaded', ()=>{
	let view = HtmlId`html`;
	let main = HtmlId`main`;
	main.style.height = main.height = view.clientHeight;
	let width = main.style.width = main.width = view.clientWidth;
	
	render(serviceTape = new Tape(HtmlId`serviceInput`, 0));
	render(inputTape = new Tape(HtmlId`input`, positionClamp( Tape.width + tapeGap, Tape.width, width)));
	render(computer = new Computer(positionClamp(2*Tape.width + 2*tapeGap, Computer.width, width), 0, ()=>image));
	render(outputTape = new Tape(HtmlId`output`, positionClamp(2*Tape.width + tapeGap + 2*tapeComputerGap + Computer.width, Tape.width, width)));

	computer.connectServiceInput(HtmlId`serviceInput`);
	computer.connectInput(HtmlId`input`);
	computer.connectOutput(HtmlId`output`);

	render(new Cable(serviceTape, computer));
	render(new Cable(inputTape, computer));
	render(new Cable(outputTape, computer));
});