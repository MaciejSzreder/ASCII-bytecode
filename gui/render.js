let objects = [];

document.addEventListener('DOMContentLoaded', ()=>{
	let canvas = document.getElementById`main`;
	let ctx = canvas.getContext`2d`;

	requestAnimationFrame(function drawObjects(){
		for(let object of objects){
			object.draw(ctx);
		}
		requestAnimationFrame(drawObjects);
	});

	canvas.addEventListener('click', (event)=>{
		const rect = canvas.getBoundingClientRect();
		const mouse = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};

		for(let object of objects){
			if(inRectangle(mouse, object.hitBox)){
				object.click();
			}
		}
	});
});

function render(object)
{
	objects.push(object);
}

function inRectangle(point, rectangle)
{
	return rectangle.x <= point.x
		&& point.x <= rectangle.x + rectangle.width
		&& rectangle.y <= point.y
		&& point.y <= rectangle.y + rectangle.height;
}