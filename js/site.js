/* Shared header behavior for every page:
   - builds the full "all pages" dropdown from the existing nav links
   - wires the persistent hamburger to open/close it at all widths
   - marks the current page, sets the footer year
   Kept in one file so the header stays consistent across pages. */
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var srcNav = document.querySelector('.primary-nav .nav-list');

  if (header && toggle && srcNav) {
    var menu = document.createElement('nav');
    menu.className = 'site-menu';
    menu.id = 'site-menu';
    menu.setAttribute('aria-label', 'All pages');
    menu.hidden = true;

    var ul = document.createElement('ul');
    ul.className = 'container menu-list';

    var cur = (location.pathname.split('/').pop() || 'index.html') || 'index.html';

    function addItem(href, text, cls) {
      var li = document.createElement('li');
      if (cls) li.className = cls;
      var link = document.createElement('a');
      link.href = href;
      link.textContent = text;
      li.appendChild(link);
      ul.appendChild(li);
    }

    // A course becomes an expandable submenu (dropdown within the dropdown).
    function addCourse(name, courseUrl, holesUrl, leaguesUrl) {
      var subs = [['The Course', courseUrl], ['Holes', holesUrl], ['Leagues', leaguesUrl], ['Tournaments', 'tournaments.html']];
      var li = document.createElement('li');
      li.className = 'menu-group';
      var det = document.createElement('details');
      subs.forEach(function (p) { if (p[1] === cur) det.open = true; });
      det.setAttribute('data-default-open', det.open ? '1' : '0');
      var sum = document.createElement('summary');
      sum.textContent = name;
      det.appendChild(sum);
      var subUl = document.createElement('ul');
      subUl.className = 'submenu';
      subs.forEach(function (p) {
        var sli = document.createElement('li');
        var sa = document.createElement('a');
        sa.href = p[1];
        sa.textContent = p[0];
        sli.appendChild(sa);
        subUl.appendChild(sli);
      });
      det.appendChild(subUl);
      li.appendChild(det);
      ul.appendChild(li);
    }

    srcNav.querySelectorAll('a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === 'bluff.html') addCourse('The Bluff', 'bluff.html', 'bluff-holes.html', 'bluff-leagues.html');
      else if (href === 'riverside.html') addCourse('Riverside', 'riverside.html', 'riverside-holes.html', 'riverside-leagues.html');
      else {
        addItem(href, a.textContent);
        // Extra top-level pages sit after Outings.
        if (href === 'outings.html') {
          addItem('junior-golf.html', 'Junior golf');
          addItem('gallery.html', 'Gallery');
          addItem('about.html', 'About');
          // Gift cards live in the online store (opens in a new tab).
          var giftLi = document.createElement('li');
          var giftA = document.createElement('a');
          giftA.href = 'https://utahgolfpass.com/pages/email-friendly-e-gift-cards';
          giftA.target = '_blank';
          giftA.rel = 'noopener';
          giftA.textContent = 'Gift cards';
          giftLi.appendChild(giftA);
          ul.appendChild(giftLi);
        }
      }
    });

    // Include the "Book a tee time" action in the dropdown too.
    var bookSrc = document.querySelector('.primary-nav .header-cta a');
    if (bookSrc) {
      var li2 = document.createElement('li');
      li2.className = 'menu-book';
      var b = document.createElement('a');
      b.href = bookSrc.getAttribute('href');
      b.textContent = bookSrc.textContent;
      li2.appendChild(b);
      ul.appendChild(li2);
    }

    menu.appendChild(ul);
    header.appendChild(menu);

    // Persistent quick-access: Search + Contact, visible on every page and width.
    var quick = document.createElement('div');
    quick.className = 'header-quick';
    var qs = document.createElement('a');
    qs.className = 'quick-btn'; qs.href = 'search.html'; qs.setAttribute('aria-label', 'Search');
    qs.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
    var qc = document.createElement('a');
    qc.className = 'quick-btn'; qc.href = 'contact.html'; qc.setAttribute('aria-label', 'Contact');
    qc.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
    quick.appendChild(qs); quick.appendChild(qc);
    toggle.parentNode.insertBefore(quick, toggle);
    // Contact is now an always-on icon, so drop the duplicate text link from the desktop bar.
    var cInline = srcNav.querySelector('a[href="contact.html"]');
    if (cInline) cInline.closest('li').classList.add('is-hidden-inline');

    toggle.setAttribute('aria-controls', 'site-menu');
    function resetSubmenus() {
      menu.querySelectorAll('details').forEach(function (d) { d.open = false; });
    }
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      if (!open) resetSubmenus();           // collapse submenus back to default on close
    }
    toggle.addEventListener('click', function (e) { e.stopPropagation(); setOpen(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    // Click anywhere outside the open menu (and not on the toggle) closes it.
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    // Moving the pointer off the open panel closes it.
    menu.addEventListener('mouseleave', function () { if (!menu.hidden) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    // Ensure it's closed if the page is restored from the back/forward cache.
    window.addEventListener('pageshow', function () { setOpen(false); });
  }

  // Highlight the current page in header + dropdown (not the wordmark).
  var here = (location.pathname.split('/').pop() || 'index.html') || 'index.html';
  document.querySelectorAll('.site-header a[href]:not(.wordmark):not(.btn)').forEach(function (a) {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  // Footer: social, store and privacy links (kept in one place for every page).
  var fbottom = document.querySelector('.site-footer .footer-bottom');
  if (fbottom && !fbottom.querySelector('.footer-social')) {
    var social = document.createElement('p');
    social.className = 'footer-social';
    social.innerHTML =
      '<a href="https://www.facebook.com/schneitersgolf" target="_blank" rel="noopener">Facebook</a>' +
      '<a href="https://www.youtube.com/channel/UCUDTutK5SntRSkQC-paGNvQ" target="_blank" rel="noopener">YouTube</a>' +
      '<a href="https://www.instagram.com/schneitersgolf/" target="_blank" rel="noopener">Instagram</a>' +
      '<a href="https://utahgolfpass.com/pages/email-friendly-e-gift-cards" target="_blank" rel="noopener">Gift cards</a>' +
      '<a href="privacy.html">Privacy</a>';
    fbottom.appendChild(social);
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
