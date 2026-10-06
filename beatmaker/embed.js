(() => {
 if (!document.documentElement.classList.contains('embedded') || window.parent === window) return;
 const report = () => window.parent.postMessage({ type: 'tragedy-beatmaker-height', height: document.body.scrollHeight }, location.origin);
 window.addEventListener('load', report);
 window.addEventListener('resize', report);
 if (typeof ResizeObserver === 'function') new ResizeObserver(report).observe(document.body);
 report();
})();
