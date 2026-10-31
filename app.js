// Vaste spelerslijst en standaardselectie voor een nieuwe opstelling.
const NAMES = ['Ellemieke', 'June', 'Pepijn', 'Emma', 'Lieke', 'Olivier', 'Celine', 'Riv', 'Fieke', 'Saar'];
const players = NAMES.map(name => ({ name, on: true }));
// Opslagsleutel en maximale lengte voor de cookie-opslag.
const COOKIE_NAME = 'mhcw-hockeyopstelling';
const COOKIE_MAX_LENGTH = 3800;

// Verkorte helper om een element op id op te halen.
const $ = id => document.getElementById(id);

// Haalt opgeslagen instellingen eerst uit localStorage en daarna uit cookies.
function getSavedCookie() {
  try {
    const stored = localStorage.getItem(COOKIE_NAME);
    if (stored !== null) return stored;
  } catch (error) {}
  const cookie = document.cookie.split('; ').find(item => item.startsWith(`${COOKIE_NAME}=`));
  return cookie ? cookie.slice(COOKIE_NAME.length + 1) : null;
}

// Zet de huidige selectie, instellingen en wedstrijd om naar een opslagbaar object.
function savedState() {
  const inputSettings = ['duration', 'slots', 'interval', 'maxSubs', 'maxBench'].map(id => $(id).value);
  const currentMatch = S && {
    n: S.names.map(name => NAMES.indexOf(name)),
    k: S.keeper ? NAMES.indexOf(S.keeper) : -1,
    p: [S.params.duration, S.params.slots, S.params.interval, S.params.maxSubs, S.params.maxBench],
    d: Object.entries(S.dropAt).map(([i, events]) => [+i, events.map(event => [event.from, event.out])]),
    l: S.result.lens,
    b: S.result.blocks.map(block => [
      [...block.field],
      block.actions,
      block.changed,
    ]),
    t: S.result.play,
    w: S.result.warnings,
  };
  return {
    v: 1,
    a: players.flatMap((player, i) => player.on ? [i] : []),
    k: $('keeper').value,
    r: $('shuffleSeed').value,
    f: inputSettings,
    s: currentMatch,
  };
}

// Controleert of een opgeslagen wedstrijd alle verwachte velden en waarden bevat.
function validMatch(match) {
  return match && Array.isArray(match.n) && match.n.length > 0 &&
    match.n.every(i => Number.isInteger(i) && i >= 0 && i < NAMES.length) &&
    new Set(match.n).size === match.n.length &&
    Number.isInteger(match.k) && match.k >= -1 && match.k < NAMES.length &&
    Array.isArray(match.p) && match.p.length === 5 && match.p.every(value => Number.isFinite(value) && value > 0) &&
    Array.isArray(match.d) && match.d.every(entry => Array.isArray(entry) && entry.length === 2 &&
      Number.isInteger(entry[0]) && entry[0] >= 0 && entry[0] < match.n.length &&
      Array.isArray(entry[1]) && entry[1].every(event => Array.isArray(event) && event.length === 2 &&
        Number.isInteger(event[0]) && event[0] >= 0 && typeof event[1] === 'boolean')) &&
    Array.isArray(match.l) && match.l.length > 0 && match.l.every(value => Number.isFinite(value) && value > 0) &&
    Array.isArray(match.b) && match.l.length === match.b.length &&
    match.b.every(block => Array.isArray(block) && block.length === 3 &&
      Array.isArray(block[0]) && block[0].every(i => Number.isInteger(i) && i >= 0 && i < match.n.length) &&
      new Set(block[0]).size === block[0].length &&
      Array.isArray(block[1]) && block[1].every(action => typeof action === 'string') &&
      Array.isArray(block[2]) && block[2].every(i => Number.isInteger(i) && i >= 0 && i < match.n.length)) &&
    Array.isArray(match.t) && match.t.length === match.n.length && match.t.every(value => Number.isFinite(value) && value >= 0) &&
    Array.isArray(match.w) && match.w.every(warning => typeof warning === 'string');
}

