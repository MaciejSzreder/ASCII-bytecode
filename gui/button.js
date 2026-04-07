class Button
{
	font = '50px sans-serif';
	textColor = 'white';
	buttonColor = 'black';
	constructor(x,y,content,action)
	{
		this.x = x;
		this.y = y;
		this.content = content;
		this.action = action;
	}

	hitBox()
	{
		return this.hitBox;
	}

	draw(ctx)
	{
		ctx.font = this.font;
		let {
			width,
			actualBoundingBoxAscent,
			actualBoundingBoxDescent
		} = ctx.measureText(this.content);
		let hitBox = {
			x: this.x,
			y: this.y,
			width: width,
			height: actualBoundingBoxAscent+actualBoundingBoxDescent+2
		};
		ctx.fillStyle = this.buttonColor;
		ctx.fillRect(hitBox.x,hitBox.y, hitBox.width,hitBox.height);
		ctx.fillStyle = this.textColor;
		ctx.fillText(this.content, hitBox.x,hitBox.y+hitBox.height-3);

		this.hitBox = hitBox;
	}

	click()
	{
		this.action();
	}
}