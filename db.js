/*
 * db.js – SQLite-Datenbank (better-sqlite3)
 *
 * Aufgaben:
 *  - Datenbank beim ersten Start automatisch anlegen (learn.db).
 *  - Lerninhalte aus data/content.js in die DB synchronisieren
 *    (einfügen / aktualisieren) – ohne den Lernfortschritt zu löschen.
 *  - Stabile IDs: Fortschritt ist an die ID gebunden, nicht an die Position.
 */

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const content = require('./data/content');

const DATA_DIR = path.join(__dirname, 'db');
const DB_FILE = path.join(DATA_DIR, 'learn.db');

// Ordner für die DB-Datei sicherstellen (persistent, geht bei Neustart nicht verloren)
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL'); // robust & schnell
db.pragma('foreign_keys = ON');

/* ---------------------------------------------------------------- */
/*  Schema anlegen (nur falls noch nicht vorhanden)                  */
/* ---------------------------------------------------------------- */
db.exec(`
  CREATE TABLE IF NOT EXISTS topics (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    icon        TEXT,
    description TEXT,
    sort        INTEGER
  );

  CREATE TABLE IF NOT EXISTS cards (
    id        TEXT PRIMARY KEY,
    topic     TEXT NOT NULL,
    question  TEXT NOT NULL,
    answer    TEXT NOT NULL,
    source    TEXT NOT NULL DEFAULT 'pdf',
    sort      INTEGER
  );

  CREATE TABLE IF NOT EXISTS quiz (
    id          TEXT PRIMARY KEY,
    topic       TEXT NOT NULL,
    question    TEXT NOT NULL,
    options     TEXT NOT NULL,   -- JSON-Array
    correct     INTEGER NOT NULL,
    explanation TEXT,
    source      TEXT NOT NULL DEFAULT 'pdf',
    sort        INTEGER
  );

  CREATE TABLE IF NOT EXISTS summaries (
    id     TEXT PRIMARY KEY,
    topic  TEXT NOT NULL,
    title  TEXT NOT NULL,
    html   TEXT NOT NULL,
    sort   INTEGER
  );

  -- Lernfortschritt – getrennt von den Inhalten gespeichert,
  -- damit Inhalts-Updates den Fortschritt NICHT löschen.
  CREATE TABLE IF NOT EXISTS card_progress (
    card_id    TEXT PRIMARY KEY,
    status     TEXT NOT NULL DEFAULT 'new',  -- 'new' | 'known' | 'unknown'
    known_cnt  INTEGER NOT NULL DEFAULT 0,
    unknown_cnt INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS quiz_progress (
    quiz_id     TEXT PRIMARY KEY,
    correct_cnt INTEGER NOT NULL DEFAULT 0,
    wrong_cnt   INTEGER NOT NULL DEFAULT 0,
    last_result TEXT,                        -- 'correct' | 'wrong' | NULL
    updated_at  TEXT
  );
`);

