let storage = [];

let old = null;

function tick() {
	let now = new Date();
	let changed = [];

	(!old || old.getSeconds() != now.getSeconds()) && changed.push("second");
	(!old || old.getMinutes() != now.getMinutes()) && changed.push("minute");
	(!old || old.getHours() != now.getHours()) && changed.push("hour");
	(!old || old.getDate() != now.getDate()) && changed.push("day");

	storage.forEach(item => changed.includes(item.event) && item.cb(now));

	old = now;
	let ms = now.getTime() % 1000;
	setTimeout(tick, 1000-ms);
}


export function on(event, cb) {
	storage.push({event, cb});
}

export function start() {
	tick();
}

