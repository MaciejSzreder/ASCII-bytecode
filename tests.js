const expect = chai.expect;

function testExecutionOutput(code, steps, input, expectedOutput)
{
	let out = Machine.execute(code, steps, input);

	expect(out).to.deep.equal(expectedOutput)
}

function testExecutionOutputForInput(code, input, expectedOutput)
{
	let out = Machine.executeForInput(code, input);

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
		testExecutionOutputForInput('ioz1PiAzPao', [[0,2,4,6,8],[1,3,5,7,9]], [[0,1,2,3,4,5,6,7,8,9]]);
	});
	it('P register allows to change output ', ()=>{
		testExecutionOutputForInput('ioiAz1PaozP', [[0,1,2,3,4,5,6,7,8,9]], [[0,2,4,6,8],[1,3,5,7,9]]);
	});
});

describe('repeating', ()=>{
	it('io is cat', ()=>{
		testExecutionOutputForInput('io', [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]]);
	});
});

describe('registers', ()=>{
	it('register A allows for input swapping order',()=>{
		testExecutionOutputForInput('iAioao', [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('writting to register A modifies only register A ',()=>{
		testExecutionOutput('5Abopoao', 10, [], [[0, 0, 5]]);
	});
	it('register B allows for input swapping order',()=>{
		testExecutionOutputForInput('iBiobo', [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('writting to register B modifies only register B ',()=>{
		testExecutionOutput('5Baopobo', 10, [], [[0, 0, 5]]);
	});
	it('writting to register P modifies only register P ',()=>{
		testExecutionOutput('5Paobopo', 10, [], [undefined, undefined, undefined, undefined, undefined, [0, 0, 5]]);
	});
	it('pass 1 through registers P, A, B', ()=>{
		testExecutionOutput('1PzpAzPaBzbo', 12, [], [[1]]);
	});
});

describe('arithmetic', ()=>{
	it('add one', ()=>{
		testExecutionOutputForInput('iAz1+o', [[0, 1, 2, 3, 4]], [[1, 2, 3, 4, 5]]);
	});
	it('subtraction zeroes', ()=>{
		testExecutionOutputForInput('iA-o', [[0, 1, 2, 3, 4]], [[0, 0, 0, 0, 0]]);
	})
	it('subtracting one', ()=>{
		testExecutionOutputForInput('z1Ai-o', [[0, 1, 2, 3, 4]], [[-1, 0, 1, 2, 3]]);
	})
	it('multiply by itself', ()=>{
		testExecutionOutputForInput('iA*o', [[0, 1, 2, 3, 4]], [[0, 1, 4, 9, 16]]);
	})
	it('multiply by 2', ()=>{
		testExecutionOutputForInput('z2Ai*o', [[0, 1, 2, 3, 4]], [[0, 2, 4, 6, 8]]);
	})
	it('selects smaller', ()=>{
		testExecutionOutputForInput('iAimo', [[0,1, -1,0, 2,1, 1,2, -1,-2, -2,-1, -1,1, 1,-1, 1,1, -1,-1]], [[0, -1, 1, 1, -2, -2, -1, -1, 1, -1]])
	})
	it('selects greater', ()=>{
		testExecutionOutputForInput('iAiMo', [[0,1, -1,0, 2,1, 1,2, -1,-2, -2,-1, -1,1, 1,-1, 1,1, -1,-1]], [[1, 0, 2, 2, -1, -1, 1, 1, 1, -1]])
	})
	it('greater than 0', ()=>{
		testExecutionOutputForInput('i>o', [[1,0,-1,2,-2,3,-3]], [[1,0,0,1,0,1,0]]);
	});
	it('equal to 0', ()=>{
		testExecutionOutputForInput('i=o', [[1,0,-1,2,-2,3,-3]], [[0,1,0,0,0,0,0]]);
	});
	it('less than 0', ()=>{
		testExecutionOutputForInput('i<o', [[1,0,-1,2,-2,3,-3]], [[0,0,1,0,1,0,1]]);
	});
	it('greater than 1', ()=>{
		testExecutionOutputForInput('z1Ai>o', [[1,0,-1,2,-2,3,-3]], [[0,0,0,1,0,1,0]]);
	});
	it('equal to 1', ()=>{
		testExecutionOutputForInput('z1Ai=o', [[1,0,-1,2,-2,3,-3]], [[1,0,0,0,0,0,0]]);
	});
	it('less than 1', ()=>{
		testExecutionOutputForInput('z1Ai<o', [[1,0,-1,2,-2,3,-3]], [[0,1,1,0,1,0,1]]);
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
		testExecutionOutputForInput('i o', [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]])
	})
	it('code can contain tabulation', ()=>{
		testExecutionOutputForInput('i\to', [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]])
	})
	it('code can contain new line (LF)', ()=>{
		testExecutionOutputForInput('i\no', [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]])
	})
	it('; ignores commands', ()=>{
		testExecutionOutput('io;o', 25, [[0, 1, 2, 3, 4]], [[0]])
	})
	it('new line (LF) ends ignoring commands', ()=>{
		testExecutionOutputForInput('i;A+\no', [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]])
	})
})

describe('TIS-100',()=>{
	it('Self-Test Diagnostic',()=>{
		testExecutionOutputForInput('ioz1PiozP', [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]], [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]]);
	})
	it('Self-Test Diagnostic',()=>{
		testExecutionOutputForInput('iopA=-P', [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]], [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]]);
	})
	it('Signal Amplifier', ()=>{
		testExecutionOutputForInput('iA+o', [[0, 1, 2, 3, 4]], [[0, 2, 4, 6, 8]]);
	});
	it('Differential Converter',()=>{
		testExecutionOutputForInput('1PiAzPi-oAz1Pz-oz', [[1,2,3,4,5],[5,4,3,2,1]], [[-4,-2,0,2,4],[4,2,0,-2,-4]])
	});
	it('Signal Comparator', ()=>{
		testExecutionOutputForInput('iAz<oz1Pz=oz2Pz>ozP', [[1,0,-1,2,-2,3,-3]], [[1,0,0,1,0,1,0],[0,1,0,0,0,0,0],[0,0,1,0,1,0,1]]);
	});
	it('Signal Multiplexer', ()=>{
		testExecutionOutputForInput(`
			z1PiB; B=selector
			<Az1-A; A=selector>=0
			zPi*P; P=(selector>=0)*first
			zAb>Az1-A; A=selector<=0
			pB; B=(selector>=0)*first
			z2Pi*A; A=(selector<=0)*second
			zP; first output
			b+o; (selector>=0)*first+(selector<=0)*second
			`,
			[[2,2,2],[1,0,-1],[3,3,3]],
			[[2,5,3]]
		);
	});
	it('Sequence Generator', ()=>{
		testExecutionOutputForInput(`
			1PiA; A=first
			zPiB; B=second
			mo; output min(first,second)
			bMo; output max(first,second)
			zo; sequence end
			`,
			[[10,40,50,60,90,100],[20,30,50,70,80,100]],
			[[10,20,0,30,40,0,50,50,0,60,70,0,80,90,0,100,100,0]]
		)
	})
});