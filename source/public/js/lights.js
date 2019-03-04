age = "max-age=4294967295;";
b = document.body;

if (is_l()) on();
else off();

function is_l() {
    return document.cookie.includes("_l=1");
}


function off() {
    document.cookie = "_l=0;" + age;
    b.classList.add("dark");
}

function on() {
    document.cookie = "_l=1;" + age;
    b.classList.remove("dark");
}

function t_l() {
    if (is_l()) off(); 
    else on();
}