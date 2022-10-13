window.addEventListener('load', () => {
    var countDownDate = new Date("Jan 5, 2023 15:37:25").getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="timer"
        const timerEl = document.querySelectorAll(".timer")
        timerEl.forEach(el => {
            el.querySelector(".days").innerHTML = days;
            el.querySelector(".hours").innerHTML = hours;
            el.querySelector(".minutes").innerHTML = minutes;
            el.querySelector(".seconds").innerHTML = seconds;
        })

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "EXPIRED";
        }
    }, 1000);
});