/* =================================================================
   Debian Installation – Lerntrainer  (Frontend)
   Vanilla JavaScript – keine Frameworks.
   ================================================================= */
'use strict';

const API = {
  async content() { return (await fetch('/api/content')).json(); },
  async progress() { return (await fetch('/api/progress')).json(); },
  async saveCard(id, known) {
    return (await fetch('/api/progress/card', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, known }),
    })).json();
  },
  async saveQuiz(id, correct) {
    return (await fetch('/api/progress/quiz', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, correct }),
    })).json();
  },
  async reset() {
    return (await fetch('/api/progress/reset', { method: 'POST' })).json();
  },
};

/* ---------------- globaler Zustand ---------------- */
const state = {
  topics: [], cards: [], quiz: [], summaries: [],
  topicMap: {},
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const RING = 2 * Math.PI * 52; // Umfang der Fortschrittsringe

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.hidden = true; }, 300);
  }, 1600);
}

/* ---------------- Navigation ---------------- */
function navigate(view) {
  $$('.view').forEach((v) => { v.hidden = true; });
  const el = $('#view-' + view);
  if (el) el.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =================================================================
   START / BOOT
   ================================================================= */
async function boot() {
  const data = await API.content();
  state.topics = data.topics;
  state.cards = data.cards;
  state.quiz = data.quiz;
  state.summaries = data.summaries;
  state.topicMap = {};
  state.topics.forEach((t) => { state.topicMap[t.id] = t; });

  buildTopicSelects();
  renderSummaries();
  renderTopicGrid();
  await refreshProgress();

  wireEvents();
  navigate('home');
}

/* ---------------- Fortschritt anzeigen ---------------- */
function setRing(elId, percent) {
  const c = document.getElementById(elId);
  if (!c) return;
  c.style.strokeDasharray = RING;
  c.style.strokeDashoffset = RING * (1 - percent / 100);
}

async function refreshProgress() {
  const p = await API.progress();
  state.progress = p;
  $('#progressPercent').textContent = p.percent;
  $('#topProgressLabel').innerHTML = p.percent + '&nbsp;%';
  setRing('ringFg', p.percent);
  $('#statKnown').textContent = p.cards.known;
  $('#statUnknown').textContent = p.cards.unknown;
  $('#statNew').textContent = p.cards.new;

  // Pro-Thema-Fortschritt im Themen-Grid
  const byTopic = {};
  (p.perTopic || []).forEach((r) => { byTopic[r.topic] = r; });
  $$('.topic-card').forEach((card) => {
    const id = card.dataset.topic;
    const r = byTopic[id];
    if (!r) return;
    const pct = r.total ? Math.round((r.known / r.total) * 100) : 0;
    const bar = card.querySelector('.topic-mini > span');
    const stat = card.querySelector('.topic-stat');
    if (bar) bar.style.width = pct + '%';
    if (stat) stat.textContent = `${r.known}/${r.total} gewusst · ${pct}%`;
  });
}

/* ---------------- Themenübersicht (Start) ---------------- */
function renderTopicGrid() {
  const grid = $('#topicGrid');
  grid.innerHTML = '';
  state.topics.forEach((t) => {
    const nCards = state.cards.filter((c) => c.topic === t.id).length;
    const nQuiz = state.quiz.filter((q) => q.topic === t.id).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'topic-card';
    btn.dataset.topic = t.id;
    btn.innerHTML = `
      <span class="topic-ico">${t.icon || '📄'}</span>
      <span class="topic-body">
        <span class="topic-name">${esc(t.title)}</span>
        <span class="topic-stat">${nCards} Karten · ${nQuiz} Fragen</span>
        <span class="topic-mini"><span style="width:0%"></span></span>
      </span>`;
    btn.addEventListener('click', () => {
      cardsSession.topic = t.id;
      $('#cardsTopic').value = t.id;
      startCards();
      navigate('cards');
    });
    grid.appendChild(btn);
  });
}

/* ---------------- Themen-Dropdowns ---------------- */
function buildTopicSelects() {
  const opts = ['<option value="all">Alle Themen</option>']
    .concat(state.topics.map((t) => `<option value="${t.id}">${esc(t.title)}</option>`))
    .join('');
  $('#cardsTopic').innerHTML = opts;
  $('#quizTopic').innerHTML = opts;
}

/* =================================================================
   KARTEIKARTEN
   ================================================================= */
const cardsSession = { topic: 'all', onlyWrong: false, list: [], idx: 0, flipped: false };

function filteredCards() {
  let list = state.cards.slice();
  if (cardsSession.topic !== 'all') list = list.filter((c) => c.topic === cardsSession.topic);
  if (cardsSession.onlyWrong) list = list.filter((c) => c.status === 'unknown');
  return list;
}

function startCards(keepShuffle) {
  const base = filteredCards();
  cardsSession.list = keepShuffle ? base : shuffle(base);
  cardsSession.idx = 0;
  cardsSession.flipped = false;
  renderCard();
}

function renderCard() {
  const deck = $('#cardsDeck');
  const empty = $('#cardsEmpty');
  const list = cardsSession.list;

  if (!list.length) {
    deck.hidden = true; empty.hidden = false;
    return;
  }
  deck.hidden = false; empty.hidden = true;

  if (cardsSession.idx >= list.length) cardsSession.idx = 0;
  const card = list[cardsSession.idx];

  const fc = $('#flashcard');
  fc.classList.remove('flipped');
  cardsSession.flipped = false;

  $('#cardCounter').textContent = `${cardsSession.idx + 1} / ${list.length}`;
  $('#cardFront').textContent = card.question;
  $('#cardBack').textContent = card.answer;

  const badge = $('#cardSource');
  if (card.source === 'zusatz') {
    badge.textContent = 'Zusatz'; badge.className = 'src-badge src-zusatz';
  } else {
    badge.textContent = 'PDF'; badge.className = 'src-badge src-pdf';
  }
}

function flipCard() {
  cardsSession.flipped = !cardsSession.flipped;
  $('#flashcard').classList.toggle('flipped', cardsSession.flipped);
}

async function answerCard(known) {
  const card = cardsSession.list[cardsSession.idx];
  if (!card) return;
  card.status = known ? 'known' : 'unknown';              // lokalen Zustand aktualisieren
  const master = state.cards.find((c) => c.id === card.id);
  if (master) master.status = card.status;

  try { await API.saveCard(card.id, known); } catch (e) { /* offline: egal */ }
  toast(known ? '✓ Gewusst – gespeichert' : '✗ Zum Wiederholen vorgemerkt');

  cardsSession.idx++;
  if (cardsSession.idx >= cardsSession.list.length) {
    // Durchlauf fertig
    await refreshProgress();
    toast('🎉 Stapel durchgearbeitet!');
    cardsSession.idx = 0;
    startCards();
  } else {
    renderCard();
  }
  refreshProgress();
}

/* =================================================================
   QUIZ
   ================================================================= */
const quizSession = { topic: 'all', list: [], idx: 0, correct: 0, wrong: [], answered: false };

function startQuiz(list) {
  quizSession.list = list;
  quizSession.idx = 0;
  quizSession.correct = 0;
  quizSession.wrong = [];
  quizSession.answered = false;
  $('#quizSetup').hidden = true;
  $('#quizResult').hidden = true;
  $('#quizRun').hidden = false;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizSession.list[quizSession.idx];
  quizSession.answered = false;
  const total = quizSession.list.length;

  $('#quizCount').textContent = `${quizSession.idx + 1} / ${total}`;
  $('#quizBar').style.width = ((quizSession.idx) / total) * 100 + '%';
  $('#quizQuestion').textContent = q.question;
  $('#quizFeedback').hidden = true;
  $('#quizNext').hidden = true;

  const keys = ['A', 'B', 'C', 'D', 'E', 'F'];
  const box = $('#quizOptions');
  box.innerHTML = '';
  q.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'quiz-opt';
    b.dataset.i = i;
    b.innerHTML = `<span class="opt-key">${keys[i]}</span><span>${esc(opt)}</span>`;
    b.addEventListener('click', () => chooseQuiz(i));
    box.appendChild(b);
  });
}

