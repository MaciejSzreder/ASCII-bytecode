class Machine{
	static execute(code, steps, input=[])
	{
		let machine = new Machine;
		machine.load(code);
		let output = [];
		machine.output((data) => output.push(data))
		machine.input(()=>input.shift())

		machine.run(steps);

		return output;
	}

	static instructions={
		0 /*NUL*/: (machine)=>{
			machine.#IP = 0;
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
		43 /*+*/: (machine)=>{
			machine.#ACC += machine.#A;
			++machine.#IP;
		},
		65 /*A*/: (machine)=>{
			machine.#A = machine.#ACC;
			++machine.#IP;
		},
		97 /*a*/: (machine)=>{
			machine.#ACC = machine.#A;
			++machine.#IP;
		},
		105 /*i*/: (machine)=>{
			let input = machine.#inputCallback();
			if(input !== null && input !== undefined){
				machine.#ACC = input;
				++machine.#IP;
			}
		},
		111 /*o*/: (machine)=>{
			machine.#outputCallback(machine.#ACC);
			++machine.#IP;
		},
	}

	#memory = new Uint8Array(256);
	#outputCallback = console.log;
	#inputCallback = ()=>null;
	#IP = 0;
	#ACC = 0;
	#A = 0;

	load(code)
	{
		this.#memory.set([...code].map((char)=>char.charCodeAt()));
	}

	output(callback)
	{
		this.#outputCallback = callback;
	}

	input(callback)
	{
		this.#inputCallback = callback;
	}

	run(steps)
	{
		for(let step=0; step<steps; ++step){
			this.step();
		}
	}

	step(){
		Machine.instructions[this.#memory[this.#IP]](this)
	}
}