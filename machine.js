class Core{
	registers
	nest = 0;
	state = 1;/*
		1	execution
		2	comment
		3	false if
		4	false if comment
		5	repeat backtrack
		6	repeat backtrack comment
	*/

	constructor(registers)
	{
		this.registers = new Int16Array(registers || 8);/*
			0	accumulator
			1	argument
			2	B
			3	instruction pointer
			4	IO port
			5	C
			6	data address
			7	E
		*/
	}

	fork()
	{
		let fork = new Core(this.registers);
		fork.registers[3]/*instruction pointer*/ = this.registers[0]/*accumulator*/;
		fork.state = this.state;
		return fork;
	}
}

class Machine{
	static execute(code, steps, inputs=[])
	{
		let machine = new Machine;
		machine.load(code);
		let output = [];
		machine.outputs(new Proxy({},{
			get(target, field, reciver){
				let idx = Number(field)
				if(output[idx]===undefined){
					output[idx] = [];
				}
				return (data) => output[idx].push(data);
			}
		}));
		machine.inputs(inputs.map((input)=>()=>input.shift()))

		machine.run(steps);

		return output;
	}
	static executeForInput(code, inputs=[])
	{
		let machine = new Machine;
		machine.load(code);
		let output = [];
		machine.outputs(new Proxy({},{
			get(target, field, receiver){
				let idx = Number(field)
				if(output[idx]===undefined){
					output[idx] = [];
				}
				return (data) => output[idx].push(data);
			}
		}));
		let outOfInput = false;
		machine.inputs(inputs.map((input)=>()=>{
			outOfInput = input.length==0;
			return input.shift();
		}));

		do{
			machine.step();
		}while(!outOfInput);

		return output;
	}

	static executeForSinglePass(code, inputs=[])
	{
		let machine = new Machine;
		machine.load(code);
		let output = [];
		machine.outputs(new Proxy({},{
			get(target, field, reciver){
				let idx = Number(field)
				if(output[idx]===undefined){
					output[idx] = [];
				}
				return (data) => output[idx].push(data);
			}
		}));
		let outOfInput = false;
		machine.inputs(inputs.map((input)=>()=>{
			outOfInput = input.length==0;
			return input.shift();
		}));

		do{
			machine.step();
		}while(machine.cores[0].registers[3]/*instruction pointer*/ !== 0);

		return output;
	}

