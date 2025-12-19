class Core{
	registers
	comment = false

	memory
	inputCallbacks
	outputCallbacks

	constructor(registers, memory, inputCallbacks, outputCallbacks)
	{
		this.registers = new Int16Array(registers || 7);
		this.memory = memory || new Uint8Array(1<<16);
		this.inputCallbacks = inputCallbacks || [];
		this.outputCallbacks = outputCallbacks || console.log;
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
		}while(machine.core.registers[3]/*J*/ !== 0);

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
			core.comment = true;
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
		105 /*i*/: (core)=>{
			let input = (core.inputCallbacks[core.registers[4]/*P*/]||(()=>null))();
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
		111 /*o*/: (core)=>{
			(core.outputCallbacks[core.registers[4]/*P*/]||(()=>{}))(core.registers[0]/*ACC*/);
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
		124 /*|*/: (core)=>{
			core.registers[0]/*ACC*/ |= core.registers[1]/*A*/;
			++core.registers[3]/*J*/;
		},
	}

	core = new Core;

	load(code)
	{
		this.core.memory.set([...code].map((char)=>char.charCodeAt()));
	}

	outputs(callbacks)
	{
		this.core.outputCallbacks = callbacks;
	}

	inputs(callbacks)
	{
		this.core.inputCallbacks = callbacks;
	}

	run(steps)
	{
		for(let step=0; step<steps; ++step){
			this.step();
		}
	}

	step(){
		let codebyte = this.core.memory[this.core.registers[3]/*J*/ % this.core.memory.length];
		if(this.core.comment){
			if(codebyte === 10 /*LF*/){
				this.core.comment = false;
			}
			++this.core.registers[3]/*J*/;
		}else{
			let instruction = Machine.instructions[codebyte];
			if(!instruction){
				throw Error('Unknown instruction "' + String.fromCharCode(this.core.memory[this.core.registers[3]/*J*/]) + '" (code ' + this.core.memory[this.core.registers[3]/*J*/] + ') at address ' + this.core.registers[3]/*J*/ + ' in ' + String.fromCharCode(...this.core.memory) + '.');
			}
			instruction(this.core)
		}
	}
}