// Slaat de huidige toestand op; gebruikt localStorage als cookie-opslag niet lukt.
function saveState() {
  const value = encodeURIComponent(JSON.stringify(savedState()));
  const status = $('saveStatus');
  let saved = false;
  if (value.length <= COOKIE_MAX_LENGTH) {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    saved = getSavedCookie() === value;
  }
  try {
    localStorage.setItem(COOKIE_NAME, value);
    saved = true;
  } catch (error) {}
  if (!saved) {
    status.textContent = 'Opslaan mislukt: cookies en lokale opslag zijn niet beschikbaar in deze browser.';
    status.classList.add('error');
    return;
  }
  status.textContent = 'Instellingen en opstelling automatisch opgeslagen (via cookies).';
  status.classList.remove('error');
}

// Leest opgeslagen gegevens, valideert ze en herstelt daarna de interface en wedstrijd.
function restoreState() {
  const value = getSavedCookie();
  if (value === null) return false;
  let state;
  try {
    state = JSON.parse(decodeURIComponent(value));
  } catch (error) {
    $('saveStatus').textContent = 'Opgeslagen gegevens konden niet worden gelezen; pas iets aan om opnieuw op te slaan.';
    $('saveStatus').classList.add('error');
    return false;
  }
  if (!state || state.v !== 1 || (state.r !== undefined && typeof state.r !== 'string') ||
      !Array.isArray(state.a) || !Array.isArray(state.f) ||
      state.f.length !== 5 || !state.f.every(value => typeof value === 'string') ||
      typeof state.k !== 'string' || (state.s !== null && !validMatch(state.s))) {
    $('saveStatus').textContent = 'Opgeslagen gegevens zijn ongeldig; pas iets aan om opnieuw op te slaan.';
    $('saveStatus').classList.add('error');
    return false;
  }
  if (!state.a.every(i => Number.isInteger(i) && i >= 0 && i < NAMES.length) ||
      new Set(state.a).size !== state.a.length) {
    $('saveStatus').textContent = 'Opgeslagen spelers zijn ongeldig; pas iets aan om opnieuw op te slaan.';
    $('saveStatus').classList.add('error');
    return false;
  }
  state.f.forEach((value, i) => {
    $(['duration', 'slots', 'interval', 'maxSubs', 'maxBench'][i]).value = value;
  });
  $('shuffleSeed').value = (state.r || '').toLowerCase();
  players.forEach((player, i) => { player.on = state.a.includes(i); });
  render();
  if (players.some(player => player.on && player.name === state.k)) $('keeper').value = state.k;
  updateGenerateButton();
  if (state.s) {
    const match = state.s;
    S = {
      names: match.n.map(i => NAMES[i]),
      keeper: match.k >= 0 ? NAMES[match.k] : '',
      params: {
        duration: match.p[0], slots: match.p[1], interval: match.p[2],
        maxSubs: match.p[3], maxBench: match.p[4],
      },
      dropAt: Object.fromEntries(match.d.map(([i, events]) => [i,
        events.map(([from, out]) => ({ from, out }))])),
      result: {
        lens: match.l,
        blocks: match.b.map(([field, actions, changed], i) => ({
          len: match.l[i],
          field: new Set(field),
          actions,
          changed,
        })),
        play: match.t,
        warnings: match.w,
      },
    };
    show();
  }
  $('saveStatus').textContent = 'Instellingen en opstelling automatisch opgeslagen (via cookies).';
  return true;
}

// Bouwt de spelersknoppen en keeperkeuze opnieuw op op basis van de selectie.
function render() {
  $('players').innerHTML = '';
  players.forEach(p => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'player' + (p.on ? '' : ' off');
    b.textContent = p.name;
    b.setAttribute('aria-pressed', p.on);
    b.onclick = () => { if (document.body.classList.contains('timer-locked')) return; p.on = !p.on; render(); saveState(); };
    $('players').appendChild(b);
  });
  const prev = $('keeper').value;
  $('keeper').innerHTML = '<option value="">(geen keeper)</option>';
  players.filter(p => p.on).forEach(p => {
    const o = document.createElement('option');
    o.value = o.textContent = p.name;
    $('keeper').appendChild(o);
  });
  if ([...$('keeper').options].some(o => o.value === prev)) $('keeper').value = prev;
  updateGenerateButton();
}

