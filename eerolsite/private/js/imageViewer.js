var links = document.querySelectorAll("a.image");
links.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        var viewer = document.getElementById("imageViewer");
        while (viewer.firstChild) {
            viewer.removeChild(viewer.firstChild);
        }
        var img = this.getElementsByTagName("img")[0];
        viewer.appendChild(img.cloneNode());
        viewer.className = "show";
        viewer.addEventListener("click", function () {
            this.className = "";
        });
    });
});