async function chooseQuiz(choice) {
  if (quizSession.answered) return;
  quizSession.answered = true;
  const q = quizSession.list[quizSession.idx];
  const correct = choice === q.correct;

  $$('.quiz-opt').forEach((b) => {
    const i = Number(b.dataset.i);
    b.disabled = true;
    if (i === q.correct) b.classList.add('correct');
    else if (i === choice) b.classList.add('wrong');
  });

  const fb = $('#quizFeedback');
  fb.hidden = false;
  fb.className = 'quiz-feedback ' + (correct ? 'ok' : 'no');
  fb.innerHTML = `<b>${correct ? '✓ Richtig!' : '✗ Leider falsch.'}</b>${esc(q.explanation || '')}`;

  if (correct) quizSession.correct++;
  else quizSession.wrong.push(q);

  try { await API.saveQuiz(q.id, correct); } catch (e) { /* offline: egal */ }
  refreshProgress();

  const last = quizSession.idx === quizSession.list.length - 1;
  const next = $('#quizNext');
  next.hidden = false;
  next.textContent = last ? 'Auswertung anzeigen ›' : 'Weiter ›';
}

function nextQuiz() {
  if (quizSession.idx < quizSession.list.length - 1) {
    quizSession.idx++;
    renderQuizQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  $('#quizRun').hidden = true;
  $('#quizResult').hidden = false;
  const total = quizSession.list.length;
  const pct = total ? Math.round((quizSession.correct / total) * 100) : 0;

  $('#quizBar').style.width = '100%';
  $('#resultPercent').textContent = pct;
  setRing('resultRingFg', pct);

  let verdict;
  if (pct === 100) verdict = 'Perfekt! 🏆';
  else if (pct >= 80) verdict = 'Sehr gut! 👍';
  else if (pct >= 60) verdict = 'Solide – weiter üben.';
  else verdict = 'Das wird noch – wiederhole die Fragen.';

  $('#resultText').innerHTML =
    `<b>${quizSession.correct} von ${total}</b> richtig beantwortet.<br>${verdict}`;

  $('#quizRetryWrong').hidden = quizSession.wrong.length === 0;
}

/* =================================================================
   ZUSAMMENFASSUNGEN
   ================================================================= */
function renderSummaries() {
  const list = $('#summaryList');
  list.innerHTML = '';
  state.summaries.forEach((s) => {
    const t = state.topicMap[s.topic] || {};
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.innerHTML = `
      <button class="summary-head" type="button">
        <span class="s-ico">${t.icon || '📄'}</span>
        <span>${esc(s.title)}</span>
        <span class="s-arrow">›</span>
      </button>
      <div class="summary-body"><div class="summary-inner">${s.html}</div></div>`;
    card.querySelector('.summary-head').addEventListener('click', () => {
      card.classList.toggle('open');
    });
    list.appendChild(card);
  });
}

/* =================================================================
   EVENTS
   ================================================================= */
function wireEvents() {
  $('#homeBtn').addEventListener('click', () => navigate('home'));

  $$('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => {
      const dest = el.dataset.nav;
      if (dest === 'cards') { startCards(); navigate('cards'); }
      else if (dest === 'quiz') { resetQuizSetup(); navigate('quiz'); }
      else if (dest === 'summaries') { navigate('summaries'); }
      else if (dest === 'home') { navigate('home'); refreshProgress(); }
      else if (dest === 'cards-reset') {
        cardsSession.onlyWrong = false;
        $('#cardsOnlyWrong').setAttribute('aria-pressed', 'false');
        startCards();
      }
    });
  });

  // Karteikarten
  const fc = $('#flashcard');
  fc.addEventListener('click', flipCard);
  fc.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipCard(); }
  });
  $('#btnKnown').addEventListener('click', () => answerCard(true));
  $('#btnUnknown').addEventListener('click', () => answerCard(false));
  $('#cardsTopic').addEventListener('change', (e) => {
    cardsSession.topic = e.target.value; startCards();
  });
  $('#cardsShuffle').addEventListener('click', () => { startCards(); toast('🔀 Karten gemischt'); });
  $('#cardsOnlyWrong').addEventListener('click', (e) => {
    cardsSession.onlyWrong = !cardsSession.onlyWrong;
    e.currentTarget.setAttribute('aria-pressed', String(cardsSession.onlyWrong));
    startCards();
    toast(cardsSession.onlyWrong ? 'Nur falsche Karten' : 'Alle Karten');
  });

  // Quiz
  $('#quizStart').addEventListener('click', () => {
    quizSession.topic = $('#quizTopic').value;
    let list = state.quiz.slice();
    if (quizSession.topic !== 'all') list = list.filter((q) => q.topic === quizSession.topic);
    list = shuffle(list);
    if (!list.length) { toast('Keine Fragen in diesem Thema'); return; }
    startQuiz(list);
  });
  $('#quizNext').addEventListener('click', nextQuiz);
  $('#quizRestart').addEventListener('click', resetQuizSetup);
  $('#quizRetryWrong').addEventListener('click', () => {
    if (quizSession.wrong.length) startQuiz(shuffle(quizSession.wrong));
  });

  // Tastatur im Quiz (1-4 / A-D)
  document.addEventListener('keydown', (e) => {
    if ($('#view-quiz').hidden || $('#quizRun').hidden || quizSession.answered) return;
    const map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    const k = e.key.toLowerCase();
    if (k in map && map[k] < (quizSession.list[quizSession.idx]?.options.length || 0)) {
      chooseQuiz(map[k]);
    }
  });

  // Fortschritt zurücksetzen
  $('#resetBtn').addEventListener('click', async () => {
    if (!confirm('Lernfortschritt wirklich zurücksetzen? Alle Markierungen gehen verloren.')) return;
    await API.reset();
    state.cards.forEach((c) => { c.status = 'new'; });
    await refreshProgress();
    toast('Fortschritt zurückgesetzt');
  });
}

function resetQuizSetup() {
  $('#quizResult').hidden = true;
  $('#quizRun').hidden = true;
  $('#quizSetup').hidden = false;
}

/* ---------------- Los geht's ---------------- */
boot().catch((err) => {
  console.error(err);
  document.body.innerHTML =
    '<p style="padding:40px;text-align:center;color:#e2574c">Fehler beim Laden. Läuft der Server? Bitte Seite neu laden.</p>';
});
