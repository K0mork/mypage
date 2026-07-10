document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const progress = document.querySelector('.top-progress span');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const preferredTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const isDark = theme === 'dark';
    const icon = themeButton?.querySelector('i');
    icon?.classList.toggle('fa-moon', !isDark);
    icon?.classList.toggle('fa-sun', isDark);
    if (themeButton) themeButton.setAttribute('aria-label', `${isDark ? 'ライト' : 'ダーク'}テーマに切り替える`);
  };

  applyTheme(preferredTheme());

  themeButton?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  });

  const closeMenu = () => {
    sidebar?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'メニューを開く');
    const icon = menuButton?.querySelector('i');
    icon?.classList.remove('fa-xmark');
    icon?.classList.add('fa-bars');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = sidebar?.classList.toggle('open') ?? false;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', `メニューを${isOpen ? '閉じる' : '開く'}`);
    const icon = menuButton.querySelector('i');
    icon?.classList.toggle('fa-bars', !isOpen);
    icon?.classList.toggle('fa-xmark', isOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (progress) progress.style.width = `${Math.min(ratio * 100, 100)}%`;
    backToTop?.classList.toggle('show', window.scrollY > 600);

    const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 240);
    let current = sections[0]?.id;
    sections.forEach((section) => {
      if (section.offsetTop <= marker) current = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${current}`));
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeMenu();
  });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
});
