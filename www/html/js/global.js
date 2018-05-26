$(window).on("scroll", function () {
    if ($(this).scrollTop() >= 140) {
        $("#topBar").addClass("sticky");
    }
    else {
        $("#topBar").removeClass("sticky");
    }
});