(function () {
  'use strict';

  var themes = ['cool', 'cool-dark'];
  var families = {
    cool: { light: 'cool', dark: 'cool-dark' }
  };

  function isTheme(theme) {
    return themes.indexOf(theme) !== -1;
  }

  function systemTheme() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
      ? 'cool' : 'cool-dark';
  }

  function modeForTheme(theme) {
    return (theme === 'dark' || theme.indexOf('-dark') !== -1) ? 'dark' : 'light';
  }

  function familyForTheme(theme) {
    return 'cool';
  }

  function themeFor(family, mode) {
    return (families[family] || families.cool)[mode] || families.cool[mode];
  }

  function resolvedTheme() {
    var stored = null;
    try { stored = localStorage.getItem('styio-theme'); } catch (_) {}
    return isTheme(stored) ? stored : systemTheme();
  }

  function updateControls(theme) {
    var family = familyForTheme(theme);
    var mode = modeForTheme(theme);
    document.querySelectorAll('[data-theme-family]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-theme-family') === family ? 'true' : 'false');
    });
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('styio-theme', theme);
      localStorage.setItem('styio-theme-family', familyForTheme(theme));
      localStorage.setItem('styio-theme-mode', modeForTheme(theme));
    } catch (_) {}
    updateControls(theme);
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateControls(resolvedTheme());

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var current = resolvedTheme();
        var family = familyForTheme(current);
        var nextMode = modeForTheme(current) === 'light' ? 'dark' : 'light';
        applyTheme(themeFor(family, nextMode));
      });
    }

    document.querySelectorAll('[data-theme-family]').forEach(function (familyButton) {
      familyButton.addEventListener('click', function () {
        var current = resolvedTheme();
        var family = familyButton.getAttribute('data-theme-family') || 'cool';
        applyTheme(themeFor(family, modeForTheme(current)));
      });
    });
  });
}());
