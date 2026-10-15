# Debian Installation – Lerntrainer 🐧

Eine kleine, moderne und responsive **Lernkartei-Webseite** für das Fach
*Linux – Debian Installation*. Alle Lerninhalte stammen aus den hochgeladenen
Lernunterlagen (PDF der LBS Pöchlarn).

Enthalten sind drei Lernmodi:

- **Karteikarten** – Frage/Antwort, Karten umdrehen, mischen, nach Themen filtern,
  falsche Karten gezielt wiederholen
- **Quiz** – 4 Antwortmöglichkeiten, sofortiges Feedback, prozentuale Auswertung,
  falsche Fragen wiederholen
- **Zusammenfassungen** – kompakte, prüfungstaugliche Erklärungen mit Linux-Befehlen

Der **Lernfortschritt wird automatisch** in einer lokalen SQLite-Datenbank
gespeichert (ohne zusätzlichen Button, keine Anmeldung nötig).

---

## Schnellstart (Windows)

1. [Node.js](https://nodejs.org) installieren (einmalig).
2. Doppelklick auf **`start.bat`**.
   - Beim ersten Start werden fehlende npm-Pakete automatisch installiert.
   - Danach startet der Server auf **Port 3003**.
3. Im Browser öffnen: **http://localhost:3003**

Das Konsolenfenster bitte geöffnet lassen – zum Beenden `Strg+C` drücken
oder das Fenster schließen.

## Start ohne start.bat (Mac/Linux oder manuell)

```bash
npm install     # nur beim ersten Mal
npm start       # oder:  node server.js
```

## Zugriff vom Handy / Tablet (gleiches WLAN)

Der Server läuft auf `0.0.0.0`, ist also auch im lokalen Netzwerk erreichbar.
Beim Start zeigt die Konsole die passende Adresse an, z.B.:

```
   Im WLAN (Handy/Tablet, gleiches Netzwerk):
                 http://192.168.1.42:3003
```

Diese Adresse am Handy im Browser öffnen (PC und Handy müssen im selben WLAN sein).
Ggf. muss die Windows-Firewall den Zugriff für Node.js erlauben.

---

## Technik

| Bereich      | Verwendung                           |
|--------------|--------------------------------------|
| Backend      | Node.js + Express                    |
| Datenbank    | SQLite (`better-sqlite3`)            |
| Frontend     | HTML, CSS, Vanilla JavaScript        |
| Port         | 3003 (Host `0.0.0.0`)                |

- Ist **Port 3003 bereits belegt**, zeigt der Server eine verständliche
  Fehlermeldung an.
- Die Datenbank (`db/learn.db`) wird beim ersten Start **automatisch erstellt**.

## Projektstruktur

```
Debian-Installation/
├── server.js            # Express-Server (Port 3003, Port-Check, API)
├── db.js                # SQLite: Schema, Inhalts-Sync, Fortschritt
├── data/content.js      # ALLE Lerninhalte (Karten, Quiz, Zusammenfassungen)
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── start.bat            # Windows-Starter (npm install + Server)
├── package.json
└── db/learn.db          # wird automatisch erzeugt (Lernfortschritt)
```

---

## Inhalte ergänzen oder ändern

Alle Lerninhalte stehen zentral in **`data/content.js`**.

- **Neue Karte/Frage:** mit einer **neuen, eindeutigen `id`** ergänzen.
- **Text ändern:** einfach im jeweiligen Eintrag anpassen.

Beim nächsten Serverstart aktualisiert sich die Datenbank automatisch:

- Neue Inhalte werden eingefügt, geänderte aktualisiert.
- **Der bestehende Lernfortschritt bleibt erhalten** – er ist an die
  stabilen IDs gebunden, nicht an die Reihenfolge.

Jeder Eintrag hat ein Feld `source`:

- `pdf` – prüfungsrelevanter Inhalt direkt aus dem PDF
- `zusatz` – ergänzende Erklärung (in der App als „Zusatz" gekennzeichnet)

---

## Themenbereiche

1. Debian Installation & Installationsablauf
2. Installationsmenü & Advanced Options
3. Root-Account & Benutzerverwaltung
4. Server-Dienste & Systemzeit (NTP)
5. Partitionierung, Swap & Dateisysteme
6. SW-RAID, LVM & verschlüsselte Laufwerke
7. APT-Paketmanager & wichtige Befehle
8. Bootloader (GRUB)
9. Software-Repositories & Paketquellen