/* ---------------------------------------------------------------- */
/*  Inhalte synchronisieren (UPSERT nach stabiler ID)               */
/*  - Neue Inhalte werden eingefügt.                                */
/*  - Geänderte Inhalte werden aktualisiert.                        */
/*  - Entfernte Inhalte werden gelöscht (Fortschritt bleibt         */
/*    als harmlose Waise bestehen und stört nicht).                 */
/*  - Lernfortschritt wird NIE angefasst.                           */
/* ---------------------------------------------------------------- */
function syncContent() {
  const now = new Date().toISOString();

  const upsertTopic = db.prepare(`
    INSERT INTO topics (id, title, icon, description, sort)
    VALUES (@id, @title, @icon, @description, @sort)
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title, icon=excluded.icon,
      description=excluded.description, sort=excluded.sort
  `);

  const upsertCard = db.prepare(`
    INSERT INTO cards (id, topic, question, answer, source, sort)
    VALUES (@id, @topic, @question, @answer, @source, @sort)
    ON CONFLICT(id) DO UPDATE SET
      topic=excluded.topic, question=excluded.question,
      answer=excluded.answer, source=excluded.source, sort=excluded.sort
  `);

  const upsertQuiz = db.prepare(`
    INSERT INTO quiz (id, topic, question, options, correct, explanation, source, sort)
    VALUES (@id, @topic, @question, @options, @correct, @explanation, @source, @sort)
    ON CONFLICT(id) DO UPDATE SET
      topic=excluded.topic, question=excluded.question, options=excluded.options,
      correct=excluded.correct, explanation=excluded.explanation,
      source=excluded.source, sort=excluded.sort
  `);

  const upsertSummary = db.prepare(`
    INSERT INTO summaries (id, topic, title, html, sort)
    VALUES (@id, @topic, @title, @html, @sort)
    ON CONFLICT(id) DO UPDATE SET
      topic=excluded.topic, title=excluded.title,
      html=excluded.html, sort=excluded.sort
  `);

  // Fortschritts-Zeilen für neue Karten/Quizfragen anlegen (ohne vorhandene zu überschreiben)
  const ensureCardProg = db.prepare(`
    INSERT OR IGNORE INTO card_progress (card_id, status, updated_at)
    VALUES (?, 'new', ?)
  `);
  const ensureQuizProg = db.prepare(`
    INSERT OR IGNORE INTO quiz_progress (quiz_id, updated_at) VALUES (?, ?)
  `);

  const tx = db.transaction(() => {
    content.topics.forEach((t, i) =>
      upsertTopic.run({ ...t, sort: i }));

    content.cards.forEach((c, i) => {
      upsertCard.run({ source: 'pdf', ...c, sort: i });
      ensureCardProg.run(c.id, now);
    });

    content.quiz.forEach((q, i) => {
      upsertQuiz.run({
        id: q.id, topic: q.topic, question: q.question,
        options: JSON.stringify(q.options), correct: q.correct,
        explanation: q.explanation || '', source: q.source || 'pdf', sort: i,
      });
      ensureQuizProg.run(q.id, now);
    });

    content.summaries.forEach((s, i) =>
      upsertSummary.run({ ...s, sort: i }));

    // Inhalte löschen, die nicht mehr in content.js stehen (Fortschritt bleibt erhalten)
    const cardIds = content.cards.map((c) => c.id);
    const quizIds = content.quiz.map((q) => q.id);
    const sumIds = content.summaries.map((s) => s.id);
    const topicIds = content.topics.map((t) => t.id);

    pruneExcept('cards', cardIds);
    pruneExcept('quiz', quizIds);
    pruneExcept('summaries', sumIds);
    pruneExcept('topics', topicIds);
  });

  tx();
}

// Entfernt alle Zeilen einer Tabelle, deren id nicht in der übergebenen Liste steht.
function pruneExcept(table, ids) {
  if (!ids.length) return;
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`DELETE FROM ${table} WHERE id NOT IN (${placeholders})`).run(...ids);
}

syncContent();

/* ---------------------------------------------------------------- */
/*  Lese-Funktionen                                                 */
/* ---------------------------------------------------------------- */
function getTopics() {
  return db.prepare('SELECT id, title, icon, description FROM topics ORDER BY sort').all();
}

function getCards() {
  const rows = db.prepare(`
    SELECT c.id, c.topic, c.question, c.answer, c.source,
           COALESCE(p.status, 'new') AS status
    FROM cards c
    LEFT JOIN card_progress p ON p.card_id = c.id
    ORDER BY c.sort
  `).all();
  return rows;
}

function getQuiz() {
  const rows = db.prepare(`
    SELECT q.id, q.topic, q.question, q.options, q.correct, q.explanation, q.source,
           COALESCE(p.last_result, '') AS last_result
    FROM quiz q
    LEFT JOIN quiz_progress p ON p.quiz_id = q.id
    ORDER BY q.sort
  `).all();
  return rows.map((r) => ({ ...r, options: JSON.parse(r.options) }));
}

function getSummaries() {
  return db.prepare('SELECT id, topic, title, html FROM summaries ORDER BY sort').all();
}

