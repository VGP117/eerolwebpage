$("a[download]").on("click", function () {
    gtag('event', "download", {event_label: $(this).attr("href").replace("downloads/", "")});
});