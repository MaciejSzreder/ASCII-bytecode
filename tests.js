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

function testExecutionOutputForSinglePass(code, input, expectedOutput)
{
	let out = Machine.executeForSinglePass(code, input);

	expect(out).to.deep.equal(expectedOutput)
}

describe('IO', ()=>{
	it('o command outputs', ()=>{
		testExecutionOutputForSinglePass('o', [], [[0]]);
	});
	it('o command outputs accumulator value', ()=>{
		testExecutionOutputForSinglePass('5o', [], [[5]]);
	});
	it('i command does not output', ()=>{
		testExecutionOutputForSinglePass('i', [], []);
	});
	it('io passes input to output', ()=>{
		testExecutionOutputForSinglePass('io', [[10]], [[10]]);
	});
	it('P register allows to change input port', ()=>{
		testExecutionOutputForInput('ioz1PiAzPao', [[0,2,4,6,8],[1,3,5,7,9]], [[0,1,2,3,4,5,6,7,8,9]]);
	});
	it('P register allows to change output port', ()=>{
		testExecutionOutputForInput('ioiAz1PaozP', [[0,1,2,3,4,5,6,7,8,9]], [[0,2,4,6,8],[1,3,5,7,9]]);
	});
});

describe('jumps', ()=>{
	it('code end loops', ()=>{
		testExecutionOutputForInput('io', [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]]);
	});
	it('setting J register jumps', ()=>{
		testExecutionOutputForSinglePass('z11Jo1o1o1oz1o', [], [[1]])
	})
});

describe('registers', ()=>{
	it('register A allows for input swapping order',()=>{
		testExecutionOutputForInput('iAioao', [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('writing to register A modifies only register A',()=>{
		testExecutionOutputForSinglePass('5Abocodopoao', [], [[0, 0, 0, 0, 5]]);
	});
	it('register B allows for input swapping order',()=>{
		testExecutionOutputForInput('iBiobo', [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('writing to register B modifies only register B',()=>{
		testExecutionOutputForSinglePass('5Baocodopobo', [], [[0, 0, 0, 0, 5]]);
	});
	it('register C allows for input swapping order',()=>{
		testExecutionOutputForInput('iCioco', [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('writing to register C modifies only register C',()=>{
		testExecutionOutputForSinglePass('5Caobodopoco', [], [[0, 0, 0, 0, 5]]);
	});
	it('register D allows for input swapping order',()=>{
		testExecutionOutputForInput('iDiodo', [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('writing to register D modifies only register D',()=>{
		testExecutionOutputForSinglePass('5Daobocopodo', [], [[0, 0, 0, 0, 5]]);
	});
	it('writing to register P modifies only register P',()=>{
		testExecutionOutputForSinglePass('5Paobocodopo', [], [undefined, undefined, undefined, undefined, undefined, [0, 0, 0, 0, 5]]);
	});
	it('writing to register J modifies only register J',()=>{
		testExecutionOutputForSinglePass('2Jaobocodopojo', [], [[0, 0, 0, 0, 0, 12]]);
	});
	it('register J stores current instruction address',()=>{
		testExecutionOutputForSinglePass('     jo', [], [[5]]);
	});
	it('pass 1 through registers P, A, B, C, D', ()=>{
		testExecutionOutputForSinglePass('1PzpAzPaBzbCzcDzdo', [], [[1]]);
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

describe('bitwise', ()=>{
	it('and', ()=>{
		testExecutionOutputForInput('iAz1Pi&AzPao',[[0b0, 0b11111111, 0b10101001], [0b11111111, 0b0, 0b10011010]], [[0b0, 0b0, 0b10001000]])
	});
	it('number parity (and)', ()=>{
		testExecutionOutputForInput('iAz1&o',[[10, 21, 0, 1, 6, 8]], [[0, 1, 0, 1, 0, 0]])
	});
});

describe('integer literals', ()=>{
	it('decimal digits append', ()=>{
		testExecutionOutputForSinglePass('123o', [], [[123]]);
		testExecutionOutputForSinglePass('214o', [], [[214]]);
		testExecutionOutputForSinglePass('156o', [], [[156]]);
		testExecutionOutputForSinglePass('178o', [], [[178]]);
		testExecutionOutputForSinglePass('190o', [], [[190]]);
	});
	it('z clears', ()=>{
		testExecutionOutputForSinglePass('190zo', [], [[0]]);
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
		testExecutionOutputForSinglePass('io;o', [[1]], [[1]])
	})
	it('new line (LF) exits comment mode', ()=>{
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

describe('other', ()=>{
	it('fibonacci', ()=>{
		testExecutionOutput(`
			o1B
				b
				+Bo
				+Ao
			z7J
			`, 285,
			[],
			[[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181]]
		)
	})
})