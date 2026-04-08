let objects = [];

document.addEventListener('DOMContentLoaded', ()=>{
	let canvas = document.getElementById`main`;
	let ctx = canvas.getContext`2d`;

	let mouse = {};

	canvas.addEventListener('mousemove', (event)=>{
		const rect = canvas.getBoundingClientRect();
		mouse = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};

	});

	requestAnimationFrame(function drawObjects(){
		for(let object of objects){
			mouse.isOver = inRectangle(mouse, object.hitBox);
			object.draw(ctx, {mouse});
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
			if(object.click && object.hitBox && inRectangle(mouse, object.hitBox)){
				let localMouse = {
					x: mouse.x - object.hitBox.x,
					y: mouse.y - object.hitBox.y
				};
				object.click(localMouse);
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