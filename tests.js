const expect = chai.expect;

function testExecutionOutput(code, steps, input, expectedOutput)
{
	let out = Machine.execute(code, steps, input);

	expect(out).to.deep.equal(expectedOutput)
}

describe('IO', ()=>{
	it('o command outputs', function() {
		testExecutionOutput('o', 1, [], [[0]]);
	});
	it('io pass input to output', function() {
		testExecutionOutput('io', 2, [[10]], [[10]]);
	});
	it('H register allows to change input ', ()=>{
		testExecutionOutput('ioz1HiAzHao', 60, [[0,2,4,6,8],[1,3,5,7,9]], [[0,1,2,3,4,5,6,7,8,9]]);
	});
});

describe('repeating', ()=>{
	it('io is cat', ()=>{
		testExecutionOutput('io', 15, [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]]);
	});
});

describe('registers', ()=>{
	it('register A alows for input swapping order',()=>{
		testExecutionOutput('iAioao', 14, [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('pass 1 through registers A and H', ()=>{
		testExecutionOutput('1HzhAzHao', 9, [], [[1]]);
	});
});

describe('arithmetic', ()=>{
	it('TIS-100: Signal Amplifier', ()=>{
		testExecutionOutput('iA+o', 25, [[0, 1, 2, 3, 4]], [[0, 2, 4, 6, 8]]);
	});
	it('subtraction zeroes', ()=>{
		testExecutionOutput('iA-o', 25, [[0, 1, 2, 3, 4]], [[0, 0, 0, 0, 0]]);
	})
	it('subtracting one', ()=>{
		testExecutionOutput('z1Ai-o', 35, [[0, 1, 2, 3, 4]], [[-1, 0, 1, 2, 3]]);
	})
	it('TIS-100: Differential Converter',()=>{
		testExecutionOutput('1HiAzHi-oAz1Hz-oz', 90, [[1,2,3,4,5],[5,4,3,2,1]], [[-4,-2,0,2,4],[4,2,0,-2,-4]])
	});
	it('TIS-100: Signal Comparator', ()=>{
		testExecutionOutput('iAz<oz1Hz=oz2Hz>ozH', 140, [[1,0,-1,2,-2,3,-3]], [[1,0,0,1,0,1,0],[0,1,0,0,0,0,0],[0,0,1,0,1,0,1]]);
	});
});

describe('integer literals', ()=>{
	it('literals can be outputed', ()=>{
		testExecutionOutput('123o', 4, [], [[123]]);
		testExecutionOutput('214o', 4, [], [[214]]);
		testExecutionOutput('156o', 4, [], [[156]]);
		testExecutionOutput('178o', 4, [], [[178]]);
		testExecutionOutput('190o', 4, [], [[190]]);
	});
	it('z allows to start new literal', ()=>{
		testExecutionOutput('190zo', 5, [], [[0]]);
	});
});