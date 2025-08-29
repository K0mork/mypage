// UI 拡張: テーマ切替 / スクロール演出 / トップ戻る
document.addEventListener('DOMContentLoaded', () => {
  // =====================
  // テーマ切替
  // =====================
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const ICONS = { light: 'fa-sun', dark: 'fa-moon' };

  const applyThemeIcon = (theme) => {
    if (!btn) return;
    const i = btn.querySelector('i');
    if (!i) return;
    i.classList.remove(ICONS.light, ICONS.dark);
    i.classList.add(theme === 'dark' ? ICONS.dark : ICONS.light);
  };

  const getStoredTheme = () => localStorage.getItem('theme');
  const setStoredTheme = (val) => localStorage.setItem('theme', val);

  const applyTheme = (val) => {
    if (val === 'dark' || val === 'light') {
      root.setAttribute('data-theme', val);
      applyThemeIcon(val);
    } else {
      root.removeAttribute('data-theme'); // システム設定に従う
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyThemeIcon(sysDark ? 'dark' : 'light');
    }
  };

  // 初期適用
  applyTheme(getStoredTheme());

  // システムテーマ変更に追従（system時のみ）
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!getStoredTheme()) applyTheme();
  });

  // クリックで light -> dark -> system を循環
  btn?.addEventListener('click', () => {
    const cur = getStoredTheme();
    const next = cur === 'light' ? 'dark' : cur === 'dark' ? null : 'light';
    if (next) setStoredTheme(next); else localStorage.removeItem('theme');
    applyTheme(next);
  });

  // =====================
  // スクロール進捗 / 戻るボタン
  // =====================
  const progressEl = document.querySelector('.top-progress span');
  const backToTop = document.getElementById('back-to-top');

  const updateScrollUI = () => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = doc.scrollTop || body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progressEl) progressEl.style.width = percent + '%';
    if (backToTop) backToTop.classList.toggle('show', scrollTop > 400);
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =====================
  // セクションフェードイン / スクロールスパイ
  // =====================
  const sections = Array.from(document.querySelectorAll('main section'));
  sections.forEach((s) => s.classList.add('reveal'));

  const navLinks = Array.from(document.querySelectorAll('nav ul li a'));
  const linkById = new Map(
    navLinks.map((a) => [a.getAttribute('href')?.replace('#', ''), a])
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((s) => io.observe(s));

  const spy = () => {
    let currentId = sections[0]?.id;
    const offset = 120; // ヘッダー分のオフセット考慮
    const fromTop = window.scrollY + offset;
    for (const sec of sections) {
      if (sec.offsetTop <= fromTop) currentId = sec.id;
    }
    navLinks.forEach((a) => a.classList.remove('active'));
    const active = linkById.get(currentId);
    active?.classList.add('active');
  };
  spy();
  window.addEventListener('scroll', spy, { passive: true });
});
