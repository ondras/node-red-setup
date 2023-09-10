import * as timer from "./timer.js";


const nodes = {};
["temperature", "humidity", "wind"].forEach(name => nodes[name] = document.querySelector(`#weather .${name}`));
const HOUR = 60*60;

function buildRow(hours, item) {
	let row = node.insertRow();
	row.insertCell().innerHTML = `${hours}<sup>00</sup>`;

	let img = document.createElement("img");
	img.src = `https://api.met.no/images/weathericons/svg/${item.symbol}.svg`;
	row.insertCell().appendChild(img);

	row.insertCell().textContent = `${item.temperature} °C`;
}

async function promQuery(metric, location) {
	let query = `${metric}{location="${location}"}`;
	let r = await fetch(`http://nas.home:9090/api/v1/query?query=${encodeURIComponent(query)}`);
	let data = await r.json();
	let result = data.data.result;
	if (result.length == 0) { return null; }
	let value = result[0].value;
	let age = Date.now()/1000 - value[0];
	return (age < HOUR ? value[1] : null);
}

async function update(t) {
	let temp = await promQuery("env_temperature_celsius", "zahrada");
	let hum = await promQuery("env_humidity_percent", "zahrada");
	if (temp === null) { temp = await promQuery("env_temperature_celsius", "mw"); }

	nodes.temperature.querySelector("dd").textContent = (temp === null ? "" : `${temp} °C`);
	nodes.temperature.dataset.warm = (temp !== null && temp > 0 ? "1" : "0");
	nodes.humidity.querySelector("dd").textContent = (hum === null ? "" : `${hum} %`);
	
	let r = await fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lon=14.413&lat=50.013");
	let data = await r.json();
	let item = data.properties.timeseries[0];
	nodes.wind.querySelector("dd").textContent = `${item.data.instant.details.wind_speed} m/s`;
}

timer.on("minute", update);

