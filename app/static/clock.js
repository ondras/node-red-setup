import * as timer from "./timer.js";


const timeFormat = new Intl.DateTimeFormat("cs", {timeStyle:"medium"});
const node = document.querySelector("#clock");

function update(t) {
	node.textContent = timeFormat.format(t);
}

timer.on("second", update);

