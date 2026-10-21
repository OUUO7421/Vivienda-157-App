export const $ = (selector, root = document) => root.querySelector(selector);
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const money = unit => unit.price == null ? 'Consultar precio' : 'USD ' + unit.price.toLocaleString('es-AR');
export const icons = {
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  qr:'<rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/><rect x="3" y="16" width="5" height="5" rx="1"/><path d="M12 3v3M12 11h4M21 12v3h-5v6M11 16v5M21 20v1M3 12h5"/>',
  back:'<path d="m9 4-5 5 5 5M4 9h10a6 6 0 0 1 0 12h-3"/>',
  expand:'<path d="M9 3H3v6M15 3h6v6M21 15v6h-6M3 15v6h6M3 3l6 6M21 3l-6 6M21 21l-6-6M3 21l6-6"/>',
  plus:'<circle cx="10" cy="10" r="7"/><path d="m16 16 5 5M10 6v8M6 10h8"/>', minus:'<circle cx="10" cy="10" r="7"/><path d="m16 16 5 5M6 10h8"/>',
  chat:'<path d="M21 11.5A9 9 0 0 1 7.5 19.3L3 21l1.5-4.5A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-1 3 2 6 5 7l2-2-2-1-1 1-3-3 1-1Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  moon:'<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
  left:'<path d="m15 6-6 6 6 6"/>',right:'<path d="m9 6 6 6-6 6"/>', grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  filter:'<path d="M4 7h16M4 17h16M8 4v6M16 14v6"/>', mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'
};
export const icon = name => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.grid}</svg>`;
export function toast(message) {
  const el = $('#toast'); el.textContent = message; el.hidden = false;
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.hidden = true, 5000);
}
export const badge = u => `<span class="badge status-${u.status}">${escapeHTML(u.statusLabel)}</span>`;
