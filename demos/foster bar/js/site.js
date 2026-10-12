(() => {
  const iconPaths = {
    diagonal: '<path d="M5 19 19 5M8 5h11v11"/>',
    down: '<path d="M12 4v16m-7-7 7 7 7-7"/>',
    left: '<path d="M19 12H5m7-7-7 7 7 7"/>',
    right: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>'
  };
  const icon = name => `<svg class="site-icon site-icon-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconPaths[name]}</svg>`;
  const glyphs = { '↗': 'diagonal', '↓': 'down' };
  document.querySelectorAll('span[aria-hidden="true"]').forEach(el => {
    const name = el.classList.contains('calendar-icon') ? 'calendar' : glyphs[el.textContent.trim()];
    if (name) el.innerHTML = icon(name);
  });
  document.querySelectorAll('.circle-control').forEach(el => {
    el.innerHTML = icon(el.hasAttribute('data-gallery-prev') ? 'left' : 'right');
  });
  document.querySelectorAll('.header-instagram').forEach(el => { el.innerHTML = icon('instagram'); });
  document.querySelectorAll('.footer-columns a, .interior-intro a, .reserve-intro a').forEach(el => {
    if (el.textContent.trim().endsWith('↗')) {
      el.textContent = el.textContent.replace(/\s*↗\s*$/, '');
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = icon('diagonal');
      el.append(arrow);
    }
  });

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (toggle && mobileNav) {
    const closeMenu = (returnFocus = false) => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      mobileNav.hidden = true;
      document.body.classList.remove('menu-open');
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      mobileNav.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      if (open) mobileNav.querySelector('a')?.focus();
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
      if (event.key === 'Tab' && !mobileNav.hidden) {
        const focusables = [toggle, ...mobileNav.querySelectorAll('a')];
        const current = focusables.indexOf(document.activeElement);
        if (event.shiftKey && current === 0) { event.preventDefault(); focusables.at(-1).focus(); }
        else if (!event.shiftKey && current === focusables.length - 1) { event.preventDefault(); toggle.focus(); }
      }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 800 && !mobileNav.hidden) closeMenu(); });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if (!reduceMotion && 'IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    reveals.forEach(el => observer.observe(el));
    document.documentElement.classList.add('motion-ready');
  }

  const track = document.querySelector('.gallery-track');
  if (track) {
    const step = () => (track.querySelector('figure')?.getBoundingClientRect().width || 300) + 10;
    document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduceMotion ? 'instant' : 'smooth' }));
    document.querySelector('[data-gallery-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduceMotion ? 'instant' : 'smooth' }));
  }
})();
