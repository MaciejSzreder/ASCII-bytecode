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

	static instructions={
		0 /*NUL*/: (machine)=>{
			machine.#IP = 0;
		},
		9 /*HT*/: (machine)=>{
			++machine.#IP;
		},
		10 /*LF*/: (machine)=>{
			++machine.#IP;
		},
		32 /* */: (machine)=>{
			++machine.#IP;
		},
		42 /***/: (machine)=>{
			machine.#ACC *= machine.#A;
			++machine.#IP;
		},
		43 /*+*/: (machine)=>{
			machine.#ACC += machine.#A;
			++machine.#IP;
		},
		45 /*-*/: (machine)=>{
			machine.#ACC -= machine.#A;
			++machine.#IP;
		},
		48 /*0*/: (machine)=>{
			machine.#ACC *= 10;
			++machine.#IP;
		},
		49 /*1*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 1;
			++machine.#IP;
		},
		50 /*2*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 2;
			++machine.#IP;
		},
		51 /*3*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 3;
			++machine.#IP;
		},
		52 /*4*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 4;
			++machine.#IP;
		},
		53 /*5*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 5;
			++machine.#IP;
		},
		54 /*6*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 6;
			++machine.#IP;
		},
		55 /*7*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 7;
			++machine.#IP;
		},
		56 /*8*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 8;
			++machine.#IP;
		},
		57 /*9*/: (machine)=>{
			machine.#ACC = machine.#ACC * 10 + 9;
			++machine.#IP;
		},
		59 /*;*/: (machine)=>{
			machine.#comment = true;
			++machine.#IP;
		},
		60 /*<*/: (machine)=>{
			machine.#ACC = machine.#ACC < machine.#A ? 1 : 0;
			++machine.#IP;
		},
		61 /*=*/: (machine)=>{
			machine.#ACC = machine.#ACC == machine.#A ? 1 : 0;
			++machine.#IP;
		},
		62 /*>*/: (machine)=>{
			machine.#ACC = machine.#ACC > machine.#A ? 1 : 0;
			++machine.#IP;
		},
		65 /*A*/: (machine)=>{
			machine.#A = machine.#ACC;
			++machine.#IP;
		},
		66 /*B*/: (machine)=>{
			machine.#B = machine.#ACC;
			++machine.#IP;
		},
		77 /*M*/: (machine)=>{
			machine.#ACC = Math.max(machine.#ACC, machine.#A);
			++machine.#IP;
		},
		80 /*P*/: (machine)=>{
			machine.#IOI = machine.#ACC;
			++machine.#IP;
		},
		97 /*a*/: (machine)=>{
			machine.#ACC = machine.#A;
			++machine.#IP;
		},
		98 /*b*/: (machine)=>{
			machine.#ACC = machine.#B;
			++machine.#IP;
		},
		105 /*i*/: (machine)=>{
			let input = (machine.#inputCallbacks[machine.#IOI]||(()=>null))();
			if(input !== null && input !== undefined){
				machine.#ACC = input;
				++machine.#IP;
			}
		},
		109 /*m*/: (machine)=>{
			machine.#ACC = Math.min(machine.#ACC, machine.#A);
			++machine.#IP;
		},
		111 /*o*/: (machine)=>{
			(machine.#outputCallbacks[machine.#IOI]||(()=>{}))(machine.#ACC);
			++machine.#IP;
		},
		112 /*p*/: (machine)=>{
			machine.#ACC = machine.#IOI;
			++machine.#IP;
		},
		122 /*z*/: (machine)=>{
			machine.#ACC = 0;
			++machine.#IP;
		},
	}

	#memory = new Uint8Array(256);
	#outputCallbacks = console.log;
	#inputCallbacks = [];
	#IP = 0;
	#ACC = 0;
	#IOI = 0;
	#A = 0;
	#B = 0;
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
		let codebyte = this.#memory[this.#IP];
		if(this.#comment){
			if(codebyte === 10 /*LF*/){
				this.#comment = false;
			}
			++this.#IP;
		}else{
			let instruction = Machine.instructions[codebyte];
			if(!instruction){
				throw Error('Unknown instruction "' + String.fromCharCode(this.#memory[this.#IP]) + '"=' + this.#memory[this.#IP] + ' at ' + this.#IP + ' in ' + String.fromCharCode(...this.#memory));
			}
			instruction(this)
		}
	}
}