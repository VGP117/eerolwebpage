var s = "expires = Fri, 31 Dec 9999 23: 59: 59 GMT";
var l = true;
if (getCookie("lights") == "off") {
    off();
} else {
    on();
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


function off() {
    l = false;
    document.cookie = "lights = off; " + s;
    document.body.classList.add("dark");
}

function on() {
    l = true;
    document.cookie = "lights = on; " + s;
    document.body.classList.remove("dark");
}

function toggleLights() {
    if (l) off();
    else on();
}