// Bouton « MD » sur la zone de rédaction Gmail + raccourci Cmd/Ctrl+Maj+M
(() => {
  let editor = null, range = null;
  const btn = document.createElement('button');
  btn.className = 'gmd-btn'; btn.textContent = 'MD'; btn.title = 'Coller du Markdown (Cmd/Ctrl+Maj+M)';
  document.documentElement.appendChild(btn);

  const isEditor = el => el && el.closest && el.closest('[g_editable="true"][contenteditable="true"]');
  function saveRange() { const s = getSelection(); if (s.rangeCount && editor && editor.contains(s.anchorNode)) range = s.getRangeAt(0).cloneRange(); }
  function placeBtn() {
    if (!editor || !document.contains(editor)) { btn.style.display = 'none'; return; }
    const r = editor.getBoundingClientRect();
    btn.style.display = 'block'; btn.style.top = (r.top + 4) + 'px'; btn.style.left = (r.right - 82) + 'px'; // à gauche du bouton Plume IA (right - 38, 32 px)
  }
  document.addEventListener('focusin', e => { const ed = isEditor(e.target); if (ed) { editor = ed; placeBtn(); } }, true);
  document.addEventListener('selectionchange', saveRange);
  addEventListener('scroll', placeBtn, true); addEventListener('resize', placeBtn);
  setInterval(placeBtn, 1000);

  function openDialog() {
    if (!editor) return;
    saveRange();
    const ov = document.createElement('div'); ov.className = 'gmd-ov';
    ov.innerHTML = `<div class="gmd-box"><div class="gmd-title">Coller du Markdown</div>
      <textarea placeholder="Collez le Markdown ici"></textarea>
      <div class="gmd-actions"><button class="gmd-cancel">Annuler</button><button class="gmd-ok">Insérer</button></div>
      <div class="gmd-hint">Cmd/Ctrl+Entrée pour insérer · Échap pour annuler</div></div>`;
    document.documentElement.appendChild(ov);
    const ta = ov.querySelector('textarea'); ta.focus();
    const close = () => ov.remove();
    const ok = () => {
      const html = gmdConvert(ta.value); close();
      if (!html) return;
      editor.focus();
      const s = getSelection(); s.removeAllRanges();
      if (range) s.addRange(range); else { const r = document.createRange(); r.selectNodeContents(editor); r.collapse(true); s.addRange(r); }
      document.execCommand('insertHTML', false, html);
    };
    ov.querySelector('.gmd-cancel').onclick = close;
    ov.querySelector('.gmd-ok').onclick = ok;
    ov.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); ok(); }
      e.stopPropagation();
    });
    ov.addEventListener('mousedown', e => { if (e.target === ov) close(); });
  }
  btn.addEventListener('mousedown', e => { e.preventDefault(); saveRange(); });
  btn.addEventListener('click', openDialog);
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm' && isEditor(e.target)) { e.preventDefault(); editor = isEditor(e.target); openDialog(); }
  }, true);
})();
