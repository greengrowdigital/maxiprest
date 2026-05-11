/* MaxiPrest — Navegación y footer compartidos */
(function () {
  const PHONE = '+507 6518-0901';
  const PHONE_INTL = '50765180901';
  const EMAIL = 'moralesalexisrr@gmail.com';

  const LINKS = [
    { href: '/',           route: 'index',      label: 'Inicio' },
    { href: '/prestamos',  route: 'prestamos',  label: 'Préstamos' },
    { href: '/requisitos', route: 'requisitos', label: 'Requisitos' },
    { href: '/contacto',   route: 'contacto',   label: 'Contacto' }
  ];

  function currentRoute() {
    const path = window.location.pathname.replace(/\/+$/, '');
    if (path === '' || path === '/') return 'index';
    const last = path.split('/').pop().replace(/\.html$/, '');
    return last || 'index';
  }

  function logoMark(size) {
    return `
      <svg class="mp-nav-logo-mark" width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="9" stroke="#0A0A0A" stroke-width="1.5"/>
        <path d="M11 28V12L20 22L29 12V28" stroke="#C9A961" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="20" cy="32" r="1.6" fill="#C9A961"/>
      </svg>
    `;
  }

  function renderNav() {
    const route = currentRoute();
    const links = LINKS.map(l => `
      <a class="mp-nav-link ${l.route === route ? 'is-active' : ''}" href="${l.href}">${l.label}</a>
    `).join('');

    return `
      <nav class="mp-nav" id="mpNav" aria-label="Principal">
        <div class="mp-nav-inner">
          <a class="mp-nav-logo" href="/">
            ${logoMark(36)}
            <span class="mp-nav-logo-text">Maxi<span>Prest</span></span>
          </a>
          <div class="mp-nav-links">${links}</div>
          <a class="mp-btn mp-btn-gold-solid mp-nav-cta" href="/aplica" style="padding:14px 24px;">
            Aplicar ahora
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
          <button class="mp-nav-toggle" id="mpNavToggle" aria-label="Abrir menú">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </nav>

      <div class="mp-drawer" id="mpDrawer" aria-hidden="true">
        <button class="mp-drawer-close" id="mpDrawerClose" aria-label="Cerrar menú">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
        </button>
        ${LINKS.map(l => `<a class="mp-drawer-link" href="${l.href}">${l.label}</a>`).join('')}
        <a class="mp-drawer-link" href="/aplica" style="color: var(--mp-gold-deep);">Aplicar ahora →</a>
      </div>
    `;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return `
      <footer class="mp-footer">
        <div class="mp-footer-grid">
          <div>
            <div class="mp-footer-brand">Maxi<span>Prest</span></div>
            <p class="mp-footer-tag">Préstamos personales hasta B/. 100,000 para residentes en Panamá. Aprobación rápida, atención humana.</p>
            <div style="margin-top:24px; display:flex; gap:12px;">
              <a href="https://wa.me/${PHONE_INTL}" target="_blank" rel="noopener" aria-label="WhatsApp" style="width:40px;height:40px;border:1px solid rgba(255,255,255,0.15);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;opacity:1;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </a>
              <a href="mailto:${EMAIL}" aria-label="Email" style="width:40px;height:40px;border:1px solid rgba(255,255,255,0.15);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;opacity:1;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
              </a>
            </div>
          </div>
          <div class="mp-footer-col">
            <h4>Producto</h4>
            <ul>
              <li><a href="/prestamos">Préstamos personales</a></li>
              <li><a href="/requisitos">Requisitos</a></li>
              <li><a href="/aplica">Aplicar ahora</a></li>
            </ul>
          </div>
          <div class="mp-footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href="/contacto">Contacto</a></li>
              <li><a href="/contacto#faq">Preguntas frecuentes</a></li>
              <li><a href="/contacto">Soporte</a></li>
            </ul>
          </div>
          <div class="mp-footer-col">
            <h4>Contacto</h4>
            <ul>
              <li><a href="https://wa.me/${PHONE_INTL}">${PHONE}</a></li>
              <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
              <li>Ciudad de Panamá, PA</li>
            </ul>
          </div>
        </div>
        <div class="mp-footer-bottom">
          <span>© ${year} MaxiPrest. Todos los derechos reservados.</span>
          <span>Sitio creado por <a href="#" style="color:var(--mp-gold);opacity:1;">GreenGrow Digital</a></span>
        </div>
      </footer>
    `;
  }

  function init() {
    const navHost = document.getElementById('mp-nav');
    const footHost = document.getElementById('mp-footer');
    if (navHost) navHost.outerHTML = renderNav();
    if (footHost) footHost.outerHTML = renderFooter();

    const nav = document.getElementById('mpNav');
    const toggle = document.getElementById('mpNavToggle');
    const drawer = document.getElementById('mpDrawer');
    const drawerClose = document.getElementById('mpDrawerClose');

    if (nav) {
      const onScroll = () => {
        if (window.scrollY > 24) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (toggle && drawer) {
      toggle.addEventListener('click', () => {
        drawer.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }
    if (drawerClose && drawer) {
      drawerClose.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }
    if (drawer) {
      drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        document.body.style.overflow = '';
      }));
    }

    initReveal();
  }

  function initReveal() {
    const items = document.querySelectorAll('[data-mp-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
