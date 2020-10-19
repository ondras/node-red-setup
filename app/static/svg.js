export async function create(name) {
	const src = `https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/master/svg/${name}.svg`;
	let r = await fetch(src);
	let span = document.createElement("span");
	span.innerHTML = await r.text();
	let svg = span.firstElementChild;
	svg.classList.add(name);
	return svg;
}

async function inlineSvg(img) {
	let svg = await create(img.dataset.icon);
	img.parentNode.replaceChild(svg, img);
}

[...document.querySelectorAll("img[data-icon]")].forEach(inlineSvg);

