/* Landing "Precision Architecture" — interacciones mínimas */
(function () {
    "use strict";

    var nav = document.getElementById("siteNav");
    var toggle = document.getElementById("navToggle");

    /* --- menú mobile --- */
    if (nav && toggle) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.querySelector(".material-symbols-outlined").textContent = open ? "close" : "menu";
        });

        nav.addEventListener("click", function (e) {
            if (e.target.closest("a") && nav.classList.contains("is-open")) {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.querySelector(".material-symbols-outlined").textContent = "menu";
            }
        });
    }

    /* --- scrollspy: marca el link de sección visible --- */
    var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
    var sections = links
        .map(function (a) { return document.querySelector(a.getAttribute("href")); })
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        var byId = {};
        links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (a) { a.classList.remove("is-active"); });
                var active = byId[entry.target.id];
                if (active) active.classList.add("is-active");
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

        sections.forEach(function (s) { io.observe(s); });
    }

    /* --- previews de video: se pausan al salir de pantalla --- */
    var motionVideos = Array.prototype.slice.call(document.querySelectorAll(".motion-card video"));
    if ("IntersectionObserver" in window && motionVideos.length) {
        var videoIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
            });
        }, { threshold: 0.15 });

        motionVideos.forEach(function (video) { videoIo.observe(video); });
    }
})();
