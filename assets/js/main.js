/*
 * widad.ch – language switch (DE/EN) and compact mobile navigation.
 * The page is fully readable without JavaScript (German, links visible).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'widad-lang';
  var DEFAULT_LANG = 'de';
  var HTML_LANG = { de: 'de-CH', en: 'en-GB' };
  var root = document.documentElement;
  var translations = window.WIDAD_TRANSLATIONS || {};

  /* ---------------------------------------------------------------------
   * Language
   * ------------------------------------------------------------------- */

  var textNodes = toArray(document.querySelectorAll('[data-i18n]'));
  var attrNodes = toArray(document.querySelectorAll('[data-i18n-attr]'));
  var langButtons = toArray(document.querySelectorAll('.lang-switch [data-lang]'));
  var currentLang = DEFAULT_LANG;

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  function isSupported(lang) {
    return Object.prototype.hasOwnProperty.call(HTML_LANG, lang);
  }

  // "content:meta.description; alt:hero.alt" -> [{ attr, key }, ...]
  function attrPairs(el) {
    return el.getAttribute('data-i18n-attr').split(';').map(function (pair) {
      var index = pair.indexOf(':');
      return { attr: pair.slice(0, index).trim(), key: pair.slice(index + 1).trim() };
    }).filter(function (pair) {
      return pair.attr && pair.key;
    });
  }

  function readText(el) {
    return el.tagName === 'TITLE' ? el.textContent : el.innerHTML;
  }

  function writeText(el, value) {
    if (el.tagName === 'TITLE') {
      el.textContent = value;
    } else {
      el.innerHTML = value;
    }
  }

  // German is the source: take it straight from the markup.
  var german = {};
  textNodes.forEach(function (el) {
    german[el.getAttribute('data-i18n')] = readText(el);
  });
  attrNodes.forEach(function (el) {
    attrPairs(el).forEach(function (pair) {
      german[pair.key] = el.getAttribute(pair.attr);
    });
  });
  translations.de = german;

  function lookup(strings, key) {
    var value = strings[key];
    if (typeof value !== 'string') {
      console.warn('[i18n] Missing translation for "' + key + '"');
      return german[key];
    }
    return value;
  }

  function applyLanguage(lang) {
    var strings = translations[lang] || german;

    textNodes.forEach(function (el) {
      writeText(el, lookup(strings, el.getAttribute('data-i18n')));
    });
    attrNodes.forEach(function (el) {
      attrPairs(el).forEach(function (pair) {
        el.setAttribute(pair.attr, lookup(strings, pair.key));
      });
    });

    root.setAttribute('lang', HTML_LANG[lang]);
    langButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-lang') === lang));
    });
    currentLang = lang;
    root.classList.remove('i18n-pending');
  }

  function languageFromUrl() {
    try {
      var lang = new URLSearchParams(window.location.search).get('lang');
      return isSupported(lang) ? lang : null;
    } catch (error) {
      return null;
    }
  }

  function storedLanguage() {
    try {
      var lang = window.localStorage.getItem(STORAGE_KEY);
      return isSupported(lang) ? lang : null;
    } catch (error) {
      return null;
    }
  }

  function storeLanguage(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) { /* private mode or blocked storage: ignore */ }
  }

  // Keep a shareable URL: widad.ch/?lang=en opens the English version.
  function syncUrl(lang) {
    try {
      var url = new URL(window.location.href);
      if (lang === DEFAULT_LANG) {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', lang);
      }
      window.history.replaceState(window.history.state, '', url.toString());
    } catch (error) { /* e.g. file:// previews: ignore */ }
  }

  langButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var lang = button.getAttribute('data-lang');
      if (!isSupported(lang) || lang === currentLang) return;
      applyLanguage(lang);
      storeLanguage(lang);
      syncUrl(lang);
    });
  });

  applyLanguage(languageFromUrl() || storedLanguage() || DEFAULT_LANG);

  /* ---------------------------------------------------------------------
   * Mobile navigation
   * ------------------------------------------------------------------- */

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var navList = document.getElementById('nav-list');

  if (header && toggle && navList) {
    var isOpen = function () {
      return toggle.getAttribute('aria-expanded') === 'true';
    };

    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      header.classList.toggle('menu-open', open);
    };

    toggle.addEventListener('click', function () {
      setMenu(!isOpen());
    });

    navList.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (isOpen() && !header.contains(event.target)) setMenu(false);
    });

    header.addEventListener('focusout', function (event) {
      if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
    });

    var desktop = window.matchMedia('(min-width: 40rem)');
    var closeOnDesktop = function (event) {
      if (event.matches) setMenu(false);
    };
    if (desktop.addEventListener) {
      desktop.addEventListener('change', closeOnDesktop);
    } else if (desktop.addListener) {
      desktop.addListener(closeOnDesktop);
    }
  }

  /* ---------------------------------------------------------------------
   * Print: show the "more" details on paper, restore afterwards
   * ------------------------------------------------------------------- */

  var details = toArray(document.querySelectorAll('details'));
  var openBeforePrint = [];

  window.addEventListener('beforeprint', function () {
    openBeforePrint = details.map(function (item) { return item.open; });
    details.forEach(function (item) { item.open = true; });
  });

  window.addEventListener('afterprint', function () {
    details.forEach(function (item, index) { item.open = openBeforePrint[index]; });
  });
})();
