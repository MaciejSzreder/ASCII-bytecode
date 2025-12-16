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
		}while(machine.#registers[3]/*J*/ !== 0);

		return output;
	}

	static instructions={
		0 /*NUL*/: (machine)=>{
			machine.#registers[3]/*J*/ = 0;
		},
		9 /*HT*/: (machine)=>{
			++machine.#registers[3]/*J*/;
		},
		10 /*LF*/: (machine)=>{
			++machine.#registers[3]/*J*/;
		},
		32 /* */: (machine)=>{
			++machine.#registers[3]/*J*/;
		},
		38 /*&*/: (machine)=>{
			machine.#registers[0]/*ACC*/ &= machine.#registers[1]/*A*/;
			++machine.#registers[3]/*J*/;
		},
		42 /***/: (machine)=>{
			machine.#registers[0]/*ACC*/ *= machine.#registers[1]/*A*/;
			++machine.#registers[3]/*J*/;
		},
		43 /*+*/: (machine)=>{
			machine.#registers[0]/*ACC*/ += machine.#registers[1]/*A*/;
			++machine.#registers[3]/*J*/;
		},
		45 /*-*/: (machine)=>{
			machine.#registers[0]/*ACC*/ -= machine.#registers[1]/*A*/;
			++machine.#registers[3]/*J*/;
		},
		48 /*0*/: (machine)=>{
			machine.#registers[0]/*ACC*/ *= 10;
			++machine.#registers[3]/*J*/;
		},
		49 /*1*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 1;
			++machine.#registers[3]/*J*/;
		},
		50 /*2*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 2;
			++machine.#registers[3]/*J*/;
		},
		51 /*3*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 3;
			++machine.#registers[3]/*J*/;
		},
		52 /*4*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 4;
			++machine.#registers[3]/*J*/;
		},
		53 /*5*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 5;
			++machine.#registers[3]/*J*/;
		},
		54 /*6*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 6;
			++machine.#registers[3]/*J*/;
		},
		55 /*7*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 7;
			++machine.#registers[3]/*J*/;
		},
		56 /*8*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 8;
			++machine.#registers[3]/*J*/;
		},
		57 /*9*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ * 10 + 9;
			++machine.#registers[3]/*J*/;
		},
		59 /*;*/: (machine)=>{
			machine.#comment = true;
			++machine.#registers[3]/*J*/;
		},
		60 /*<*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ < machine.#registers[1]/*A*/ ? 1 : 0;
			++machine.#registers[3]/*J*/;
		},
		61 /*=*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ == machine.#registers[1]/*A*/ ? 1 : 0;
			++machine.#registers[3]/*J*/;
		},
		62 /*>*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[0]/*ACC*/ > machine.#registers[1]/*A*/ ? 1 : 0;
			++machine.#registers[3]/*J*/;
		},
		65 /*A*/: (machine)=>{
			machine.#registers[1]/*A*/ = machine.#registers[0]/*ACC*/;
			++machine.#registers[3]/*J*/;
		},
		66 /*B*/: (machine)=>{
			machine.#registers[2]/*B*/ = machine.#registers[0]/*ACC*/;
			++machine.#registers[3]/*J*/;
		},
		67 /*C*/: (machine)=>{
			machine.#registers[5]/*C*/ = machine.#registers[0]/*ACC*/;
			++machine.#registers[3]/*J*/;
		},
		68 /*D*/: (machine)=>{
			machine.#registers[6]/*D*/ = machine.#registers[0]/*ACC*/;
			++machine.#registers[3]/*J*/;
		},
		74 /*J*/: (machine)=>{
			machine.#registers[3]/*J*/ = machine.#registers[0]/*ACC*/;
		},
		77 /*M*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = Math.max(machine.#registers[0]/*ACC*/, machine.#registers[1]/*A*/);
			++machine.#registers[3]/*J*/;
		},
		80 /*P*/: (machine)=>{
			machine.#registers[4]/*P*/ = machine.#registers[0]/*ACC*/;
			++machine.#registers[3]/*J*/;
		},
		97 /*a*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[1]/*A*/;
			++machine.#registers[3]/*J*/;
		},
		98 /*b*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[2]/*B*/;
			++machine.#registers[3]/*J*/;
		},
		99 /*c*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[5]/*C*/;
			++machine.#registers[3]/*J*/;
		},
		100 /*d*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[6]/*D*/;
			++machine.#registers[3]/*J*/;
		},
		105 /*i*/: (machine)=>{
			let input = (machine.#inputCallbacks[machine.#registers[4]/*P*/]||(()=>null))();
			if(input !== null && input !== undefined){
				machine.#registers[0]/*ACC*/ = input;
				++machine.#registers[3]/*J*/;
			}
		},
		106 /*j*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[3]/*J*/;
			++machine.#registers[3]/*J*/;
		},
		109 /*m*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = Math.min(machine.#registers[0]/*ACC*/, machine.#registers[1]/*A*/);
			++machine.#registers[3]/*J*/;
		},
		111 /*o*/: (machine)=>{
			(machine.#outputCallbacks[machine.#registers[4]/*P*/]||(()=>{}))(machine.#registers[0]/*ACC*/);
			++machine.#registers[3]/*J*/;
		},
		112 /*p*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = machine.#registers[4]/*P*/;
			++machine.#registers[3]/*J*/;
		},
		122 /*z*/: (machine)=>{
			machine.#registers[0]/*ACC*/ = 0;
			++machine.#registers[3]/*J*/;
		},
	}

	#memory = new Uint8Array(1<<16);
	#outputCallbacks = console.log;
	#inputCallbacks = [];
	#registers = new Int16Array(7);/*
		0	ACC
		1	A
		2	B
		3	J
		4	P
		5	C
		6   D
	*/
	#comment = false;

	load(code)
	{
		this.#memory.set([...code].map((char)=>char.charCodeAt()));
	}

	outputs(callbacks)
	{
		this.#outputCallbacks = callbacks;
	}

	inputs(callbacks)
	{
		this.#inputCallbacks = callbacks;
	}

	run(steps)
	{
		for(let step=0; step<steps; ++step){
			this.step();
		}
	}

	step(){
		let codebyte = this.#memory[this.#registers[3]/*J*/ % this.#memory.length];
		if(this.#comment){
			if(codebyte === 10 /*LF*/){
				this.#comment = false;
			}
			++this.#registers[3]/*J*/;
		}else{
			let instruction = Machine.instructions[codebyte];
			if(!instruction){
				throw Error('Unknown instruction "' + String.fromCharCode(this.#memory[this.#registers[3]/*J*/]) + '" (code ' + this.#memory[this.#registers[3]/*J*/] + ') at address ' + this.#registers[3]/*J*/ + ' in ' + String.fromCharCode(...this.#memory) + '.');
			}
			instruction(this)
		}
	}
}