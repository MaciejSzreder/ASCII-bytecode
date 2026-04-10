
function tapeDecode(encoded)
{
	let loop = false;
	if(encoded.startsWith('========\n') || encoded.startsWith('~~~~~~~~\n')){
		encoded = encoded.slice(9);
		loop = true;
	}
	if(encoded.endsWith('========') || encoded.endsWith('~~~~~~~~')){
		encoded = encoded.slice(0, -9);
		loop = true;
	};

	let data = encoded.split('\n').map((row)=>parseInt(row.slice(0,8).padEnd(8, ' ').replaceAll(' ', '0').replaceAll('O', '1'),2));

	return [data, loop];
}

function tapeEncode(data, loop = false)
{
	return(
		data[0].map((value)=>
			value
			.toString(2)
			.padStart(8,' ')
			.replaceAll('0',' ')
			.replaceAll('1','O')
		).join('\n')
		+(loop?'\n========':'')
	);
}

function tapeIterator(encoded)
{

	let [decoded, loop] = tapeDecode(encoded);

	if(loop){
		return ()=>{
			const data = decoded.shift();
			decoded.push(data);
			return data;
		}
	}else{
		return ()=>{
			return decoded.shift();
		}
	}
}