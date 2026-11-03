// Markdown -> HTML Gmail natif (mêmes règles que local-gmail-output.id-synergy.com)
window.gmdConvert = function (md) {
  const STYLES = { ul:'margin:0;padding-left:24px;', ol:'margin:0;padding-left:24px;', li:'margin:0;',
    table:'border-collapse:collapse;', th:'border:1px solid #ccc;padding:6px 12px;background:#f4f6f8;text-align:left;font-weight:bold;',
    td:'border:1px solid #ccc;padding:6px 12px;', code:'background:#f0f0f0;padding:1px 4px;border-radius:3px;font-family:Consolas,monospace;',
    hr:'border:none;border-top:1px solid #ddd;margin:12px 0;', blockquote:'margin:0;padding:0 0 0 12px;border-left:3px solid #ddd;color:#555;',
    a:'color:#1a73e8;text-decoration:underline;' };
  md = md.replace(/^Objet\s*:.*\n+/i, '').trim();
  const doc = new DOMParser().parseFromString(`<div id="r">${marked.parse(md, { breaks: true, gfm: true })}</div>`, 'text/html');
  const root = doc.getElementById('r');
  for (const el of root.querySelectorAll('*')) { const t = el.tagName.toLowerCase(); if (STYLES[t]) el.setAttribute('style', STYLES[t]); el.removeAttribute('class'); }
  for (const el of [...root.querySelectorAll('p,h1,h2,h3,h4,h5,h6')]) {
    const div = doc.createElement('div'); let tgt = div;
    if (/^H/.test(el.tagName)) { tgt = doc.createElement('b'); div.appendChild(tgt); }
    while (el.firstChild) tgt.appendChild(el.firstChild); el.replaceWith(div); }
  [...root.children].forEach((el, i) => { if (i) { const s = doc.createElement('div'); s.appendChild(doc.createElement('br')); el.before(s); } });
  return root.innerHTML;
};
