class Machine{
	static execute(code, steps)
	{
		let machine = new Machine;
		machine.load(code);
		let output = [];
		machine.output((data) => output.push(data))

		machine.run(steps);

		return output;
	}

	#memory = new Uint8Array(256);
	#outputCallback = console.log;

	load(code)
	{
		this.#memory.set([...code].map((char)=>char.charCodeAt()));
	}

	output(callback)
	{
		this.#outputCallback = callback;
	}

	run(steps)
	{
		for(let step=0; step<steps; ++step){
			this.step();
		}
	}

	step(){
		if(this.#memory[0] === 79){ // 'O'
			this.#outputCallback(0);
		}
	}
}