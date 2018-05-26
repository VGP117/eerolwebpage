$("#searchInput").on("change paste keyup", function () {
    var inputVal = $(this).val().toLowerCase();

    var li = $("#projectList").children();

    li.each(function (index) {
        var link = $(this).children().first();
        if (link.html().toLowerCase().indexOf(inputVal) == -1) {
            $(this).hide();
        }
        else {
            $(this).show();
        }
    });
});