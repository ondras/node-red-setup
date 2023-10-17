import * as timer from "./timer.js";
import * as svg from "./svg.js";


function toNumber(time) { return Number(time.replace(/\D/g, "")); }

function buildDeparture(d) {
	let node = document.createElement("li");
	node.textContent = d.time.split(":").slice(0, 2).join(":");
	node.dataset.index = d.index;
	return node;
}

function merge(data) {
	let result = [];
	data.forEach(d => result = result.concat(d));
	return result;
}

function CMP(a, b) {
	let t1 = toNumber(a.time);
	let t2 = toNumber(b.time);
	return t1-t2;
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
		parent.append(this._dom.node);

		timer.on("day", t => this._update(t));
		timer.on("minute", t => this._show(t));
	}

	_build() {
		let node = document.createElement("div");
		let header = document.createElement("header");

		svg.create(this._conf.icon).then(svg => {
			let line = document.createElement("span");
			line.classList.add("line");
			line.textContent = this._conf.line;
			
			let headsign = document.createElement("span");
			headsign.classList.add("headsign");
			
			[].concat(this._conf.headsign).forEach((h, i) => {
				i && headsign.append(document.createElement("br"));
				let span = document.createElement("span");
				span.dataset.index = i;
				span.textContent = h;
				headsign.append(span);
			});

			header.append(svg, line, headsign);
		});

		let departures = document.createElement("ul");

		node.append(header, departures);

		return {node, departures};
	}

	async _update(t) {
		let headsigns = [].concat(this._conf.headsign);
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

		let promises = headsigns.map(async (trip_headsign, index) => {
			let departures = await api("departures", {stop_ids, route_id, trip_headsign, date});
			return departures.map(time => ({ index, time }));
		});

		let resolved = await Promise.all(promises);
		let departures = merge(resolved);
		this._departures = departures.sort(CMP);

		this._show(t);
	}

	async _show(t, departures) {
		let time = `${t.getHours()}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}`;
		let num = toNumber(time);
		let next = this._departures.filter(d => toNumber(d.time) > num).slice(0, 3);
		let nodes = next.map(buildDeparture);

		let node = this._dom.departures;
		node.replaceChildren(...nodes);
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
	headsign: ["Komořany", "Sídliště Zbraslav"]
}, node);

