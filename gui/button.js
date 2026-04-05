function implementButton(canvas, x,y, content, action)
{
	const ctx = canvas.getContext`2d`;
	ctx.font = '50px sans-serif';
	let {
		width,
		actualBoundingBoxAscent,
		actualBoundingBoxDescent
	} = ctx.measureText(content);
	ctx.fillRect(x,y, width,actualBoundingBoxAscent+actualBoundingBoxDescent+3);
	ctx.fillStyle = 'white';
	ctx.fillText(content, x,y+actualBoundingBoxAscent+actualBoundingBoxDescent);

	canvas.addEventListener('click', (data)=>{
		const rect = canvas.getBoundingClientRect();
		const mouse = {
			x: data.clientX - rect.left,
			y: data.clientY - rect.top
		};

		if(mouse.x<x || mouse.x>x+width, mouse.y<y || mouse.y>y+actualBoundingBoxAscent+actualBoundingBoxDescent+3){
			return;
		}

		action();
	});
}