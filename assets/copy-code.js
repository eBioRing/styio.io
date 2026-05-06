(function () {
  "use strict";

  var copyIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<rect x="9" y="9" width="10" height="10" rx="2"></rect>' +
    '<path d="M5 15V7a2 2 0 0 1 2-2h8"></path>' +
    "</svg>";
  var copiedIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M20 6 9 17l-5-5"></path>' +
    "</svg>";

  function copyWithFallback(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-1000px";
      textarea.style.left = "-1000px";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        if (document.execCommand("copy")) {
          resolve();
        } else {
          reject(new Error("copy command failed"));
        }
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  function setButtonState(button, state) {
    window.clearTimeout(button._copyResetTimer);
    button.dataset.copyState = state;
    if (state === "copied") {
      button.innerHTML = copiedIcon + '<span class="visually-hidden">Copied</span>';
      button.setAttribute("aria-label", "Copied");
      button.setAttribute("title", "Copied");
      button._copyResetTimer = window.setTimeout(function () {
        setButtonState(button, "idle");
      }, 1600);
      return;
    }

    button.innerHTML = copyIcon + '<span class="visually-hidden">Copy code</span>';
    button.setAttribute("aria-label", "Copy code");
    button.setAttribute("title", "Copy code");
  }

  function attachCopyButton(pre) {
    var code = pre.querySelector(":scope > code");
    if (!code || pre.querySelector(":scope > .code-copy-button")) {
      return;
    }

    pre.classList.add("copyable-code");

    var button = document.createElement("button");
    button.className = "code-copy-button";
    button.type = "button";
    setButtonState(button, "idle");

    button.addEventListener("click", function () {
      copyWithFallback(code.textContent).then(
        function () {
          setButtonState(button, "copied");
        },
        function () {
          setButtonState(button, "idle");
          button.setAttribute("aria-label", "Copy failed");
          button.setAttribute("title", "Copy failed");
        }
      );
    });

    pre.appendChild(button);
  }

  function initCopyButtons() {
    document.querySelectorAll("pre > code").forEach(function (code) {
      attachCopyButton(code.parentElement);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
