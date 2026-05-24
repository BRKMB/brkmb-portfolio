(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const langToggle = document.getElementById("langToggle");
  const html = document.documentElement;

  let currentLang = "ar";

  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = mobileNav.hasAttribute("hidden");
      if (open) {
        mobileNav.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
      } else {
        mobileNav.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  function applyLang(lang) {
    currentLang = lang;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";

    if (langToggle) {
      langToggle.textContent = lang === "ar" ? "EN" : "عربي";
      langToggle.setAttribute(
        "aria-label",
        lang === "ar" ? "Switch to English" : "التبديل للعربية"
      );
    }

    document.querySelectorAll("[data-ar][data-en]").forEach((el) => {
      const text = el.getAttribute(lang === "ar" ? "data-ar" : "data-en");
      if (text) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    document.querySelectorAll("[data-placeholder-ar][data-placeholder-en]").forEach((el) => {
      el.placeholder = el.getAttribute(
        lang === "ar" ? "data-placeholder-ar" : "data-placeholder-en"
      );
    });

    document.querySelectorAll(".hero-title .line").forEach((el) => {
      const text = el.getAttribute(lang === "ar" ? "data-ar" : "data-en");
      if (text) el.textContent = text;
    });
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      applyLang(currentLang === "ar" ? "en" : "ar");
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = currentLang === "ar" ? "جاري الإرسال..." : "Sending...";
      }
    });
  }
})();
