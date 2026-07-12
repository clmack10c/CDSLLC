(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("mobilePanel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        panel.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- accordion ---------- */
  var items = document.querySelectorAll(".accordion-item");
  items.forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      items.forEach(function (i) { i.classList.remove("open"); });
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ---------- gallery data + lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbName = document.getElementById("lightboxName");
  var lbSpec = document.getElementById("lightboxSpec");
  var lbClose = document.getElementById("lightboxClose");
  var lastFocused = null;

  function openLightbox(item) {
    var img = item.querySelector("img");
    var name = item.querySelector(".g-name");
    var spec = item.querySelector(".g-spec");
    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.getAttribute("alt");
    lbName.textContent = name ? name.textContent : "";
    lbSpec.textContent = spec ? spec.textContent : "";
    lastFocused = document.activeElement;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
    if (lastFocused) lastFocused.focus();
  }

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () { openLightbox(item); });
  });
  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* gallery shutter-reveal: observe the stable .g-item (no clip-path on it),
     animate its .g-frame child instead — keeps the observed element's
     geometry/visibility unaffected by the clip-path it's toggling */
  var gReveals = Array.prototype.slice.call(document.querySelectorAll(".g-reveal"));
  gReveals.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 70 + "ms";
  });
  if ("IntersectionObserver" in window) {
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var frame = entry.target.querySelector(".g-frame");
          if (frame) frame.classList.add("in");
          gio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    galleryItems.forEach(function (el) { gio.observe(el); });
  } else {
    gReveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- gallery scroll parallax ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && galleryItems.length) {
    var ticking = false;
    var updateParallax = function () {
      var vh = window.innerHeight;
      galleryItems.forEach(function (item) {
        var img = item.querySelector("img");
        if (!img) return;
        var rect = item.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var center = rect.top + rect.height / 2 - vh / 2;
        var offset = Math.max(-16, Math.min(16, center * -0.05));
        img.style.setProperty("--py", offset.toFixed(1) + "px");
      });
      ticking = false;
    };
    updateParallax();
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateParallax);
  }

})();
