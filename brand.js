(() => {
 const frame = document.getElementById('beatmakerFrame');
 if (!frame) return;
 window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  if (event.data?.type !== 'tragedy-beatmaker-height') return;
  const height = Number(event.data.height);
  if (Number.isFinite(height) && height > 0 && height < 20000) frame.style.height = `${Math.ceil(height) + 4}px`;
 });
})();
