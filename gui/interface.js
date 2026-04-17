const tapeGap = Tape.holeGap;
const tapeComputerGap = tapeGap;

document.addEventListener('DOMContentLoaded', ()=>{
	let view = document.getElementsByTagName`html`[0]
	let main = document.getElementById`main`;
	main.style.height = main.height = view.clientHeight;
	main.style.width = main.width = view.clientWidth;
	
	render(new Tape(document.getElementById`serviceInput`, 0));
	render(new Tape(document.getElementById`input`, Tape.width + tapeGap));
	render(new Computer(2*Tape.width + 2*tapeGap,0, ()=>image));
	render(new Tape(document.getElementById`output`, 2*Tape.width + tapeGap + 2*tapeComputerGap + Computer.width));
});