// Schakelt genereren in zodra minstens zes spelers en een geselecteerde keeper aanwezig zijn.
function updateGenerateButton(locked = document.body.classList.contains('timer-locked')) {
  const selectedKeeper = players.some(p => p.on && p.name === $('keeper').value);
  $('generate').disabled = locked || players.filter(p => p.on).length < 6 || !selectedKeeper;
}

// Berekent het wisselschema. Blokken in `frozen` blijven ongewijzigd; spelers in `dropAt`
// (index -> blok) vallen vanaf dat blok uit en worden indien nodig direct vervangen.
// dropAt[i] = lijst van { from, out } wijzigingen; de laatste met from <= b bepaalt of speler i uit is.
// Geeft aan of speler i in blok b tijdelijk uit het schema is gehaald.
function isOut(dropAt, i, b) {
  let out = false;
  (dropAt[i] || []).forEach(e => { if (e.from <= b) out = e.out; });
  return out;
}

// Vervangt eventuele latere wijzigingen zodat deze instelling vanaf `from` geldt.
function setOut(dropAt, i, from, out) {
  dropAt[i] = (dropAt[i] || []).filter(e => e.from < from);
  dropAt[i].push({ from, out });
}

// Verdeelt spelers over veld en bank en maakt per tijdsblok de benodigde wissels.
function buildSchedule(names, duration, slots, interval, maxSubs, maxBench, frozen = [], dropAt = {}) {
  const warnings = [];
  const gone = (i, b) => isOut(dropAt, i, b);
  const n = names.length;
  slots = Math.min(slots, n);
  const lens = [];
  for (let t = 0; t < duration; t += interval) lens.push(Math.min(interval, duration - t));

  const play = names.map(() => 0);
  const streak = names.map(() => 0); // aaneengesloten banktijd in minuten
  let field = new Set();
  const lastChange = names.map(() => -1); // blok waarin speler laatst in/uit ging
  const blocks = [];

  for (let b = 0; b < lens.length; b++) {
    let actions = [];
    // Bevroren blokken blijven zoals ze waren; bij het eerste blok wordt het veld gevuld.
    if (b < frozen.length) {
      field = new Set(frozen[b].field);
      actions = frozen[b].actions;
      frozen[b].changed.forEach(i => lastChange[i] = b);
    } else if (b === 0) {
      for (let i = 0; i < n && field.size < slots; i++) if (!gone(i, 0)) field.add(i);
    } else {
      const changed = [];
      const avail = i => !gone(i, b);
      // Vervang eerst spelers die vanaf dit blok zijn uitgevallen.
      const forcedOut = [...field].filter(i => !avail(i));
      const bench = [...Array(n).keys()].filter(i => !field.has(i) && avail(i));
      const mustIn = i => streak[i] + lens[b] > maxBench;
      // Geef voorrang aan spelers met de langste banktijd en de minste speeltijd.
      bench.sort((x, y) =>
        (mustIn(y) - mustIn(x)) || (streak[y] - streak[x]) || (play[x] - play[y]));
      forcedOut.forEach(out => {
        field.delete(out);
        const inn = bench.shift();
        if (inn === undefined) {
          warnings.push(`Te weinig spelers: ${names[out]} kan niet worden vervangen.`);
          actions.push(`${names[out]} valt uit`);
          return;
        }
        field.add(inn); lastChange[inn] = b; changed.push(inn);
        actions.push(`${names[inn]} <> ${names[out]}`);
      });
      const onField = [...field];
      const k = Math.min(Math.max(0, maxSubs - forcedOut.length), bench.length, onField.length);
      const ins = bench.slice(0, k);
      // Wie er het langst staat / de meeste speeltijd heeft gaat eruit; liever niet direct weer eruit
      onField.sort((x, y) =>
        ((lastChange[x] === b - 1) - (lastChange[y] === b - 1)) || (play[y] - play[x]));
      const outs = onField.slice(0, k);
      ins.forEach((inn, j) => {
        field.delete(outs[j]); field.add(inn);
        lastChange[inn] = b; lastChange[outs[j]] = b; changed.push(inn, outs[j]);
        actions.push(`${names[inn]} <> ${names[outs[j]]}`);
      });
      blocks.push({ len: lens[b], field: new Set(field), actions, changed });
      accumulate(b);
      continue;
    }
    blocks.push({ len: lens[b], field: new Set(field), actions, changed: b < frozen.length ? frozen[b].changed : [] });
    accumulate(b);
  }
  return { lens, blocks, play, warnings: [...new Set(warnings)] };

  // Houd speeltijd en aaneengesloten banktijd bij en meld wanneer iemand te lang zit.
  function accumulate(b) {
    for (let i = 0; i < n; i++) {
      if (gone(i, b)) { streak[i] = 0; continue; }
      if (field.has(i)) { play[i] += lens[b]; streak[i] = 0; } else streak[i] += lens[b];
      if (streak[i] > maxBench) warnings.push(`${names[i]} zit langer dan ${maxBench} minuten aan de kant (${streak[i]} min). Verhoog het aantal wissels per keer of de maximale banktijd.`);
    }
  }
}

