const icons = {
sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
moon: '<path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z"/>',
github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.4-.4 7-1.7 7-7.5A5.8 5.8 0 0 0 19.5 4a5.4 5.4 0 0 0-.1-4s-1.3-.4-4.4 1.6a15.3 15.3 0 0 0-8 0C3.9-.4 2.6 0 2.6 0A5.4 5.4 0 0 0 2.5 4 5.8 5.8 0 0 0 1 8c0 5.8 3.6 7.1 7 7.5A3.5 3.5 0 0 0 7 18v4" transform="translate(1 1) scale(.9)"/>'
};
function renderIcons() {
 document.querySelectorAll('[data-icon]').forEach(el => {
  el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.icon] || ''}</svg>`;
 });
}
const themeButton = document.querySelector('[data-theme-toggle]');
function syncTheme() {
 const dark = document.documentElement.dataset.theme === 'dark';
 themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
 themeButton.querySelector('i').dataset.icon = dark ? 'moon' : 'sun';
 document.querySelector('meta[name="theme-color"]').content = dark ? '#101011' : '#fafafa';
 renderIcons();
}
syncTheme();
themeButton.addEventListener('click', () => {
 const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
 document.documentElement.dataset.theme = next;
 try { localStorage.setItem('eq-theme', next); } catch {}
 syncTheme();
});
document.querySelectorAll('.quiet-header nav a').forEach(link => {
 if (link.getAttribute('href') === location.pathname) link.setAttribute('aria-current', 'page');
});
function revealSection() {
 const target = document.getElementById(location.hash.slice(1));
 if (target?.tagName === 'DETAILS') target.open = true;
}
window.addEventListener('hashchange', revealSection);
revealSection();
if (location.pathname === '/') {
 const oldRoutes = {'#work':'/work/','#projects':'/work/','#polyshield':'/work/#polyshield','#solar-research':'/work/#solar-research','#calcquest':'/work/#calcquest','#attendance':'/work/#attendance','#about':'/about/','#beyond':'/about/#athletics','#contact':'/contact/'};
 if (oldRoutes[location.hash]) location.replace(oldRoutes[location.hash]);
}
const motionButton = document.querySelector('[data-motion-toggle]');
if (motionButton) {
 const scene = document.querySelector('.athlete-scene');
 const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
 let manuallyPaused = false;
 function updateMotion() {
  const paused = preference.matches || manuallyPaused;
  scene.dataset.motion = paused ? 'paused' : 'playing';
  motionButton.disabled = preference.matches;
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', preference.matches ? 'Character animation respects your reduced-motion setting' : paused ? 'Play character animations' : 'Pause character animations');
  motionButton.querySelector('[data-motion-label]').textContent = preference.matches ? 'Motion reduced' : paused ? 'Play motion' : 'Pause motion';
  motionButton.querySelector('.motion-symbol').textContent = paused ? '▷' : 'Ⅱ';
 }
 motionButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; updateMotion(); });
 preference.addEventListener('change', updateMotion);
 updateMotion();
 document.addEventListener('visibilitychange', () => {
  scene.classList.toggle('scene-offscreen', document.hidden);
 });
}
