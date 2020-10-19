import * as timer from "./timer.js";


const dateFormat = new Intl.DateTimeFormat("cs", {dateStyle:"full"});
const node = document.querySelector("#calendar");


async function svatek() {
	let headers = {"accept":"application/json"};
	let r = await fetch("https://svatky.vanio.cz/api/", {headers});
	let data = await r.json();
	return data.name;
}

async function update(t) {
	let s = await svatek();
	let doy = t.getDayOfYear();
	let type = (doy % 2 ? "ovocný" : "dobrůtkový");

	node.textContent = `${type} den, `  + dateFormat.format(t) + `, svátek má ${s}`;
}

timer.on("hour", update);

