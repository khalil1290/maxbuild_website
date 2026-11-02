(function () {
  "use strict";

  var header = document.getElementById("header");
  var scrollTop = document.getElementById("scroll-top");
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 80);
    if (scrollTop) scrollTop.classList.toggle("active", y > 300);
  }, { passive: true });

  // Mobile nav
  var toggle = document.querySelector(".mobile-nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("mobile-nav-active");
      toggle.classList.toggle("bi-list");
      toggle.classList.toggle("bi-x");
    });
  }

  // Hero carousel (home page only). Slides 2+ load after the page has finished loading.
  var items = document.querySelectorAll("#hero-carousel .carousel-item");
  if (items.length > 1) {
    window.addEventListener("load", function () {
      document.querySelectorAll("#hero-carousel img[data-src]").forEach(function (img) {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      });
    });
    var current = 0;
    setInterval(function () {
      items[current].classList.remove("active");
      items[current].style.opacity = 0;
      current = (current + 1) % items.length;
      items[current].classList.add("active");
      items[current].style.opacity = 1;
    }, 5000);
  }
})();
