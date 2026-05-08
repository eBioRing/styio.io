(function () {
  "use strict";

  function createThemeSwitcher() {
    var switcher = document.createElement("span");
    switcher.className = "theme-family-switcher";
    switcher.setAttribute("aria-label", "Color theme");

    var button = document.createElement("button");
    button.className = "theme-swatch";
    button.type = "button";
    button.setAttribute("data-theme-family", "cool");
    button.setAttribute("aria-label", "Cool tech theme");

    var dot = document.createElement("span");
    dot.className = "theme-swatch-dot swatch-cool";
    button.appendChild(dot);
    switcher.appendChild(button);

    return switcher;
  }

  function createLegalText() {
    var legal = document.createElement("span");
    legal.className = "footer-legal";

    var license = document.createElement("span");
    license.textContent = "Released under the Apache 2.0 License.";

    var copyright = document.createElement("span");
    copyright.textContent = "Copyright \u00A9 2023-2026 Yizhuo Yang";

    legal.appendChild(license);
    legal.appendChild(copyright);

    return legal;
  }

  function renderFooter(footer) {
    if (!footer || footer.getAttribute("data-site-footer-rendered") === "true") {
      return;
    }

    footer.classList.add("site-footer");
    footer.textContent = "";

    var inner = document.createElement("div");
    inner.className = "wrap footer-inner";
    inner.appendChild(createThemeSwitcher());
    inner.appendChild(createLegalText());

    var spacer = document.createElement("span");
    spacer.className = "footer-spacer";
    spacer.setAttribute("aria-hidden", "true");
    inner.appendChild(spacer);

    footer.appendChild(inner);
    footer.setAttribute("data-site-footer-rendered", "true");
  }

  function renderAllFooters() {
    document.querySelectorAll("[data-site-footer], footer.site-footer").forEach(renderFooter);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAllFooters);
  } else {
    renderAllFooters();
  }
}());
