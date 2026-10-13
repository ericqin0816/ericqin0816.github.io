(() => {
  try { if (localStorage.getItem('eq-theme') === 'dark') document.documentElement.dataset.theme = 'dark'; } catch {}
})();
