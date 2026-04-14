class Screen
{
	constructor(x,y,source)
	{
		this.x = x;
		this.y = y;
		this.source = source;
	}

	hitBox()
	{
		return this.hitBox;
	}

	draw(ctx)
	{
		const image = this.source();
		
		let hitBox = {
			x: this.x,
			y: this.y,
			width: image.length,
			height: image[0].length
		};

		for(let x=0; x<image.length; ++x){
			for(let z=0; z<image[x].length; ++z){
				const [r,g,b] = image[x][z];
				ctx.fillStyle = `rgb(${r&255},${g&255},${b&255})`;
				ctx.fillRect(hitBox.x+x,hitBox.y+z,1,1);
			}
		}

		this.hitBox = hitBox;
	}
}