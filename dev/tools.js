function serialize(tapeEncoded)
{
	const [content, loop] = tapeDecode(tapeEncoded);
	return String.fromCharCode(...content)+(loop?'🔄':'🛑');
}

export function get_input_tape_content()
{
	return serialize(inputTape.source.value);
}

export function get_service_tape_content()
{
	return serialize(serviceTape.source.value);
}

export function get_output_tape_content()
{
	return serialize(outputTape.source.value);
}