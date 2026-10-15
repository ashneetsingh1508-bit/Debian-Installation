/*
 * server.js – Express-Server für den Debian-Installation Lerntrainer
 *
 *  - Port 3003, Host 0.0.0.0 (im WLAN auch vom Handy erreichbar)
 *  - Prüft, ob Port 3003 bereits belegt ist, und zeigt eine
 *    verständliche Fehlermeldung.
 *  - Liefert statische Dateien (public/) und eine kleine JSON-API.
 *  - Speichert den Lernfortschritt automatisch in SQLite.
 */

const path = require('path');
const os = require('os');
const express = require('express');
const store = require('./db');

const PORT = 3003;
const HOST = '0.0.0.0';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ----------------------------- API ----------------------------- */

// Alle Lerninhalte auf einmal (Themen, Karteikarten, Quiz, Zusammenfassungen)
app.get('/api/content', (req, res) => {
  res.json({
    topics: store.getTopics(),
    cards: store.getCards(),
    quiz: store.getQuiz(),
    summaries: store.getSummaries(),
  });
});

// Aktueller Lernfortschritt
app.get('/api/progress', (req, res) => {
  res.json(store.getProgress());
});

// Karteikarten-Ergebnis speichern:  { id, known: true|false }
app.post('/api/progress/card', (req, res) => {
  const { id, known } = req.body || {};
  if (typeof id !== 'string' || typeof known !== 'boolean') {
    return res.status(400).json({ error: 'id (string) und known (boolean) erforderlich' });
  }
  const ok = store.saveCardProgress(id, known);
  if (!ok) return res.status(404).json({ error: 'Karte nicht gefunden' });
  res.json({ ok: true, progress: store.getProgress() });
});

// Quiz-Ergebnis speichern:  { id, correct: true|false }
app.post('/api/progress/quiz', (req, res) => {
  const { id, correct } = req.body || {};
  if (typeof id !== 'string' || typeof correct !== 'boolean') {
    return res.status(400).json({ error: 'id (string) und correct (boolean) erforderlich' });
  }
  const ok = store.saveQuizProgress(id, correct);
  if (!ok) return res.status(404).json({ error: 'Frage nicht gefunden' });
  res.json({ ok: true, progress: store.getProgress() });
});

// Fortschritt zurücksetzen
app.post('/api/progress/reset', (req, res) => {
  store.resetProgress();
  res.json({ ok: true, progress: store.getProgress() });
});

// Fallback: Einzelseiten-App immer über index.html ausliefern
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ------------------- Server starten + Port-Check ---------------- */

function localIPs() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) ips.push(net.address);
    }
  }
  return ips;
}

const server = app.listen(PORT, HOST, () => {
  const ips = localIPs();
  console.log('');
  console.log('  ╔══════════════════════════════════════════════════════╗');
  console.log('  ║   Debian Installation – Lerntrainer läuft! 🐧          ║');
  console.log('  ╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`   Am PC:        http://localhost:${PORT}`);
  if (ips.length) {
    console.log('   Im WLAN (Handy/Tablet, gleiches Netzwerk):');
    ips.forEach((ip) => console.log(`                 http://${ip}:${PORT}`));
  }
  console.log('');
  console.log('   Zum Beenden dieses Fenster schließen oder Strg+C drücken.');
  console.log('');
});

// Verständliche Fehlermeldung, falls Port 3003 bereits belegt ist.
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('');
    console.error('  ┌──────────────────────────────────────────────────────┐');
    console.error(`  │  FEHLER: Port ${PORT} ist bereits belegt.                 │`);
    console.error('  └──────────────────────────────────────────────────────┘');
    console.error('');
    console.error(`  Es läuft bereits ein Programm auf Port ${PORT}.`);
    console.error('  Möglicherweise ist der Lerntrainer schon gestartet –');
    console.error(`  öffne einfach http://localhost:${PORT} im Browser.`);
    console.error('');
    console.error('  Oder beende das andere Programm und starte erneut.');
    console.error('  (Windows: im Terminal  ->  netstat -ano | findstr :' + PORT + ')');
    console.error('');
  } else {
    console.error('  Server-Fehler:', err.message);
  }
  process.exit(1);
});

// Server bewusst offen halten – nicht automatisch schließen.
process.stdin.resume();

// Sauberes Beenden bei Strg+C
process.on('SIGINT', () => {
  console.log('\n  Lerntrainer wird beendet. Bis bald! 👋');
  server.close(() => process.exit(0));
});
