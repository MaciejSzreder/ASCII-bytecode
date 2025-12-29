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
		this.registers = new Int16Array(registers || 7);
	}

	fork()
	{
		let fork = new Core(this.registers);
		fork.registers[3]/*J*/ = this.registers[0]/*ACC*/;
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
		}while(machine.cores[0].registers[3]/*J*/ !== 0);

		return output;
	}

	static instructions={
		0 /*NUL*/: (core)=>{
			core.registers[3]/*J*/ = 0;
		},
		9 /*HT*/: (core)=>{
			++core.registers[3]/*J*/;
		},
		10 /*LF*/: (core)=>{
			++core.registers[3]/*J*/;
		},
		32 /* */: (core)=>{
			++core.registers[3]/*J*/;
		},
		36 /*$*/: (core, machine)=>{
			machine.memory[core.registers[6]/*data address*/] = core.registers[0]/*ACC*/
			++core.registers[3]/*J*/;
		},
		37 /*%*/: (core)=>{
			core.registers[0]/*ACC*/ = ((core.registers[0]/*ACC*/%core.registers[1]/*A*/)+core.registers[1]/*A*/)%core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
		38 /*&*/: (core)=>{
			core.registers[0]/*ACC*/ &= core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
		42 /***/: (core)=>{
			core.registers[0]/*ACC*/ *= core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
		43 /*+*/: (core)=>{
			core.registers[0]/*ACC*/ += core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
		45 /*-*/: (core)=>{
			core.registers[0]/*ACC*/ -= core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
		48 /*0*/: (core)=>{
			core.registers[0]/*ACC*/ *= 10;
			++core.registers[3]/*J*/;
		},
		49 /*1*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 1;
			++core.registers[3]/*J*/;
		},
		50 /*2*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 2;
			++core.registers[3]/*J*/;
		},
		51 /*3*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 3;
			++core.registers[3]/*J*/;
		},
		52 /*4*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 4;
			++core.registers[3]/*J*/;
		},
		53 /*5*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 5;
			++core.registers[3]/*J*/;
		},
		54 /*6*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 6;
			++core.registers[3]/*J*/;
		},
		55 /*7*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 7;
			++core.registers[3]/*J*/;
		},
		56 /*8*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 8;
			++core.registers[3]/*J*/;
		},
		57 /*9*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 10 + 9;
			++core.registers[3]/*J*/;
		},
		59 /*;*/: (core)=>{
			core.state = 2/*comment*/;
			++core.registers[3]/*J*/;
		},
		60 /*<*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ < core.registers[1]/*A*/ ? 1 : 0;
			++core.registers[3]/*J*/;
		},
		61 /*=*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ == core.registers[1]/*A*/ ? 1 : 0;
			++core.registers[3]/*J*/;
		},
		62 /*>*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ > core.registers[1]/*A*/ ? 1 : 0;
			++core.registers[3]/*J*/;
		},
		64 /*@*/: (core, machine)=>{
			core.registers[0]/*ACC*/ = machine.memory[core.registers[6]/*data address*/];
			++core.registers[3]/*J*/;
		},
		65 /*A*/: (core)=>{
			core.registers[1]/*A*/ = core.registers[0]/*ACC*/;
			++core.registers[3]/*J*/;
		},
		66 /*B*/: (core)=>{
			core.registers[2]/*B*/ = core.registers[0]/*ACC*/;
			++core.registers[3]/*J*/;
		},
		67 /*C*/: (core)=>{
			core.registers[5]/*C*/ = core.registers[0]/*ACC*/;
			++core.registers[3]/*J*/;
		},
		68 /*D*/: (core)=>{
			core.registers[6]/*D*/ = core.registers[0]/*ACC*/;
			++core.registers[3]/*J*/;
		},
		73 /*I*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 2 + 1;
			++core.registers[3]/*J*/;
		},
		74 /*J*/: (core)=>{
			core.registers[3]/*J*/ = core.registers[0]/*ACC*/;
		},
		77 /*M*/: (core)=>{
			core.registers[0]/*ACC*/ = Math.max(core.registers[0]/*ACC*/, core.registers[1]/*A*/);
			++core.registers[3]/*J*/;
		},
		79 /*O*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[0]/*ACC*/ * 2;
			++core.registers[3]/*J*/;
		},
		80 /*P*/: (core)=>{
			core.registers[4]/*P*/ = core.registers[0]/*ACC*/;
			++core.registers[3]/*J*/;
		},
		89 /*Y*/: (core,machine)=>{
			machine.cores.push(core.fork());
			++core.registers[3]/*J*/;
		},
		91 /*[*/: (core)=>{
			if(core.registers[0]/*ACC*/ === 0){
				core.state = 3/*false if*/;
				core.nest = 1;
			}
			++core.registers[3]/*J*/;
		},
		93 /*]*/: (core)=>{
			++core.registers[3]/*J*/;
		},
		94 /*^*/: (core)=>{
			core.registers[0]/*ACC*/ ^= core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
		97 /*a*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
		98 /*b*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[2]/*B*/;
			++core.registers[3]/*J*/;
		},
		99 /*c*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[5]/*C*/;
			++core.registers[3]/*J*/;
		},
		100 /*d*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[6]/*D*/;
			++core.registers[3]/*J*/;
		},
		105 /*i*/: (core, machine)=>{
			let input = (machine.inputCallbacks[core.registers[4]/*P*/]||(()=>null))();
			if(input !== null && input !== undefined){
				core.registers[0]/*ACC*/ = input;
				++core.registers[3]/*J*/;
			}
		},
		106 /*j*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[3]/*J*/;
			++core.registers[3]/*J*/;
		},
		109 /*m*/: (core)=>{
			core.registers[0]/*ACC*/ = Math.min(core.registers[0]/*ACC*/, core.registers[1]/*A*/);
			++core.registers[3]/*J*/;
		},
		111 /*o*/: (core, machine)=>{
			(machine.outputCallbacks[core.registers[4]/*P*/]||(()=>{}))(core.registers[0]/*ACC*/);
			++core.registers[3]/*J*/;
		},
		112 /*p*/: (core)=>{
			core.registers[0]/*ACC*/ = core.registers[4]/*P*/;
			++core.registers[3]/*J*/;
		},
		122 /*z*/: (core)=>{
			core.registers[0]/*ACC*/ = 0;
			++core.registers[3]/*J*/;
		},
		123 /*{*/: (core)=>{
			++core.registers[3]/*J*/;
		},
		124 /*|*/: (core)=>{
			core.registers[0]/*ACC*/ |= core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
		125 /*}*/: (core)=>{
			if(core.registers[0]/*ACC*/ !== 0){
				core.state = 5/*repeat backtrack*/
				core.nest = 1;
				--core.registers[3]/*J*/;
				return;
			}
			++core.registers[3]/*J*/;
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
		let codebyte = this.memory[core.registers[3]/*J*/ % this.memory.length];
		switch(core.state){
		case 1/*execution*/:
			let instruction = Machine.instructions[codebyte];
			if(!instruction){
				throw Error('Unknown instruction "' + String.fromCharCode(this.memory[core.registers[3]/*J*/]) + '" (code ' + this.memory[core.registers[3]/*J*/] + ') at address ' + core.registers[3]/*J*/ + ' in ' + String.fromCharCode(...this.memory) + '.');
			}
			instruction(core, this);
			break;
		case 2/*comment*/:
			if(codebyte === 59/*;*/){
				core.state = 1/*execution*/;
			}
			++core.registers[3]/*J*/;
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
			++core.registers[3]/*J*/;
			break;
		case 4/*false if comment*/:
			if(codebyte === 10/*LF*/){
				core.state = 3/*false if*/;
			}
			++core.registers[3]/*J*/;
			break;
		case 5/*repeat backtrack*/:
			if(codebyte === 123/*{*/){
				--core.nest;
				if(core.nest === 0){
					core.state = 1/*execution*/;
					++core.registers[3]/*J*/;
					break;
				}
			}else if(codebyte === 125/*}*/){
				++core.nest;
			}else if(codebyte === 59/*;*/){
				core.state = 6/*repeat backtrack comment*/
			}
			--core.registers[3]/*J*/;
			break;
		case 6/*repeat backtrack comment*/:
			if(codebyte === 59/*;*/){
				core.state = 5/*repeat backtrack*/;
			}
			--core.registers[3]/*J*/;
		}
		this.core = (this.core + 1) % this.cores.length;
	}
}