	static instructions={
		0 /*NUL*/: (core)=>{
			core.registers[3]/*instruction pointer*/ = 0;
		},
		9 /*HT*/: (core)=>{
			++core.registers[3]/*instruction pointer*/;
		},
		10 /*LF*/: (core)=>{
			++core.registers[3]/*instruction pointer*/;
		},
		32 /* */: (core)=>{
			++core.registers[3]/*instruction pointer*/;
		},
		36 /*$*/: (core, machine)=>{
			machine.memory[(core.registers[6]/*data address*/ % machine.memory.length +  machine.memory.length) % machine.memory.length] = core.registers[0]/*accumulator*/
			++core.registers[3]/*instruction pointer*/;
		},
		37 /*%*/: (core)=>{
			core.registers[0]/*accumulator*/ = ((core.registers[0]/*accumulator*/%core.registers[1]/*argument*/)+core.registers[1]/*argument*/)%core.registers[1]/*argument*/;
			++core.registers[3]/*instruction pointer*/;
		},
		38 /*&*/: (core)=>{
			core.registers[0]/*accumulator*/ &= core.registers[1]/*argument*/;
			++core.registers[3]/*instruction pointer*/;
		},
		42 /***/: (core)=>{
			core.registers[0]/*accumulator*/ *= core.registers[1]/*argument*/;
			++core.registers[3]/*instruction pointer*/;
		},
		43 /*+*/: (core)=>{
			core.registers[0]/*accumulator*/ += core.registers[1]/*argument*/;
			++core.registers[3]/*instruction pointer*/;
		},
		45 /*-*/: (core)=>{
			core.registers[0]/*accumulator*/ -= core.registers[1]/*argument*/;
			++core.registers[3]/*instruction pointer*/;
		},
		47 /*/*/: (core)=>{
			if(core.registers[1]/*argument*/ === 0){
				if(core.registers[0]/*accumulator*/ === 0){
					core.registers[0]/*accumulator*/ = 0;
				}
				if(core.registers[0]/*accumulator*/ > 0){
					core.registers[0]/*accumulator*/ = 32767;
				}
				if(core.registers[0]/*accumulator*/ < 0){
					core.registers[0]/*accumulator*/ = -32768;
				}
			}else{
				core.registers[0]/*accumulator*/ /= core.registers[1]/*argument*/;
			}
			++core.registers[3]/*instruction pointer*/;
		},
		48 /*0*/: (core)=>{
			core.registers[0]/*accumulator*/ *= 10;
			++core.registers[3]/*instruction pointer*/;
		},
		49 /*1*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 1;
			++core.registers[3]/*instruction pointer*/;
		},
		50 /*2*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 2;
			++core.registers[3]/*instruction pointer*/;
		},
		51 /*3*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 3;
			++core.registers[3]/*instruction pointer*/;
		},
		52 /*4*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 4;
			++core.registers[3]/*instruction pointer*/;
		},
		53 /*5*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 5;
			++core.registers[3]/*instruction pointer*/;
		},
		54 /*6*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 6;
			++core.registers[3]/*instruction pointer*/;
		},
		55 /*7*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 7;
			++core.registers[3]/*instruction pointer*/;
		},
		56 /*8*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 8;
			++core.registers[3]/*instruction pointer*/;
		},
		57 /*9*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 10 + 9;
			++core.registers[3]/*instruction pointer*/;
		},
		59 /*;*/: (core)=>{
			core.state = 2/*comment*/;
			++core.registers[3]/*instruction pointer*/;
		},
		60 /*<*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ < core.registers[1]/*argument*/ ? 1 : 0;
			++core.registers[3]/*instruction pointer*/;
		},
		61 /*=*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ == core.registers[1]/*argument*/ ? 1 : 0;
			++core.registers[3]/*instruction pointer*/;
		},
		62 /*>*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ > core.registers[1]/*argument*/ ? 1 : 0;
			++core.registers[3]/*instruction pointer*/;
		},
		64 /*@*/: (core, machine)=>{
			core.registers[0]/*accumulator*/ = machine.memory[(core.registers[6]/*data address*/ % machine.memory.length +  machine.memory.length) % machine.memory.length];
			++core.registers[3]/*instruction pointer*/;
		},
		65 /*A*/: (core)=>{
			core.registers[1]/*argument*/ = core.registers[0]/*accumulator*/;
			++core.registers[3]/*instruction pointer*/;
		},
		66 /*B*/: (core)=>{
			core.registers[2]/*B*/ = core.registers[0]/*accumulator*/;
			++core.registers[3]/*instruction pointer*/;
		},
		67 /*C*/: (core)=>{
			core.registers[5]/*C*/ = core.registers[0]/*accumulator*/;
			++core.registers[3]/*instruction pointer*/;
		},
		68 /*D*/: (core)=>{
			core.registers[6]/*data address*/ = core.registers[0]/*accumulator*/;
			++core.registers[3]/*instruction pointer*/;
		},
		69 /*E*/: (core)=>{
			core.registers[7]/*E*/ = core.registers[0]/*accumulator*/;
			++core.registers[3]/*instruction pointer*/;
		},
		73 /*I*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 2 + 1;
			++core.registers[3]/*instruction pointer*/;
		},
		74 /*J*/: (core)=>{
			core.registers[3]/*instruction pointer*/ = core.registers[0]/*accumulator*/;
		},
		77 /*M*/: (core)=>{
			core.registers[0]/*accumulator*/ = Math.max(core.registers[0]/*accumulator*/, core.registers[1]/*argument*/);
			++core.registers[3]/*instruction pointer*/;
		},
		79 /*O*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[0]/*accumulator*/ * 2;
			++core.registers[3]/*instruction pointer*/;
		},
		80 /*P*/: (core)=>{
			core.registers[4]/*io port*/ = core.registers[0]/*accumulator*/;
			++core.registers[3]/*instruction pointer*/;
		},
		83 /*S*/: (core)=>{
			core.registers[0]/*accumulator*/ |= core.registers[0]/*accumulator*/ >= 0b10000000 ? 0b1111111110000000 : 0;
			++core.registers[3]/*instruction pointer*/;
		},
		89 /*Y*/: (core,machine)=>{
			machine.cores.push(core.fork());
			++core.registers[3]/*instruction pointer*/;
		},
		91 /*[*/: (core)=>{
			if(core.registers[0]/*accumulator*/ === 0){
				core.state = 3/*false if*/;
				core.nest = 1;
			}
			++core.registers[3]/*instruction pointer*/;
		},
		93 /*]*/: (core)=>{
			++core.registers[3]/*instruction pointer*/;
		},
		94 /*^*/: (core)=>{
			core.registers[0]/*accumulator*/ ^= core.registers[1]/*argument*/;
			++core.registers[3]/*instruction pointer*/;
		},
		97 /*a*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[1]/*argument*/;
			++core.registers[3]/*instruction pointer*/;
		},
		98 /*b*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[2]/*B*/;
			++core.registers[3]/*instruction pointer*/;
		},
		99 /*c*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[5]/*C*/;
			++core.registers[3]/*instruction pointer*/;
		},
		100 /*d*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[6]/*data address*/;
			++core.registers[3]/*instruction pointer*/;
		},
		101 /*e*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[7]/*E*/;
			++core.registers[3]/*instruction pointer*/;
		},
		105 /*i*/: (core, machine)=>{
			let input = (machine.inputCallbacks[core.registers[4]/*io port*/]||(()=>null))();
			if(input !== null && input !== undefined){
				core.registers[0]/*accumulator*/ = input;
				++core.registers[3]/*instruction pointer*/;
			}
		},
		106 /*instruction pointer*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[3]/*instruction pointer*/;
			++core.registers[3]/*instruction pointer*/;
		},
		109 /*m*/: (core)=>{
			core.registers[0]/*accumulator*/ = Math.min(core.registers[0]/*accumulator*/, core.registers[1]/*argument*/);
			++core.registers[3]/*instruction pointer*/;
		},
		111 /*o*/: (core, machine)=>{
			(machine.outputCallbacks[core.registers[4]/*io port*/]||(()=>{}))(core.registers[0]/*accumulator*/);
			++core.registers[3]/*instruction pointer*/;
		},
		112 /*p*/: (core)=>{
			core.registers[0]/*accumulator*/ = core.registers[4]/*io port*/;
			++core.registers[3]/*instruction pointer*/;
		},
		122 /*z*/: (core)=>{
			core.registers[0]/*accumulator*/ = 0;
			++core.registers[3]/*instruction pointer*/;
		},
		123 /*{*/: (core)=>{
			++core.registers[3]/*instruction pointer*/;
		},
		124 /*|*/: (core)=>{
			core.registers[0]/*accumulator*/ |= core.registers[1]/*argument*/;
			++core.registers[3]/*instruction pointer*/;
		},
		125 /*}*/: (core)=>{
			if(core.registers[0]/*accumulator*/ !== 0){
				core.state = 5/*repeat backtrack*/
				core.nest = 1;
				--core.registers[3]/*instruction pointer*/;
				return;
			}
			++core.registers[3]/*instruction pointer*/;
		},
	}

	core = 0;

	cores = [new Core];
	memory = new Uint8Array(1<<16);
	inputCallbacks = [];
	outputCallbacks = console.log;

	load(code)
	{
		this.memory.set([...code].map((char)=>char.charCodeAt()));
	}

	outputs(callbacks)
	{
		this.outputCallbacks = callbacks;
	}

	inputs(callbacks)
	{
		this.inputCallbacks = callbacks;
	}

	run(steps)
	{
		for(let step=0; step<steps; ++step){
			this.step();
		}
	}

	step(){
		let core = this.cores[this.core];
		let codebyte = this.memory[core.registers[3]/*instruction pointer*/ % this.memory.length];
		switch(core.state){
		case 1/*execution*/:
			let instruction = Machine.instructions[codebyte];
			if(!instruction){
				throw Error('Unknown instruction "' + String.fromCharCode(this.memory[core.registers[3]/*instruction pointer*/]) + '" (code ' + this.memory[core.registers[3]/*instruction pointer*/] + ') at address ' + core.registers[3]/*instruction pointer*/ + ' in ' + String.fromCharCode(...this.memory) + '.');
			}
			instruction(core, this);
			break;
		case 2/*comment*/:
			if(codebyte === 59/*;*/){
				core.state = 1/*execution*/;
			}
			++core.registers[3]/*instruction pointer*/;
			break;
		case 3/*false if*/:
			if(codebyte === 93/*]*/){
				--core.nest;
				if(core.nest === 0){
					core.state = 1/*execution*/;
				}
			}else if(codebyte === 91/*[*/){
				++core.nest;
			}else if(codebyte === 59/*;*/){
				core.state = 4/*false if comment*/
			}
			++core.registers[3]/*instruction pointer*/;
			break;
		case 4/*false if comment*/:
			if(codebyte === 10/*LF*/){
				core.state = 3/*false if*/;
			}
			++core.registers[3]/*instruction pointer*/;
			break;
		case 5/*repeat backtrack*/:
			if(codebyte === 123/*{*/){
				--core.nest;
				if(core.nest === 0){
					core.state = 1/*execution*/;
					++core.registers[3]/*instruction pointer*/;
					break;
				}
			}else if(codebyte === 125/*}*/){
				++core.nest;
			}else if(codebyte === 59/*;*/){
				core.state = 6/*repeat backtrack comment*/
			}
			--core.registers[3]/*instruction pointer*/;
			break;
		case 6/*repeat backtrack comment*/:
			if(codebyte === 59/*;*/){
				core.state = 5/*repeat backtrack*/;
			}
			--core.registers[3]/*instruction pointer*/;
		}
		this.core = (this.core + 1) % this.cores.length;
	}
}