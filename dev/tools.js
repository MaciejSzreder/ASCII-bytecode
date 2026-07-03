import * as gui from '../gui/interface.js';
import {tapeDecode} from '../logic/tape.js';

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