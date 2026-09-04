/* Theme toggle, mobile menu, and soft navigation.
   The only JavaScript on the site; everything degrades to plain HTML. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* -------------------------------------------------------------- pdf --- */
  /* Chrome, Firefox and Safari 17+ report whether they can show a PDF
     inline. When they say no, fall back to the link card at any width. */
  if (navigator.pdfViewerEnabled === false) root.setAttribute('data-nopdf', 'true');

  /* ------------------------------------------------------------ theme --- */
  var themeBtn = document.getElementById('theme-toggle');

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'dark' || set === 'light') return set;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncThemeLabel() {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', 'Switch to ' + (currentTheme() === 'dark' ? 'light' : 'dark') + ' theme');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
      syncThemeLabel();
    });
    syncThemeLabel();
  }

  if (window.matchMedia) {
    var scheme = window.matchMedia('(prefers-color-scheme: dark)');
    var onScheme = function () {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
      if (stored !== 'dark' && stored !== 'light') syncThemeLabel();
    };
    if (scheme.addEventListener) scheme.addEventListener('change', onScheme);
    else if (scheme.addListener) scheme.addListener(onScheme);
  }

  /* ------------------------------------------------------- mobile menu --- */
  var bar = document.getElementById('topbar');
  var navBtn = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    if (!bar || !navBtn) return;
    bar.setAttribute('data-nav', open ? 'open' : 'closed');
    navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    navBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (bar && navBtn && nav) {
    setMenu(false);

    navBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(navBtn.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('click', function (e) {
      if (navBtn.getAttribute('aria-expanded') !== 'true') return;
      if (!bar.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' && e.key !== 'Esc') return;
      if (navBtn.getAttribute('aria-expanded') !== 'true') return;
      setMenu(false);
      navBtn.focus();
    });

    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 56rem)');
      var onWide = function (e) { if (e.matches) setMenu(false); };
      if (wide.addEventListener) wide.addEventListener('change', onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  /* ------------------------------------------- collapsible profile ------ */
  /* On phones the profile panel folds up into the header, driven only by the
     chevron. The About page ships it open, every other page ships it folded,
     and scrolling never changes it either way: animating the panel's height
     while the reader scrolls shifts the text under their finger, so scroll
     position and panel state are kept completely independent. */
  var profile = document.getElementById('profile');
  var profileBtn = document.getElementById('profile-toggle');

  function setProfile(collapsed) {
    if (!profile || !profileBtn) return;
    profile.setAttribute('data-collapsed', collapsed ? 'true' : 'false');
    profileBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    profileBtn.setAttribute('aria-label', collapsed ? 'Show profile' : 'Hide profile');
  }

  function profileCollapsed() {
    return profile && profile.getAttribute('data-collapsed') === 'true';
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', function () {
      setProfile(!profileCollapsed());
    });
  }

  /* Called on every soft navigation. The sidebar is never re-rendered, so the
     panel is reset by hand to the incoming page's default: open on About,
     folded away everywhere else. */
  function profileOnNavigate(pathname) {
    setProfile(pathname !== '/');
  }

  /* --------------------------------------------------- soft navigation --- */
  /* Only <main> is replaced when moving between pages, so the portrait and
     contact details in the sidebar are never torn down and re-decoded — which
     is what causes the flicker on a normal page load. Any failure falls back
     to a full navigation, so the site still works if this goes wrong. */

  var main = document.getElementById('main');
  var supported = !!(main && window.history && history.pushState && window.fetch && window.DOMParser);
  if (!supported) return;

  var PAGES = ['/', '/research/', '/teaching/', '/cv/'];
  var inFlight = null;

  function isInternalPage(url) {
    if (url.origin !== location.origin) return false;
    return PAGES.indexOf(url.pathname) !== -1;
  }

  function markNav(pathname) {
    var links = document.querySelectorAll('#site-nav a');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.getAttribute('href') === pathname) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
  }

  function applyDoc(doc, url, pushed) {
    var incoming = doc.getElementById('main');
    if (!incoming) { location.href = url.href; return; }

    main.innerHTML = incoming.innerHTML;
    document.title = doc.title;

    var canonical = document.querySelector('link[rel=canonical]');
    var incomingCanonical = doc.querySelector('link[rel=canonical]');
    if (canonical && incomingCanonical) canonical.setAttribute('href', incomingCanonical.getAttribute('href'));

    var desc = document.querySelector('meta[name=description]');
    var incomingDesc = doc.querySelector('meta[name=description]');
    if (desc && incomingDesc) desc.setAttribute('content', incomingDesc.getAttribute('content'));

    markNav(url.pathname);
    setMenu(false);

    if (url.hash) {
      var target = document.getElementById(url.hash.slice(1));
      if (target) target.scrollIntoView();
    } else if (pushed) {
      window.scrollTo(0, 0);
    }
    profileOnNavigate(url.pathname);

    /* Move focus so keyboard and screen-reader users land on the new content
       rather than staying on a link that no longer exists. */
    if (pushed) main.focus({ preventScroll: true });

    /* Record the virtual page view; gtag is loaded async so it may not be up
       yet on a very fast first click. */
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: url.pathname + url.search,
        page_location: url.href,
        page_title: document.title
      });
    }
  }

  function swap(doc, url, pushed) {
    if (document.startViewTransition) {
      document.startViewTransition(function () { applyDoc(doc, url, pushed); });
    } else {
      applyDoc(doc, url, pushed);
    }
  }

  function go(url, pushed) {
    if (inFlight) inFlight.abort();
    var controller = new AbortController();
    inFlight = controller;
    root.setAttribute('data-loading', 'true');

    fetch(url.href, { signal: controller.signal, credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        if (pushed) history.pushState({ soft: true }, '', url.href);
        swap(doc, url, pushed);
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') return;
        location.href = url.href;   // fall back to a normal load
      })
      .finally(function () {
        if (inFlight === controller) {
          inFlight = null;
          root.removeAttribute('data-loading');
        }
      });
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target.closest('a');
    if (!a || !a.href) return;
    if (a.hasAttribute('download') || a.target === '_blank') return;

    var url;
    try { url = new URL(a.href); } catch (err) { return; }
    if (!isInternalPage(url)) return;

    /* Same page: let an in-page hash behave normally, otherwise do nothing. */
    if (url.pathname === location.pathname) {
      if (!url.hash) e.preventDefault();
      setMenu(false);
      return;
    }

    e.preventDefault();
    go(url, true);
  });

  window.addEventListener('popstate', function () {
    var url = new URL(location.href);
    if (!isInternalPage(url)) return;
    go(url, false);
  });
})();
