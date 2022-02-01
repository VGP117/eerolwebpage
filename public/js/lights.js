age = "max-age=4294967295;"

if (isLightMode()) lightsOn()
else lightsOff()

// Is light mode on? Defaults to false when no cookies exist.
function isLightMode() {
	return document.cookie.includes("_l=1")
}

function lightsOff() {
	document.cookie = "_l=0;" + age
	document.body.classList.add("dark")
}

function lightsOn() {
	document.cookie = "_l=1;" + age
	document.body.classList.remove("dark")
}

function toggleLights() {
	console.log("toggle")
	if (isLightMode()) console.log("off") || lightsOff()
	else console.log("on") || lightsOn()
}
