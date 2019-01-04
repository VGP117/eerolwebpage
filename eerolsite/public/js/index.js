document.getElementById("scrollToProjects").addEventListener("click", function(e) {
    e.preventDefault();
    smoothScrollWindow(window.innerHeight, 500);
});
/**
 * 
 * @param {Number} targetPos in pixels
 * @param {Number} targetTime in milliseconds
 */
function smoothScrollWindow(targetPos, targetTime) {
    var startPos = window.scrollY;
    update();
    function update(currentTime = 0) {
        var alpha = currentTime/targetTime; // calculate progress [0.0 ... 1.0]
        alpha = alpha*alpha*alpha * (alpha * (6*alpha - 15) + 10); // Smoothstep function

        alpha = Math.min(alpha, 1);

        window.scrollTo(0, startPos + alpha * (targetPos - startPos));

        if (alpha == 1) return;

        setTimeout(function() {
            update(currentTime + 16);
        }, 16);
    }
}