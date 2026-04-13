// ─── NAVIGATION ──────────────────────────────────────────
const stack = ['s-out'];
const tabs = { out: 's-out', dev: 's-dev', nrg: 's-nrg', acc: 's-acc' };

function show(id) {
  document.querySelectorAll('.scr').forEach((s) => s.classList.remove('on', 'out'));
  const el = document.getElementById(id);
  if (el) el.classList.add('on');
  if (id === 's-find') startScan();
}

function go(id) {
  const cur = stack[stack.length - 1];
  const curEl = document.getElementById(cur);
  if (curEl) {
    curEl.classList.add('out');
    setTimeout(() => curEl.classList.remove('out'), 300);
  }
  stack.push(id);
  show(id);
}

function back() {
  if (stack.length <= 1) return;
  stack.pop();
  show(stack[stack.length - 1]);
}

function tab(t) {
  stack.length = 0;
  stack.push(tabs[t]);
  show(tabs[t]);
}

function prototypeAction(msg) {
  alert('Prototype: ' + msg);
}

function setLang(label) {
  const el = document.getElementById('lang-val');
  if (el) el.textContent = label;
  back();
}

// ─── SHEETS ──────────────────────────────────────────────
function openSheet(id) {
  document.getElementById(id)?.classList.add('on');
}

function closeSheet(el) {
  el?.classList.remove('on');
}

// ─── TOGGLES ─────────────────────────────────────────────
function tapSw(btn, e) {
  e.stopPropagation();
  btn.classList.toggle('on');
  btn.classList.toggle('off');
  const oi = btn.closest('.oc')?.querySelector('.oi');
  if (oi) {
    oi.classList.toggle('on');
    oi.classList.toggle('off');
  }
}

// ─── ROLE PICKERS ────────────────────────────────────────
function setMRole(r) {
  ['admin', 'user', 'custom'].forEach((x) => {
    const el = document.getElementById('mr-' + x);
    if (el) {
      el.textContent = '';
      el.removeAttribute('style');
    }
  });
  const el = document.getElementById('mr-' + r);
  if (el) {
    el.textContent = '✓';
    el.style.cssText = 'color:var(--brand);font-size:20px;font-weight:700';
  }
}

function setIRole(r) {
  ['admin', 'user', 'custom'].forEach((x) => {
    const el = document.getElementById('ir-' + x);
    if (el) {
      el.textContent = '';
      el.removeAttribute('style');
    }
  });
  const el = document.getElementById('ir-' + r);
  if (el) {
    el.textContent = '✓';
    el.style.cssText = 'color:var(--brand);font-size:20px;font-weight:700';
  }
}

// ─── APPEARANCE / DARK MODE ──────────────────────────────
let curAppear = 'system';

function setAppear(mode) {
  curAppear = mode;
  try {
    localStorage.setItem('netio-theme', mode);
  } catch (e) {
    /* ignore */
  }

  ['light', 'dark', 'system'].forEach((m) => {
    const el = document.getElementById('ap-' + m);
    if (el) {
      el.textContent = '';
      el.removeAttribute('style');
    }
  });
  const el = document.getElementById('ap-' + mode);
  if (el) {
    el.textContent = '✓';
    el.style.cssText = 'color:var(--brand);font-size:20px;font-weight:700';
  }

  let dark;
  if (mode === 'dark') dark = true;
  else if (mode === 'light') dark = false;
  else dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  document.getElementById('phone')?.classList.toggle('dark', dark);

  const val = document.getElementById('appear-val');
  if (val) val.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);

  const railSel = document.getElementById('proto-rail-theme');
  if (railSel && railSel.value !== mode) railSel.value = mode;
}

// ─── SCAN ────────────────────────────────────────────────
function startScan() {
  const bar = document.getElementById('scan-bar');
  const st = document.getElementById('scan-st');
  const found = document.getElementById('scan-found');
  if (!bar) return;
  bar.style.width = '0%';
  if (st) st.textContent = 'Scanning…';
  if (found) found.style.display = 'none';
  let w = 0;
  const iv = setInterval(() => {
    w += 2;
    bar.style.width = w + '%';
    if (w >= 100) {
      clearInterval(iv);
      if (st) st.textContent = 'Found 2 devices';
      if (found) found.style.display = 'block';
    }
  }, 40);
}

// ─── PROTOTYPE VIEW (desktop mockup vs mobile full-view) ───
function syncProtoViewLinks() {
  const mobile = document.documentElement.classList.contains(
    'proto-view-mobile',
  );
  document.querySelectorAll('a[href]').forEach((a) => {
    const raw = a.getAttribute('href');
    if (!raw) return;
    const base = raw.split('?')[0];
    if (!/^netio-[\w-]+\.html$/.test(base)) return;
    a.href = base + (mobile ? '?view=mobile' : '');
  });
}

// ─── SCHEDULER GRID ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  syncProtoViewLinks();

  const grid = document.getElementById('sgrid');
  if (grid) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const on = [[8, 18], [8, 18], [8, 18], [8, 18], [8, 18], [], []];
    days.forEach((d, i) => {
      const lbl = document.createElement('div');
      lbl.className = 'sday';
      lbl.textContent = d;
      grid.appendChild(lbl);
      for (let h = 0; h < 24; h++) {
        const cell = document.createElement('div');
        cell.className =
          'scell' +
          (on[i].length && h >= on[i][0] && h < on[i][1] ? ' on' : '');
        cell.onclick = () => cell.classList.toggle('on');
        grid.appendChild(cell);
      }
    });
  }

  let saved = null;
  try {
    saved = localStorage.getItem('netio-theme');
  } catch (e) {
    /* ignore */
  }
  const initialMode =
    saved === 'light' || saved === 'dark' || saved === 'system'
      ? saved
      : 'system';
  setAppear(initialMode);

  const railSel = document.getElementById('proto-rail-theme');
  if (railSel) {
    railSel.addEventListener('change', () => setAppear(railSel.value));
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (curAppear === 'system') {
        document.getElementById('phone')?.classList.toggle('dark', e.matches);
      }
    });
});
