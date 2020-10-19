import * as timer from "./timer.js";


const nodes = {};
["normal", "bio"].forEach(name => nodes[name] = document.querySelector(`#trash .${name} dd`));

const normalDay = 3;
const bioDay = 4;
const DAY = 24 * 60 * 60 * 1000;

function days(n) {
	switch (true) {
		case (n==1): return "den";
		case (n>=2 && n<=4): return "dny";
		default: return "dnů";
	}
}

function format(d) {
	let str = "";
	if (d == 0) {
		str = "dnes";
	} else if (d == 1) {
		str = "zítra";
	} else {
		str = `za ${d} ${days(d)}`;
	}

	if (d <= 1) { str = `${str}!`; }
	return str;
}

function update(t) {
	let day = t.getDay();
	let remainNormal = (normalDay - day + 7) % 7;


	let remainBio = (bioDay - day + 7) % 7;
	let bioDate = new Date(t.getTime() + remainBio*DAY);
	if (bioDate.getWeek() % 2 == 0) { remainBio += 7; }

	nodes.normal.innerHTML = format(remainNormal);
	nodes.bio.innerHTML = format(remainBio);
}

timer.on("day", update);

Date.prototype.getDayOfYear = function() {
	let onejan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((this - onejan) / DAY);
}

Date.prototype.getWeek = function() {
	let onejan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - onejan) / DAY) + onejan.getDay()+1)/7);
}