// Maakt een reproduceerbare toevalsbron op basis van een tekstuele seed.
function seededRandom(seed) {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    state ^= seed.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

// Ontsnapt tekst voordat die als HTML in de wedstrijdweergave wordt ingevoegd.
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Toont een wissel als namen met een wisselpictogram; gewone meldingen blijven tekst.
function formatSubstitution(action) {
  const normalized = action.replace(' komt erin voor ', ' <> ').replace(' (uitgevallen)', '');
  const separator = normalized.indexOf(' <> ');
  if (separator < 0) return esc(normalized);
  const incoming = esc(normalized.slice(0, separator));
  const outgoing = esc(normalized.slice(separator + 4));
  return `<strong class="incoming-player">${incoming}</strong> <svg class="swap-icon" viewBox="0 0 24 24" role="img" aria-label="wissel" focusable="false"><path d="M3 7h18m0 0-4-4m4 4-4 4M21 17H3m0 0 4 4m-4-4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ${outgoing}`;
}
let S = null; // huidige wedstrijd: { names, keeper, params, dropAt, result }

// Rekent het schema opnieuw uit op basis van de huidige instellingen.
function compute(frozen) {
  const p = S.params;
  S.result = buildSchedule(S.names, p.duration, p.slots, p.interval, p.maxSubs, p.maxBench, frozen, S.dropAt);
}

// Bouwt de wedstrijdtabel, speeltijdweergave, waarschuwingen en klikbare spelerscellen.
function show() {
  const { names, keeper, params: p, dropAt, result: r } = S;
  const startOf = [];
  r.lens.reduce((t, l, i) => (startOf[i] = t, t + l), 0);
  let html = '';
  if (keeper) html += `<p>Keeper: <strong>${esc(keeper)}</strong></p>`;
  if (names.length <= p.slots) html += '<p>Alle veldspelers staan de hele wedstrijd in het veld; geen wissels nodig.</p>';
  html += '<div class="tablewrap"><table><thead><tr><th>Blok</th><th>Wissels</th>' +
    names.map(x => `<th>${esc(x)}</th>`).join('') + '</tr></thead><tbody>';
  r.blocks.forEach((bl, bi) => {
    const t = startOf[bi];
    html += `<tr data-subs="${bl.actions.length}" data-start="${t}" data-end="${t + bl.len}"${bi === r.blocks.length / 2 ? ' class="mid-match-break"' : ''}><td>${t}–${t + bl.len}</td>` +
      `<td>${bl.actions.length ? bl.actions.map(action => formatSubstitution(action)).join('<br>') : '-'}</td>` +
      names.map((x, i) => isOut(dropAt, i, bi) ? `<td class="out" data-b="${bi}" data-i="${i}">uit</td>` :
        `<td class="pick${bl.field.has(i) ? ' on' : ''}" data-b="${bi}" data-i="${i}">${bl.field.has(i) ? esc(x) : ''}</td>`).join('') +
      '</tr>';
  });
  html += '</tbody></table></div>';
  html += '<table class="playing-time"><thead><tr><th>Naam</th><th>Minuten</th></tr></thead><tbody>' +
    names.map((x, i) => `<tr><td>${esc(x)}</td><td>${r.play[i]}</td></tr>`).join('') +
    '</tbody></table>';
  const active = r.play.filter((_, i) => !isOut(dropAt, i, r.blocks.length - 1));
  if (active.length && Math.max(...active) - Math.min(...active) > r.lens[0])
    html += '<p>Een exact gelijke verdeling is niet mogelijk met deze instellingen.</p>';
  r.warnings.forEach(w => html += `<p class="warn">⚠️ ${esc(w)}</p>`);

  $('output').innerHTML = html;
  // Klik op een speler om die vanaf dit blok uit het schema te halen of terug te zetten.
  const change = (i, b, out) => {
    setOut(S.dropAt, i, b, out);
    compute(S.result.blocks.slice(0, b));
    show();
    saveState();
  };
  document.querySelectorAll('td.pick').forEach(td => td.onclick = () => change(+td.dataset.i, +td.dataset.b, true));
  document.querySelectorAll('td.out').forEach(td => td.onclick = () => change(+td.dataset.i, +td.dataset.b, false));
}

// Leest de invoer, controleert die, schudt de spelersvolgorde en genereert de opstelling.
$('generate').onclick = () => {
  saveState();
  const out = $('output');
  const keeper = $('keeper').value;
  const names = players.filter(p => p.on && p.name !== keeper).map(p => p.name);
  const params = {
    duration: +$('duration').value, slots: +$('slots').value, interval: +$('interval').value,
    maxSubs: +$('maxSubs').value, maxBench: +$('maxBench').value,
  };
  if (!Object.values(params).every(v => v > 0)) {
    out.innerHTML = '<p class="warn">Vul overal een positief getal in.</p>'; return;
  }
  if (!names.length) { out.innerHTML = '<p class="warn">Geen veldspelers geselecteerd.</p>'; return; }
  const seed = $('shuffleSeed').value;
  const random = seed.trim() ? seededRandom(seed) : Math.random;
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  S = { names, keeper, params: { ...params, slots: Math.min(params.slots, names.length) }, dropAt: {}, result: null };
  compute([]);
  show();
  saveState();
};

// Initialiseert de selectie, herstelt eerdere gegevens en bewaart wijzigingen automatisch.
render();
if (!restoreState()) saveState();
$('shuffleSeed').addEventListener('input', event => {
  const input = event.currentTarget;
  const lowercase = input.value.toLowerCase();
  if (input.value !== lowercase) input.value = lowercase;
});
['duration', 'slots', 'interval', 'maxSubs', 'maxBench', 'keeper', 'shuffleSeed'].forEach(id => {
  $(id).addEventListener('input', () => { saveState(); updateGenerateButton(); });
  $(id).addEventListener('change', () => { saveState(); updateGenerateButton(); });
});
// Timergegevens worden bewaard zodat de wedstrijdklok doorloopt na navigatie of herladen.
const TIMER_COOKIE = 'mhcw-timer';
// Herstelt de timer uit lokale opslag of een cookie, of geeft een nieuwe timer terug.
function loadTimer() {
  let raw = null;
  try { raw = localStorage.getItem(TIMER_COOKIE); } catch (e) {}
  if (!raw) {
    const item = document.cookie.split('; ').find(c => c.startsWith(`${TIMER_COOKIE}=`));
    if (item) raw = decodeURIComponent(item.slice(TIMER_COOKIE.length + 1));
  }
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return { acc: 0, since: null, firstHalfPlayed: false, secondHalfPlayed: false, starts: [] };
}
let timer = loadTimer();
// Cookies werken niet op file://, daarom ook in localStorage opslaan
// Bewaart de huidige timerstand in beide beschikbare opslaglocaties.
function saveTimer() {
  const value = JSON.stringify(timer);
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TIMER_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  try { localStorage.setItem(TIMER_COOKIE, value); } catch (e) {}
}
// Verwijdert de opgeslagen timerstand bij een reset.
function clearTimerCookie() {
  document.cookie = `${TIMER_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  try { localStorage.removeItem(TIMER_COOKIE); } catch (e) {}
}
// Geeft verstreken tijd terug, inclusief de tijd sinds de timer is gestart.
function timerMs() {
  return timer.acc + (timer.since ? Date.now() - timer.since : 0);
}
// Haalt de ingestelde wedstrijdduur op en valt terug op 50 minuten.
function timerDurationMs() {
  return Math.max(1, Number($('duration').value) || 50) * 60000;
}
// Formatteert milliseconden als minuten en seconden.
function fmt(ms) {
  const total = Math.floor(ms / 1000);
  return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
}
let lastBlockKey; // undefined bij laden: dan geen alarm
let audioCtx = null;
// Activeert audio na een gebruikersactie, zoals vereist door browsers.
function unlockAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {}
}
// Geeft een trilsignaal en, indien audio beschikbaar is, drie korte tonen.
function playAlarm() {
  if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
  if (!audioCtx || audioCtx.state !== 'running') return;
  [0, 0.35, 0.7].forEach(delay => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const t = audioCtx.currentTime + delay;
    osc.type = 'square';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}
// Werkt de klok, speelhelft, huidige wisselblok en bedieningsstatus bij.
function timerTick() {
  const full = timerDurationMs();
  const half = full / 2;
  let ms = timerMs();
  if (timer.since && !timer.secondHalfPlayed && ms >= full) {
    timer.acc = full; timer.since = null; timer.secondHalfPlayed = true; timer.firstHalfPlayed = true;
    saveTimer(); ms = full;
  } else if (timer.since && !timer.firstHalfPlayed && ms >= half) {
    timer.acc = half; timer.since = null; timer.firstHalfPlayed = true;
    saveTimer(); ms = half;
  }
  $('timerTime').textContent = fmt(ms);
  const locked = !!timer.since || timer.acc > 0 || timer.firstHalfPlayed || timer.secondHalfPlayed;
  document.body.classList.toggle('timer-locked', locked);
  ['duration', 'slots', 'interval', 'maxSubs', 'maxBench', 'keeper', 'shuffleSeed']
    .forEach(id => { $(id).disabled = locked; });
  updateGenerateButton(locked);
  const minute = ms / 60000;
  let currentRow = null;
  document.querySelectorAll('#output tr[data-start]').forEach(tr => {
    const started = timer.since || timer.acc > 0;
    const active = started && !timer.secondHalfPlayed && minute >= +tr.dataset.start && minute < +tr.dataset.end;
    tr.classList.toggle('current-block', active);
    if (active) currentRow = tr;
  });
  const key = currentRow ? currentRow.dataset.start : null;
  if (lastBlockKey != null && key !== null && key !== lastBlockKey && +currentRow.dataset.subs > 0) playAlarm();
  lastBlockKey = key;
  const running = !!timer.since;
  let phase = 'Nog niet gestart';
  if (timer.secondHalfPlayed) phase = 'Wedstrijd afgelopen';
  else if (timer.firstHalfPlayed) phase = running ? '2e helft' : 'Rust – eerste helft gespeeld';
  else if (running || timer.acc > 0) phase = '1e helft';
  $('timerPhase').textContent = phase;
  const btn = $('timerToggle');
  btn.disabled = timer.secondHalfPlayed;
  btn.textContent = running ? 'Pauze' : (timer.acc > 0 ? 'Hervat' : 'Start');
}
$('timerToggle').addEventListener('click', () => {
  unlockAudio();
  if (timer.secondHalfPlayed) return;
  // Pauzeer door de verstreken tijd vast te leggen, of start/hervat de klok.
  if (timer.since) {
    timer.acc = timerMs(); timer.since = null;
  } else {
    timer.since = Date.now(); timer.starts.push(timer.since);
  }
  saveTimer(); timerTick();
});
// Vraagt bevestiging voordat de timer wordt teruggezet.
$('timerReset').addEventListener('click', () => $('resetConfirm').classList.add('open'));
$('resetNo').addEventListener('click', () => $('resetConfirm').classList.remove('open'));
$('resetYes').addEventListener('click', () => {
  $('resetConfirm').classList.remove('open');
  timer = { acc: 0, since: null, firstHalfPlayed: false, secondHalfPlayed: false, starts: [] };
  clearTimerCookie(); timerTick();
});
// Werk de timer meteen bij en daarna vier keer per seconde.
timerTick();
setInterval(timerTick, 250);