/* ---------------------------------------------------------------- */
/*  Fortschritt speichern (automatisch, ohne Button)                */
/* ---------------------------------------------------------------- */
const saveCardStmt = db.prepare(`
  INSERT INTO card_progress (card_id, status, known_cnt, unknown_cnt, updated_at)
  VALUES (@id, @status, @k, @u, @now)
  ON CONFLICT(card_id) DO UPDATE SET
    status = @status,
    known_cnt   = known_cnt   + @k,
    unknown_cnt = unknown_cnt + @u,
    updated_at  = @now
`);

function saveCardProgress(cardId, known) {
  const exists = db.prepare('SELECT 1 FROM cards WHERE id = ?').get(cardId);
  if (!exists) return false;
  saveCardStmt.run({
    id: cardId,
    status: known ? 'known' : 'unknown',
    k: known ? 1 : 0,
    u: known ? 0 : 1,
    now: new Date().toISOString(),
  });
  return true;
}

const saveQuizStmt = db.prepare(`
  INSERT INTO quiz_progress (quiz_id, correct_cnt, wrong_cnt, last_result, updated_at)
  VALUES (@id, @c, @w, @res, @now)
  ON CONFLICT(quiz_id) DO UPDATE SET
    correct_cnt = correct_cnt + @c,
    wrong_cnt   = wrong_cnt   + @w,
    last_result = @res,
    updated_at  = @now
`);

function saveQuizProgress(quizId, correct) {
  const exists = db.prepare('SELECT 1 FROM quiz WHERE id = ?').get(quizId);
  if (!exists) return false;
  saveQuizStmt.run({
    id: quizId,
    c: correct ? 1 : 0,
    w: correct ? 0 : 1,
    res: correct ? 'correct' : 'wrong',
    now: new Date().toISOString(),
  });
  return true;
}

/* ---------------------------------------------------------------- */
/*  Fortschritts-Auswertung                                         */
/* ---------------------------------------------------------------- */
function getProgress() {
  const cardStatus = db.prepare(`
    SELECT COALESCE(p.status,'new') AS status, COUNT(*) AS n
    FROM cards c LEFT JOIN card_progress p ON p.card_id = c.id
    GROUP BY COALESCE(p.status,'new')
  `).all();

  const counts = { new: 0, known: 0, unknown: 0 };
  cardStatus.forEach((r) => { counts[r.status] = r.n; });
  const totalCards = counts.new + counts.known + counts.unknown;

  // Pro-Thema-Auswertung (Karten)
  const perTopic = db.prepare(`
    SELECT c.topic AS topic,
           COUNT(*) AS total,
           SUM(CASE WHEN COALESCE(p.status,'new')='known' THEN 1 ELSE 0 END) AS known,
           SUM(CASE WHEN COALESCE(p.status,'new')='unknown' THEN 1 ELSE 0 END) AS unknown
    FROM cards c LEFT JOIN card_progress p ON p.card_id = c.id
    GROUP BY c.topic
  `).all();

  const quizAgg = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM quiz) AS total,
      SUM(CASE WHEN last_result='correct' THEN 1 ELSE 0 END) AS correct,
      SUM(CASE WHEN last_result='wrong' THEN 1 ELSE 0 END) AS wrong
    FROM quiz_progress
  `).get();

  const percent = totalCards ? Math.round((counts.known / totalCards) * 100) : 0;

  return {
    percent,
    cards: { total: totalCards, known: counts.known, unknown: counts.unknown, new: counts.new },
    quiz: {
      total: quizAgg.total || 0,
      correct: quizAgg.correct || 0,
      wrong: quizAgg.wrong || 0,
    },
    perTopic,
  };
}

// Fortschritt zurücksetzen (optional, über die Oberfläche erreichbar)
function resetProgress() {
  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    db.prepare(`UPDATE card_progress SET status='new', known_cnt=0, unknown_cnt=0, updated_at=?`).run(now);
    db.prepare(`UPDATE quiz_progress SET correct_cnt=0, wrong_cnt=0, last_result=NULL, updated_at=?`).run(now);
  });
  tx();
}

module.exports = {
  db,
  getTopics,
  getCards,
  getQuiz,
  getSummaries,
  getProgress,
  saveCardProgress,
  saveQuizProgress,
  resetProgress,
};
