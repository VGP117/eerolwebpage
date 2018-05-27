$("#searchInput").on("change paste keyup", function () {
    var inputVal = $(this).val().toLowerCase();

    var li = $("#projectList").children();

    li.each(function (index) {
        var li = $(this);
        var texts = li.find(".listItemTitle, .tag");
        texts.each(function (index) {
            if ($(this).html().toLowerCase().indexOf(inputVal) == -1) {
                li.hide();
            }
            else {
                li.show();
                return false; // means break in jQuery each
            }
        });
    });
});

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});