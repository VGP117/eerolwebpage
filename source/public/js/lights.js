if (getCookie("lights") == "off") {
    lightsOff();
} else {
    lightsOn();
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function lightsOff() {
    document.cookie = "lights = off;  expires = Fri, 31 Dec 9999 23:59:59 GMT";
    document.body.classList.add("dark");
}

function lightsOn() {
    document.cookie = "lights = on;  expires = Fri, 31 Dec 9999 23:59:59 GMT";
    document.body.classList.remove("dark");
}

function toggleLights() {
    if (getCookie("lights") == "off") {
        lightsOn();
    }
    else {
        lightsOff();
    }
}