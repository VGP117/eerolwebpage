var now = new Date();
var birthDate = new Date(1999, 9, 15);
var age = Math.floor((now - birthDate)/ (1000*60*60*24*365.25));
var article = "a ";
if (age === 18 || (age >= 80 && age <= 89)) {
    article = "an ";
}
$("#age").text(article + age.toString());