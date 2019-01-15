var links = document.querySelectorAll("a[download]");
links.forEach(function (link) {
    link.addEventListener("click", function () {
        gtag(
            'event', 
            "download", 
            { event_label : this.getAttribute("href").replace("downloads/", "")}
        );
    });
});