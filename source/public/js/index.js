/**
 * 
 * @param {Number} targetPos in pixels
 * @param {Number} targetTime in milliseconds
 */
function smoothScrollWindow(targetPos, targetTime) {

    var startPos = window.scrollY;
    var startTime = null;
    window.requestAnimationFrame(step);

    function step(timestamp) {
        if (!startTime) startTime = timestamp;

        var alpha = (timestamp - startTime)/targetTime;
        alpha = alpha*alpha*alpha * (alpha * (6*alpha - 15) + 10); // Smoothstep function
        alpha = Math.min(alpha, 1);

        window.scrollTo(0, startPos + alpha * (targetPos - startPos));

        if (alpha != 1) {
          window.requestAnimationFrame(step);
        }
    }
}

document.getElementsByClassName("scrollDown")[0].addEventListener("click", (e) => {
    e.preventDefault();  
    smoothScrollWindow(window.innerHeight, 500);
});