import * as gui from '../gui/interface.js';
import {tapeDecode} from '../logic/tape.js';
import render from '../gui/render.js';
import color from '../gui/colors.js';

function serialize(tapeEncoded)
{
	const [content, loop] = tapeDecode(tapeEncoded);
	return String.fromCharCode(...content)+(loop?'🔄':'🛑');
}

export function get_input_tape_content()
{
	return serialize(gui.inputTape.source.value);
}

export function get_service_tape_content()
{
	return serialize(gui.serviceTape.source.value);
}

export function get_output_tape_content()
{
	return serialize(gui.outputTape.source.value);
}

export function render_fps()
{
	render(new Fps);
}

class Fps
{
	start = Date.now();

	font = '50px sans-serif';
	textColor = color.light;
	x = 0;
	y = 50;

	draw(ctx)
	{
		let fps = Date.now() - this.start;
		ctx.font = this.font;
		ctx.fillStyle = this.textColor;
		ctx.fillText((1000/fps).toFixed(2)+" fps", this.x, this.y);
		this.start = Date.now();
	}
}