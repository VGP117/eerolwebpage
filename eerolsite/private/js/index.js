document.getElementById("scrollToProjects").addEventListener("click", function(e) {
    e.preventDefault();
    window.scrollTo({
        behavior : "smooth",
        top : window.innerHeight
    });
});