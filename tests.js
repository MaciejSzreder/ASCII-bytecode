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
	it('o command outputs accumulator value', function() {
		testExecutionOutput('5o', 2, [], [[5]]);
	});
	it('i command do not outputs', function() {
		testExecutionOutput('i', 1, [], []);
	});
	it('io pass input to output', function() {
		testExecutionOutput('io', 2, [[10]], [[10]]);
	});
	it('P register allows to change input ', ()=>{
		testExecutionOutput('ioz1PiAzPao', 60, [[0,2,4,6,8],[1,3,5,7,9]], [[0,1,2,3,4,5,6,7,8,9]]);
	});
	it('P register allows to change output ', ()=>{
		testExecutionOutput('ioiAz1PaozP', 60, [[0,1,2,3,4,5,6,7,8,9]], [[0,2,4,6,8],[1,3,5,7,9]]);
	});
});

describe('repeating', ()=>{
	it('io is cat', ()=>{
		testExecutionOutput('io', 15, [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]]);
	});
});

describe('registers', ()=>{
	it('register A allows for input swapping order',()=>{
		testExecutionOutput('iAioao', 14, [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('register B allows for input swapping order',()=>{
		testExecutionOutput('iBiobo', 14, [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('pass 1 through registers P, A, B', ()=>{
		testExecutionOutput('1PzpAzPaBzbo', 12, [], [[1]]);
	});
});

describe('arithmetic', ()=>{
	it('add one', ()=>{
		testExecutionOutput('iAz1+o', 35, [[0, 1, 2, 3, 4]], [[1, 2, 3, 4, 5]]);
	});
	it('subtraction zeroes', ()=>{
		testExecutionOutput('iA-o', 25, [[0, 1, 2, 3, 4]], [[0, 0, 0, 0, 0]]);
	})
	it('subtracting one', ()=>{
		testExecutionOutput('z1Ai-o', 35, [[0, 1, 2, 3, 4]], [[-1, 0, 1, 2, 3]]);
	})
	it('multiply by itself', ()=>{
		testExecutionOutput('iA*o', 35, [[0, 1, 2, 3, 4]], [[0, 1, 4, 9, 16]]);
	})
	it('multiply by 2', ()=>{
		testExecutionOutput('z2Ai*o', 35, [[0, 1, 2, 3, 4]], [[0, 2, 4, 6, 8]]);
	})
	it('greater than 0', ()=>{
		testExecutionOutput('i>o', 28, [[1,0,-1,2,-2,3,-3]], [[1,0,0,1,0,1,0]]);
	});
	it('equal to 0', ()=>{
		testExecutionOutput('i=o', 28, [[1,0,-1,2,-2,3,-3]], [[0,1,0,0,0,0,0]]);
	});
	it('less than 0', ()=>{
		testExecutionOutput('i<o', 28, [[1,0,-1,2,-2,3,-3]], [[0,0,1,0,1,0,1]]);
	});
	it('greater than 1', ()=>{
		testExecutionOutput('z1Ai>o', 49, [[1,0,-1,2,-2,3,-3]], [[0,0,0,1,0,1,0]]);
	});
	it('equal to 1', ()=>{
		testExecutionOutput('z1Ai=o', 49, [[1,0,-1,2,-2,3,-3]], [[1,0,0,0,0,0,0]]);
	});
	it('less than 1', ()=>{
		testExecutionOutput('z1Ai<o', 49, [[1,0,-1,2,-2,3,-3]], [[0,1,1,0,1,0,1]]);
	});
});

describe('integer literals', ()=>{
	it('decimal digits appends', ()=>{
		testExecutionOutput('123o', 4, [], [[123]]);
		testExecutionOutput('214o', 4, [], [[214]]);
		testExecutionOutput('156o', 4, [], [[156]]);
		testExecutionOutput('178o', 4, [], [[178]]);
		testExecutionOutput('190o', 4, [], [[190]]);
	});
	it('z clears', ()=>{
		testExecutionOutput('190zo', 5, [], [[0]]);
	});
});

describe('formatting', ()=>{
	it('code can contain spaces', ()=>{
		testExecutionOutput('i o', 20, [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]])
	})
	it('code can contain tabulation', ()=>{
		testExecutionOutput('i\to', 20, [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]])
	})
	it('code can contain new line (LF)', ()=>{
		testExecutionOutput('i\no', 20, [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]])
	})
})

describe('TIS-100',()=>{
	it('Self-Test Diagnostic',()=>{
		testExecutionOutput('ioz1PiozP', 50, [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]], [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]]);
	})
	it('Self-Test Diagnostic',()=>{
		testExecutionOutput('iopA=-P', 80, [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]], [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]]);
	})
	it('Signal Amplifier', ()=>{
		testExecutionOutput('iA+o', 25, [[0, 1, 2, 3, 4]], [[0, 2, 4, 6, 8]]);
	});
	it('Differential Converter',()=>{
		testExecutionOutput('1PiAzPi-oAz1Pz-oz', 90, [[1,2,3,4,5],[5,4,3,2,1]], [[-4,-2,0,2,4],[4,2,0,-2,-4]])
	});
	it('Signal Comparator', ()=>{
		testExecutionOutput('iAz<oz1Pz=oz2Pz>ozP', 140, [[1,0,-1,2,-2,3,-3]], [[1,0,0,1,0,1,0],[0,1,0,0,0,0,0],[0,0,1,0,1,0,1]]);
	});
	it('Signal Multiplexer', ()=>{
		testExecutionOutput(`
			z1PiB
			<Az1-A
			zPi*P
			zAb>Az1-A
			pBz2P
			i*A
			zP
			b+o
			`,
			252,
			[[2,2,2],[1,0,-1],[3,3,3]],
			[[2,5,3]]
		);
	});
});