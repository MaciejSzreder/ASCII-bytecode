let d

function dev()
{
	if(d)
		return d;

	return import('./tools.js').then(dev=>{
		d=dev;
	});
}

if(new URLSearchParams(window.location.search).get('fps') === 'render'){
	dev().then(()=>{
		d.render_fps()
	});
}
