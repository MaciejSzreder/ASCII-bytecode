const expect = chai.expect;
chai.config.truncateThreshold = 0;

function testExecutionOutput(code, steps, input, expectedOutput)
{
	let out = Machine.execute(code, steps, input);

	expect(out).to.deep.equal(expectedOutput.map((port)=>port?.map((value)=>value & 255)))
}

function testExecutionOutputForInput(code, input, expectedOutput)
{
	let out = Machine.executeForInput(code, input);

	expect(out).to.deep.equal(expectedOutput.map((port)=>port?.map((value)=>value & 255)))
}

function testExecutionOutputForSinglePass(code, input, expectedOutput)
{
	let out = Machine.executeForSinglePass(code, input);

	expect(out).to.deep.equal(expectedOutput.map((port)=>port?.map((value)=>value & 255)))
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
	});
	it('[] ignores code for zeroed accumulator', ()=>{
		testExecutionOutputForSinglePass('[o]',[],[]);
	});
	it('[] executes code for not zeroed accumulator', ()=>{
		testExecutionOutputForSinglePass('1[o]',[],[[1]]);
	});
	it('comments in [] can contain ]', ()=>{
		testExecutionOutputForSinglePass('[o;o]o;o]',[],[]);
	});
	it('comments in [] can contain ]', ()=>{
		testExecutionOutputForSinglePass('1[o;o]o;o]',[],[[1, 1]]);
	});
	it('[] can be nested', ()=>{
		testExecutionOutputForSinglePass('[o[o]o]',[],[]);
	});
	it('[] can be nested', ()=>{
		testExecutionOutputForSinglePass('z[oz1[o]o]',[],[]);
	});
	it('[] can be nested', ()=>{
		testExecutionOutputForSinglePass('z1[oz[o]o]',[],[[1, 0]]);
	});
	it('[] can be nested', ()=>{
		testExecutionOutputForSinglePass('z1[o[o]o]',[],[[1, 1, 1]]);
	});
	it('{} repeats code for not zeroed accumulator', ()=>{
		testExecutionOutputForSinglePass('1Az3{o-}',[],[[3, 2, 1]]);
	});
	it('{} does not repeat code for zeroed accumulator', ()=>{
		testExecutionOutputForSinglePass('{o}',[],[[0]]);
	});
	it('{} can be nested', ()=>{
		testExecutionOutputForSinglePass('1Az3B{oz3{o-}b-B}',[],[[3, 3,2,1, 2, 3,2,1, 1, 3,2,1]]);
	});
	it('{} can be nested', ()=>{
		testExecutionOutputForSinglePass('1Az4B{o{zo}b-B}',[],[[4, 0, 3, 0, 2, 0, 1, 0]]);
	});
	it('{} can be nested', ()=>{
		testExecutionOutputForSinglePass('{o1Az4{o-}z}',[],[[0, 4, 3, 2, 1]]);
	});
	it('{} can be nested', ()=>{
		testExecutionOutputForSinglePass('{o{o}}',[],[[0, 0]]);
	});
	it('comments in {} can contain {', ()=>{
		testExecutionOutputForSinglePass('{o;o{o;o}',[],[[0, 0]]);
	});
	it('comments in {} can contain {', ()=>{
		testExecutionOutputForSinglePass('1Az3{o;o{o;o-}',[],[[3,3, 2,2, 1,1]]);
	});
	it('forking jumps', ()=>{
		testExecutionOutput('z11YjJo1o1oz1ojJ',99 , [], [[1]])
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
	it('register E allows for input swapping order',()=>{
		testExecutionOutputForInput('iEioeo', [[0, 1, 2, 3]], [[1, 0, 3, 2]]);
	});
	it('writing to register E modifies only register D',()=>{
		testExecutionOutputForSinglePass('5Eaobocopoeo', [], [[0, 0, 0, 0, 5]]);
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
	it('pass 1 through registers P, A, B, C, D, E', ()=>{
		testExecutionOutputForSinglePass('1PzpAzPaBzbCzcDzdEzeo', [], [[1]]);
	});
});
describe('memory', ()=>{
	it('@ reads code', ()=>{
		testExecutionOutputForSinglePass('@o',[], [[64]])
	});
	it('@ uses data address register', ()=>{
		testExecutionOutputForSinglePass('z6D@o;D;',[], [[68]])
	});
	it('$ can change code', ()=>{
		testExecutionOutputForSinglePass('7Dz111$',[], [[111]])
	});
	it('@ reads data written by $', ()=>{
		testExecutionOutputForSinglePass('100Dz11$z@o',[], [[11]])
	});
	it('@ and $ supports negative address', ()=>{
		testExecutionOutputForSinglePass('1Az-D$z@o',[], [[255]])
	});
})

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
	});
	it('self division ones', ()=>{
		testExecutionOutputForInput('iA/o', [[-3, -2, -1, 1, 2, 3]], [[1, 1, 1, 1, 1, 1]]);
	});
	it('0/0 is 0', ()=>{
		testExecutionOutputForSinglePass('/o', [], [[0]]);
	});
	it('>0/0 is greatest', ()=>{
		testExecutionOutputForInput('i/o', [[1, 2, 3]], [[32767, 32767, 32767]]);
	});
	it('<0/0 is smallest', ()=>{
		testExecutionOutputForInput('i/o', [[-1, -2, -3]], [[-32768, -32768, -32768]]);
	});
	it('division sign change', ()=>{
		testExecutionOutputForInput('1A--A{i/o}', [[-3, -2, -1, 0, 1, 2, 3]], [[3, 2, 1, 0, -1, -2, -3]]);
	});
	it('self modulo zeroes', ()=>{
		testExecutionOutputForInput('iA%o', [[0, 1, 2, 3, 4]], [[0, 0, 0, 0, 0]]);
	})
	it('modulo by 2', ()=>{
		testExecutionOutputForInput('z2Ai%o', [[-4, -3, -2, -1, 0, 1, 2, 3, 4]], [[0, 1, 0, 1, 0, 1, 0, 1, 0]]);
	})
	it('modulo by -2', ()=>{
		testExecutionOutputForInput('z2Az-Ai%o', [[-4, -3, -2, -1, 0, 1, 2, 3, 4]], [[0, -1, 0, -1, 0, -1, 0, -1, 0]]);
	})
	it('modulo by 0', ()=>{
		testExecutionOutputForInput('i%o', [[-4, -3, -2, -1, 0, 1, 2, 3, 4]], [[0, 0, 0, 0, 0, 0, 0, 0, 0]]);
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
	it('or', ()=>{
		testExecutionOutputForInput('iAz1Pi|AzPao',[[0b0, 0b11111111, 0b10101001], [0b11111111, 0b0, 0b10011010]], [[0b11111111, 0b11111111, 0b10111011]])
	});
	it('make odd', ()=>{
		testExecutionOutputForInput('iAz1|o',[[10, 21, 0, 1, 6, 8]], [[11, 21, 1, 1, 7, 9]])
	});
	it('xor', ()=>{
		testExecutionOutputForInput('iAz1Pi^AzPao',[[0b0, 0b11111111, 0b10101001], [0b11111111, 0b0, 0b10011010]], [[0b11111111, 0b11111111, 0b00110011]])
	});
	it('parity bit', ()=>{
		testExecutionOutputForInput('iAOOOOB^AOO^AO^AzIOOOOOOO&Az<o',[[0b0, 0b1, 0b10, 0b100, 0b1000, 0b10000, 0b100000, 0b1000000, 0b10000000, 0b10101010, 0b10001001]], [[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]])
	});
	it('sign extension', ()=>{
		testExecutionOutputForInput('iSo', [[0, 1, 2, 127, 128, 129, 255, 254, 1278]], [[0, 1, 2, 127, -128, -127, -1, -2, -2]]);
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
	it('binary digits append', ()=>{
		testExecutionOutputForSinglePass('IOIOIOIOo', [], [[0b10101010]]);
		testExecutionOutputForSinglePass('OIOIOIOIo', [], [[0b01010101]]);
		testExecutionOutputForSinglePass('IOIOIOIo', [], [[0b1010101]]);
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
		testExecutionOutputForInput('i;A+;o', [[0, 1, 2, 3, 4]], [[0, 1, 2, 3, 4]])
	})
})

describe('TIS-100',()=>{
	it('Self-Test Diagnostic',()=>{
		testExecutionOutputForInput('ioz1PiozP', [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]], [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]]);
	})
	it('Self-Test Diagnostic',()=>{
		testExecutionOutputForInput('iopA=-P', [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]], [[0, 1, 2, 3, 4],[5, 6, 7, 8, 9]]);
	})
	it('Self-Test Diagnostic',()=>{
		testExecutionOutput('7Yioz2Jz1Pioz10J', 1000, [[0, 1, 2],[5, 6, 7, 8, 9]], [[0, 1, 2],[5, 6, 7, 8, 9]]);
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
			z1PiB; B=selector;
			<Az1-A; A=selector>=0;
			zPi*P; P=(selector>=0)*first;
			zAb>Az1-A; A=selector<=0;
			pB; B=(selector>=0)*first;
			z2Pi*A; A=(selector<=0)*second;
			zP; first output;
			b+o; (selector>=0)*first+(selector<=0)*second;
			`,
			[[2,2,2],[1,0,-1],[3,3,3]],
			[[2,5,3]]
		);
	});
	it('Sequence Generator', ()=>{
		testExecutionOutputForInput(`
			1PiA; A=first;
			zPiB; B=second;
			mo; output min(first,second);
			bMo; output max(first,second);
			zo; sequence end;
			`,
			[[10,40,50,60,90,100],[20,30,50,70,80,100]],
			[[10,20,0,30,40,0,50,50,0,60,70,0,80,90,0,100,100,0]]
		)
	});
	it('Sequence Counter',()=>{
		testExecutionOutputForInput(`
			zBzC; sum=0, count=0;
				iAb+B; sum+=input;
				z<Ac+C; count+=input>0;
			z30*Dz1-Az115*Ad+J; if input>0;
			bo
			z1Pco
			zP
			`,
			[[1,2,3,4,5,0, 1,2,0, 1,0, 0, 77,34,32,98,45,76,0]],
			[[15, 3, 1, 0, 362], [5, 2, 1, 0, 6]]
		);
	});
	it('Signal Edge Detector', ()=>{
		testExecutionOutputForInput(`
			iC;      C=current;
			-A;      A= current - previous;
			z9<D;    D= 9 < current - previous;
			z-Az9<A; 9 < previous - current;
			d+o;     |previous - current| > 9;
			cA;      previous<-current;
			`,
			[[0, 5, 100, 10, 20, 10, 1, 10]],
			[[0, 0, 1, 1, 1, 1, 0, 0]]
		);
	});
	it('Input Handler', ()=>{
		testExecutionOutputForInput(`
			iOA;            A=first;
			z1Pi|OA;        A=first second;
			z2Pi|OA;        A=first second third;
			z3Pi|AC;        C=first second third fourth;
			b^DA;           D=current ^ previous;
			cB;             previous<-current;
			zIOOO=C;        C=(first changed)? 1 : 0;
			zIOOAd=OAc+C;   C+=(second changed)? 2 : 0;
			zIOAd=Az3*Ac+C; C+=(third changed)? 3 : 0;
			zIAd=OOAc+C;    C+=(fourth changed)? 4 : 0;
			zPco
			`,[
				[0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
				[0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
				[0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0]
			],[
				[0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0]
			]
		)
	});
	it('Signal Pattern Detector', ()=>{
		testExecutionOutputForInput(`
			i=A;     is match;
			bO|A;    append match;
			zIII&BA; keep only 3 last matches;
			zIII=o;  is full match;
			zA`,
			[[2, 0,0,0, 1, 2, 0, 3, 0,0, 4, 0,0,0,0,0,0, 1, 0,0,0]],
			[[0, 0,0,1, 0, 0, 0, 0, 0,0, 0, 0,0,1,1,1,1, 0, 0,0,1]]
		)
	});
	it('Sequence Peek Detector', ()=>{
		testExecutionOutputForInput(`
			z32767B; initialize minimum;
			zC;      initialize maximum;
			{iA[;    while read value is not 0;
				bmB
				cMC
			]}
			bo
			z1Pco
			zP
			`,
			[[10,0, 1,2,3,0, 3,2,1,0, 1,3,2,0, 3,3,3,0]],
			[[10, 1, 1, 1, 3], [10, 3, 3, 3, 3]]
		);
	});
	it('Sequence Reverser', ()=>{
		testExecutionOutputForInput(`
			z1A
			{iB[
				d-D
				b$
			]}
			d[{
				@o
				d+D
			}]
			zo
			`,
			[[1,2,3,4,0, 0, 1,0, 1,2,0, 1,2,3,4,5,6,7,8,9,0]],
			[[4,3,2,1,0, 0, 1,0, 2,1,0, 9,8,7,6,5,4,3,2,1,0]]
		)
	});
	it('Signal Multiplier', ()=>{
		testExecutionOutputForInput(`
			iA
			z1Pi
			*A
			zPao
			`,
			[
				[0,   1,   2,  3,   4, 5],
				[200, 100, 11, 55,  0, 5]
			],[
				[0,  100,  22, 165, 0, 25]
			]
		);
	});
	it('Signal Window Filter', ()=>{
		testExecutionOutputForInput(`
			;window (youngest)B, C, D, E, A(oldest);
			eAdEcDbCiB;      window shift;
			z1Pb+Ac+Ad+Ae+o; sum of 5-wide window;
			zPbAc+Ad+o;      sum of 3-wide window;
			`,
			[
				[1, 1, 1, 1, 1, 0, 0, 0, 0, 100, 50,  25,  12,  6,   3,  1]
			],[
				[1, 2, 3, 3, 3, 2, 1, 0, 0, 100, 150, 175, 87,  43,  21, 10],
				[1, 2, 3, 4, 5, 4, 3, 2, 1, 100, 150, 175, 187, 193, 96, 47]
			]
		);
	});
	it('Signal Divider',()=>{
		testExecutionOutputForInput(`
			iB
			z1PiA
			b%o
			zP
			b/o
			`,
			[
				[0,   1, 2],
				[100, 2, 1]
			],[
				[0,   0, 2],
				[0,   1, 0]
			]
		);
	});
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
	});
	it('negabinary to binary', ()=>{
		testExecutionOutputForInput(`
			iA
			zOIOIOIOI&B ;positive bits;
			zIOIOIOIO&A  ;negative bits;
			b-o         ;joins positive nad negative bits;
			`,
			[[0b1, 0b10, 0b11, 0b1111, 0b11111, 0b110001]],
			[[1, -2, -1, -5, 11, -15]]
		)
	})
})