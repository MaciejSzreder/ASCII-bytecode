import color from './colors.js';

export default class Cable
{
	static width = 20;
	static color = color.light;
	
	constructor(source, destination)
	{
		this.source = source;
		this.destination = destination;
	}

	draw(ctx)
	{
		ctx.strokeStyle = Cable.color;
		ctx.lineWidth = Cable.width;
		ctx.beginPath();
		ctx.moveTo(this.source.hitBox.x, this.source.hitBox.y);
		ctx.lineTo(this.destination.hitBox.x, this.destination.hitBox.y);
		ctx.stroke();
	}
}