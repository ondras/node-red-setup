import * as timer from "./timer.js";


const nodes = {};
["temperature", "humidity", "wind"].forEach(name => nodes[name] = document.querySelector(`#weather .${name}`));

function buildRow(hours, item) {
	let row = node.insertRow();
	row.insertCell().innerHTML = `${hours}<sup>00</sup>`;

	let img = document.createElement("img");
	img.src = `https://api.met.no/images/weathericons/svg/${item.symbol}.svg`;
	row.insertCell().appendChild(img);

	row.insertCell().textContent = `${item.temperature} °C`;
}

async function update(t) {
	let r = await fetch("weather/current");
	let data = await r.json();

	data = data[0];
	nodes.temperature.querySelector("dd").textContent = (data ? `${data.temperature} °C` : "");
	nodes.temperature.dataset.warm = (data && data.temperature > 0 ? "1" : "0");
	nodes.humidity.querySelector("dd").textContent = (data ? `${data.humidity} %` : "");
	
	r = await fetch("weather");
	data = await r.json();
	data.sort((a, b) => {
		let dta = new Date(a.time).getTime() - t.getTime();
		let dtb = new Date(b.time).getTime() - t.getTime();
		return Math.abs(dta) - Math.abs(dtb);
	});
	data = data[0];

	nodes.wind.querySelector("dd").textContent = `${data.wind_speed} m/s`;
}

timer.on("minute", update);

