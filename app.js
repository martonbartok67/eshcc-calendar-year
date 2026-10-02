// ESHCC Academic Calendar: "Year Strip" design.
// Plain DOM rendering on top of window.ESHCC (calendar-data.js).
(function () {
  const E = window.ESHCC;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // "Today" is the real local date; ?today=YYYY-MM-DD overrides it for testing.
  const param = new URLSearchParams(location.search).get('today');
  const TODAY = /^\d{4}-\d{2}-\d{2}$/.test(param || '') ? param : E.iso(new Date());

  const monthIndexOf = s => E.MONTHS.findIndex(m => s.startsWith(m.key));
  const initialMonth = (() => {
    const i = monthIndexOf(TODAY);
    if (i >= 0) return i;
    return TODAY < E.MONTHS[0].key ? 0 : E.MONTHS.length - 1;
  })();
  const initialSel = monthIndexOf(TODAY) >= 0 ? TODAY : E.MONTHS[initialMonth].key + '-01';

  const notes = E.loadNotes();
  const state = { view: 'year', monthIdx: initialMonth, sel: initialSel, draft: notes[initialSel] || '', saved: '' };

  // Weekends fall outside a week's Mon-Fri range, so look up the week via that day's Monday.
  function weekOfDay(s) {
    const d = new Date(s + 'T00:00:00');
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return E.weekFor(s) || E.weekFor(E.iso(d)) || null;
  }

  function pickDay(s) {
    const i = monthIndexOf(s);
    state.sel = s;
    state.draft = notes[s] || '';
    state.saved = '';
    if (i >= 0) state.monthIdx = i;
  }

  // ---------- week bars (shared by strip and term cards) ----------
  function weekButton(w, small) {
    const T = E.TYPES[w.type];
    const isSel = state.sel >= w.start && state.sel <= w.end;
    const isNow = TODAY >= w.start && TODAY <= w.end;
    const mk = E.MONTHS[state.monthIdx].key;
    const inMonth = w.start.startsWith(mk) || w.end.startsWith(mk);
    const ring = isSel ? '0 0 0 2px #0E2A28' : isNow ? 'inset 0 0 0 2px #0E2A28' : 'none';
    const op = state.view === 'year' && !inMonth ? .55 : 1;
    const title = `CW ${w.cw} · ${w.termWk} · ${w.activity}`;
    const style = `background:${T.c};color:${T.fg};box-shadow:${ring};opacity:${op}`;
    const attrs = `type="button" class="wk${small ? ' small' : ''}" data-action="week" data-start="${w.start}" title="${esc(title)}" aria-label="${esc(title)}"${isSel ? ' aria-current="true"' : ''}`;
    return small
      ? `<button ${attrs} style="${style}">${w.cw}</button>`
      : `<button ${attrs} style="${style}"><span class="wk-num" style="color:${T.fg}">${w.cw}</span></button>`;
  }

  const termWeeks = id => E.WEEKS.filter(w => w.term === id);

  function renderStatic() {
    $('legend').innerHTML = Object.values(E.TYPES).map(l =>
      `<div class="legend-item"><span class="swatch" style="background:${l.c}"></span>${esc(l.label)}</div>`).join('');
    const tw = E.weekFor(TODAY);
    $('today-label').textContent = 'Today · ' + E.fmt(TODAY, { weekday: 'short', day: 'numeric', month: 'short' }) + (tw ? ' · ' + tw.termWk : '');
  }

  function renderTabs() {
    document.querySelectorAll('[data-action="view"]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.view === state.view)));
    $('year-view').hidden = state.view !== 'year';
    $('terms-view').hidden = state.view !== 'terms';
  }

  function renderStrip() {
    $('strip').innerHTML = E.TERMS.map(g => {
      const ws = termWeeks(g.id);
      return `<div class="strip-group" style="flex:${ws.length} 1 ${ws.length * 22}px">
        <div class="strip-head"><span>${esc(g.title)}</span><span class="sub">${esc(g.sub)}</span></div>
        <div class="weeks">${ws.map(w => weekButton(w, false)).join('')}</div>
      </div>`;
    }).join('');
  }

  // ---------- Year view ----------
  function renderMonth() {
    const M = E.MONTHS[state.monthIdx];
    const chips = E.MONTHS.map((m, i) => {
      const label = m.short + (m.m === 0 || i === 0 ? ' ’' + String(m.y).slice(2) : '');
      return `<button type="button" class="chip" data-action="month" data-idx="${i}"${i === state.monthIdx ? ' aria-current="true"' : ''}>${label}</button>`;
    }).join('');
    const dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((l, i) =>
      `<div class="mgrid-h${i > 4 ? ' wkend' : ''}">${l}</div>`).join('');
    const rows = E.monthRows(M.y, M.m).map(r => {
      const head = `<div class="cw-cell"><span class="cw">${r.week ? 'CW ' + r.week.cw : '—'}</span><span class="tw">${esc(r.week ? r.week.termWk : '')}</span></div>`;
      const days = r.days.map(d => {
        const T = d.type ? E.TYPES[d.type] : null;
        const label = !d.inMonth ? ''
          : d.holiday && (d.holiday.date === d.iso || d.dow === 0) ? d.holiday.name
          : d.dow === 0 && d.week && d.type !== 'lecture' ? E.TYPES[d.type].label : '';
        const labelCls = d.type === 'holiday' ? ' holiday' : d.type === 'special' ? ' special' : '';
        const cls = ['day', d.weekend && 'wkend', !d.inMonth && 'out', d.iso === state.sel && 'sel', d.iso === TODAY && 'today'].filter(Boolean).join(' ');
        const aria = E.fmt(d.iso, { weekday: 'long', day: 'numeric', month: 'long' }) + (label ? ', ' + label : '') + (notes[d.iso] ? ', has note' : '');
        return `<button type="button" class="${cls}" data-action="day" data-iso="${d.iso}" aria-label="${esc(aria)}"${d.iso === state.sel ? ' aria-pressed="true"' : ''}>
          <span class="day-bar" style="background:${T ? T.c : 'transparent'}"></span>
          <span class="day-top"><span class="day-num">${d.num}</span>${notes[d.iso] ? '<span class="note-dot"></span>' : ''}</span>
          <span class="day-label${labelCls}">${esc(label)}</span>
        </button>`;
      }).join('');
      return head + days;
    }).join('');

    return `<div class="card month-card">
      <div class="month-head">
        <h3>${M.name} <span>${M.y}</span></h3>
        <div class="nav-btns">
          <button type="button" class="nav-btn" data-action="prev" aria-label="Previous month"${state.monthIdx === 0 ? ' disabled' : ''}>‹</button>
          <button type="button" class="nav-btn" data-action="next" aria-label="Next month"${state.monthIdx === E.MONTHS.length - 1 ? ' disabled' : ''}>›</button>
        </div>
      </div>
      <div class="chips" id="chips">${chips}</div>
      <div class="grid-scroll" id="grid-scroll"><div class="mgrid"><div class="mgrid-h first">Week</div>${dows}${rows}</div></div>
    </div>`;
  }

  function renderPanel() {
    const sd = E.dayInfo(state.sel);
    const T = sd.type ? E.TYPES[sd.type] : null;
    const wk = weekOfDay(state.sel);
    const activity = sd.holiday && sd.type === 'recess' ? sd.holiday.name
      : sd.week && !sd.weekend ? sd.week.activity : sd.weekend ? 'Weekend' : 'No scheduled activity';
    const holiday = sd.holiday && sd.type !== 'recess' ? sd.holiday.name + ' · ' + sd.holiday.desc : '';
    const tint = T ? (sd.type === 'lecture' ? '#EEF3F1' : T.c + '1F') : '#F0EFE9';
    return `<aside class="card panel" aria-label="Selected day">
      <div class="panel-date">
        <span class="wd">${E.fmt(state.sel, { weekday: 'long' })}</span>
        <span class="dt">${E.fmt(state.sel, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      <div class="activity" style="background:${tint}"><span class="swatch" style="background:${T ? T.c : '#DAD9D1'}"></span><span>${esc(activity)}</span></div>
      ${holiday ? `<div class="panel-holiday">${esc(holiday)}</div>` : ''}
      <dl class="facts">
        <dt>Calendar week</dt><dd class="mono">${wk ? wk.cw : '—'}</dd>
        <dt>Term</dt><dd>${esc(wk ? wk.termWk : '—')}</dd>
        <dt>Week runs</dt><dd>${wk ? E.fmt(wk.start) + ' – ' + E.fmt(wk.end) : '—'}</dd>
      </dl>
      ${wk && wk.notes ? `<div class="panel-notes">${esc(wk.notes)}</div>` : ''}
      <div class="note-box">
        <label for="note">My note</label>
        <textarea id="note" rows="3" placeholder="Deadline, exam, reminder…">${esc(state.draft)}</textarea>
        <div class="note-actions">
          <button type="button" class="btn-primary" data-action="save">Save note</button>
          <button type="button" class="btn-ghost" data-action="clear">Clear</button>
        </div>
        <span class="saved-msg" id="saved-msg" role="status">${state.saved}</span>
      </div>
    </aside>`;
  }

  // ---------- Terms view ----------
  function renderTerms() {
    const long = { day: 'numeric', month: 'short', year: 'numeric' };
    $('terms-view').innerHTML = E.TERMS.map(g => {
      const ws = termWeeks(g.id);
      if (!ws.length) return '';
      const marks = [];
      ws.forEach(w => {
        if (w.type !== 'lecture') marks.push({ c: E.TYPES[w.type].c, date: E.fmt(w.start) + '–' + E.fmt(w.end), text: w.activity });
        // Week range, not w.start: the note's holiday is usually mid-week (Kings Day is Tue 27 Apr, not 26 Apr).
        if (w.notes) marks.push({ c: E.TYPES.holiday.c, date: E.fmt(w.start) + '–' + E.fmt(w.end), text: w.notes });
      });
      const first = ws[0], last = ws[ws.length - 1];
      return `<article class="card term-card">
        <div class="term-meta">
          <h3>${esc(g.title)}</h3>
          <span class="range">${esc(g.sub)} · ${E.fmt(first.start, long)} – ${E.fmt(last.end, long)}</span>
          <span class="cws">CW ${first.cw}–${last.cw} · ${ws.length} weeks</span>
        </div>
        <div class="term-body">
          <div class="weeks">${ws.map(w => weekButton(w, true)).join('')}</div>
          <ul class="marks">${marks.map(k =>
            `<li><span class="swatch" style="background:${k.c}"></span><span class="date">${k.date}</span><span>${esc(k.text)}</span></li>`).join('')}</ul>
        </div>
      </article>`;
    }).join('');
  }

  // ---------- render ----------
  function render() {
    const chips = $('chips'), grid = $('grid-scroll');
    const keep = { chips: chips ? chips.scrollLeft : null, grid: grid ? grid.scrollLeft : 0 };
    renderTabs();
    renderStrip();
    if (state.view === 'year') {
      $('year-view').innerHTML = renderMonth() + renderPanel();
      $('grid-scroll').scrollLeft = keep.grid;
      const c = $('chips');
      if (keep.chips !== null) c.scrollLeft = keep.chips;
      const cur = c.querySelector('[aria-current="true"]');
      if (cur && (cur.offsetLeft < c.scrollLeft || cur.offsetLeft + cur.offsetWidth > c.scrollLeft + c.clientWidth)) c.scrollLeft = cur.offsetLeft - 20;
    } else {
      renderTerms();
    }
  }

  function saveNotes() { E.saveNotes(notes); }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    switch (b.dataset.action) {
      case 'view': state.view = b.dataset.view; break;
      case 'today': state.view = 'year'; pickDay(TODAY); break;
      case 'print': window.print(); return;
      case 'week': state.view = 'year'; pickDay(b.dataset.start); break;
      case 'day': pickDay(b.dataset.iso); break;
      case 'month': state.monthIdx = +b.dataset.idx; break;
      case 'prev': state.monthIdx = Math.max(0, state.monthIdx - 1); break;
      case 'next': state.monthIdx = Math.min(E.MONTHS.length - 1, state.monthIdx + 1); break;
      case 'save': {
        const v = state.draft.trim();
        if (v) notes[state.sel] = v; else delete notes[state.sel];
        saveNotes();
        state.saved = v ? 'Saved' : 'Removed';
        break;
      }
      case 'clear': delete notes[state.sel]; saveNotes(); state.draft = ''; state.saved = ''; break;
      default: return;
    }
    render();
  });

  // Typing only updates state; re-rendering would steal focus from the textarea.
  document.addEventListener('input', e => {
    if (e.target.id !== 'note') return;
    state.draft = e.target.value;
    if (state.saved) { state.saved = ''; $('saved-msg').textContent = ''; }
  });

  renderStatic();
  render();
})();
