import * as timer from "./timer.js";
import * as svg from "./svg.js";


function toNumber(time) { return Number(time.replace(/\D/g, "")); }

function buildDeparture(time) {
	let node = document.createElement("li");
	node.textContent = time.split(":").slice(0, 2).join(":");
	return node;
}

async function api(method, params) {
	let qs = Object.entries(params).map(pair => pair.map(encodeURIComponent).join("=")).join("&");
	let r = await fetch(`/gtfs/${method}?${qs}`);
	return r.json();
}

class Departures {
	constructor(conf, parent) {
		this._conf = conf;
		this._dom = this._build();
		this._departures = [];
		parent.appendChild(this._dom.node);

		timer.on("day", t => this._update(t));
		timer.on("minute", t => this._show(t));
	}

	_build() {
		let node = document.createElement("div");

		let header = document.createElement("header");

		svg.create(this._conf.icon).then(svg => {
			header.appendChild(svg);

			let line = document.createElement("span");
			line.classList.add("line");
			line.textContent = this._conf.line;
			header.appendChild(line);
			
			let headsign = document.createElement("span");
			headsign.classList.add("headsign");
			headsign.textContent = this._conf.headsign;
			header.appendChild(headsign);
		});
		node.appendChild(header);

		let departures = document.createElement("ul");
		node.appendChild(departures);

		return {node, departures};
	}

	async _update(t) {
		let trip_headsign = this._conf.headsign;
		let stop = this._conf.stop;

		let data = await api("stops", {stop});
		let stop_ids = data.map(item => item.stop_id).join(",");

		data = await api("lines", {stop});
		let route_id = data.filter(item => item.route_short_name == this._conf.line)[0].route_id;

		let date = [
			t.getFullYear(),
			t.getMonth()+1,
			t.getDate()
		].join("-");

		this._departures = await api("departures", {stop_ids, route_id, trip_headsign, date});
		this._show(t);
	}

	async _show(t) {
		let time = `${t.getHours()}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}`;
		let num = toNumber(time);
		let next = this._departures.filter(d => toNumber(d) > num).slice(0, 3);
		let nodes = next.map(buildDeparture);

		let node = this._dom.departures;
		node.innerHTML = "";
		nodes.forEach(n => node.appendChild(n));
	}
}

const node = document.querySelector("#transport");

new Departures({
	stop: "Družná",
	line: "190",
	icon: "bus",
	headsign: "Smíchovské nádraží"
}, node);


new Departures({
	stop: "Družná",
	line: "139",
	icon: "bus",
	headsign: "Komořany"
}, node);

