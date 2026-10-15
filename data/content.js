/*
 * content.js – Einzige Quelle der Wahrheit für alle Lerninhalte.
 *
 * Grundlage: PDF "Debian Linux – Debian Installation"
 * (Landesberufsschule Pöchlarn).
 *
 * WICHTIG:
 *  - Jede Karteikarte und Quizfrage besitzt eine STABILE ID.
 *    Diese ID darf nicht mehr verändert werden, da der Lernfortschritt
 *    daran gebunden ist. Texte dürfen geändert werden – die DB aktualisiert
 *    sich dann automatisch, der Lernfortschritt bleibt erhalten.
 *  - Neue Inhalte: einfach mit NEUER, eindeutiger ID ergänzen.
 *  - "source" unterscheidet prüfungsrelevante PDF-Inhalte ("pdf") von
 *    ergänzenden Erklärungen ("zusatz").
 *
 * Themen (topics):
 *   1 installation – Debian Installation und Installationsablauf
 *   2 menu         – Installationsmenü und Advanced Options
 *   3 users        – Root-Account und Benutzerverwaltung
 *   4 services     – Server-Dienste und Systemzeit (NTP)
 *   5 partitions   – Partitionierung, Swap und Dateisysteme
 *   6 raid         – RAID, LVM und Verschlüsselung
 *   7 apt          – APT-Paketmanager und wichtige Befehle
 *   8 bootloader   – Bootloader (GRUB)
 *   9 repos        – Software-Repositories und Paketquellen
 */

const topics = [
  { id: 'installation', title: 'Installation & Ablauf',      icon: '💿', description: 'Debian Installation und Installationsablauf' },
  { id: 'menu',         title: 'Installationsmenü',           icon: '🧭', description: 'Installationsmenü und Advanced Options' },
  { id: 'users',        title: 'Root & Benutzer',            icon: '👤', description: 'Root-Account und Benutzerverwaltung' },
  { id: 'services',     title: 'Dienste & Systemzeit',        icon: '🕒', description: 'Server-Dienste und Systemzeit (NTP)' },
  { id: 'partitions',   title: 'Partitionen & Dateisysteme',  icon: '🗂️', description: 'Partitionierung, Swap und Dateisysteme' },
  { id: 'raid',         title: 'RAID, LVM & Verschlüsselung',  icon: '🔐', description: 'SW-RAID, LVM und verschlüsselte Laufwerke' },
  { id: 'apt',          title: 'APT-Paketmanager',            icon: '📦', description: 'APT-Paketmanager und wichtige Befehle' },
  { id: 'bootloader',   title: 'Bootloader (GRUB)',           icon: '🚀', description: 'Bootloader (GRUB)' },
  { id: 'repos',        title: 'Repositories & Paketquellen',  icon: '🌐', description: 'Software-Repositories und Paketquellen' },
];

/* ------------------------------------------------------------------ */
/*  KARTEIKARTEN                                                        */
/* ------------------------------------------------------------------ */
const cards = [
  /* --- 1. Installation & Ablauf --- */
  { id: 'c-inst-01', topic: 'installation', source: 'pdf',
    question: 'Welche Punkte müssen während der rudimentär geführten Debian-Installation erledigt werden?',
    answer: 'Länderauswahl, Sprachauswahl, Tastaturlayout, zu installierende Server-Dienste, Netzwerkeinstellungen, Benutzer anlegen, root-Kennwort festlegen, Software-Repository, Partitionierung, Boot-Loader und Desktop-Manager auswählen.' },
  { id: 'c-inst-02', topic: 'installation', source: 'pdf',
    question: 'Welche Einträge enthält das Debian Installations-Menü (BIOS mode)?',
    answer: 'Graphical install, Install, Advanced options, Accessible dark contrast installer menu, Help und Install with speech synthesis.' },
  { id: 'c-inst-03', topic: 'installation', source: 'pdf',
    question: 'Was bedeutet "rudimentär geführte Installation"?',
    answer: 'Eine einfache, schrittweise geführte Standard-Installation, bei der die wichtigsten Einstellungen nacheinander abgefragt werden. Debian lässt sich dadurch sehr einfach installieren.' },

  /* --- 2. Installationsmenü & Advanced Options --- */
  { id: 'c-menu-01', topic: 'menu', source: 'pdf',
    question: 'Was macht "Graphical Install" und in welchem Runlevel startet Debian danach?',
    answer: 'Grafisch geführte Installation. Nach Abschluss startet Debian im Runlevel 5 (Multiuser, Netzwerk, GUI). Die grafische Installation benötigt ca. 800 MB mehr Speicher im RAM.' },
  { id: 'c-menu-02', topic: 'menu', source: 'pdf',
    question: 'Was ist der Unterschied zwischen "Graphical Install" und "Install" (Runlevel 3)?',
    answer: 'Im Hintergrund passiert dasselbe. Bei "Install" (Runlevel 3) steht aber mehr Speicher zur Verfügung, da die GUI nicht geladen werden muss.' },
  { id: 'c-menu-03', topic: 'menu', source: 'pdf',
    question: 'Wie viel mehr Arbeitsspeicher benötigt die grafische Installation ungefähr?',
    answer: 'Ca. 800 MB mehr Speicher im RAM.' },
  { id: 'c-menu-04', topic: 'menu', source: 'pdf',
    question: 'Welche Optionen bietet "Advanced options"?',
    answer: 'Graphical expert install, Graphical rescue mode, Graphical automated install, Expert install, Rescue mode, Automated install und Speech-enabled advanced options.' },
  { id: 'c-menu-05', topic: 'menu', source: 'pdf',
    question: 'Wozu dient der "Rescue mode" / "Graphical Rescue mode"?',
    answer: 'Er versucht, eine bestehende Debian-Installation zu reparieren – vorausgesetzt, die Partition wird noch gefunden.' },
  { id: 'c-menu-06', topic: 'menu', source: 'pdf',
    question: 'Was ermöglicht der "Expert Install" / "Graphical Expert Install"?',
    answer: 'Eine Installation mit zusätzlichen, detaillierten Konfigurationsschritten (z.B. Choose language, Configure the keyboard, Detect and mount CD-ROM, Change debconf priority, Execute a shell).' },

  /* --- 3. Root & Benutzer --- */
  { id: 'c-user-01', topic: 'users', source: 'pdf',
    question: 'Warum wird während der Installation zusätzlich zum root-Account ein normaler Benutzer angelegt?',
    answer: 'Um zu verhindern, dass das alltägliche Arbeiten mit dem root-Account durchgeführt wird. Auch für diesen Benutzer wird ein Kennwort vergeben, das der Kennwortkomplexität entspricht.' },
  { id: 'c-user-02', topic: 'users', source: 'pdf',
    question: 'Welche Anforderung muss das root- bzw. Benutzer-Kennwort erfüllen?',
    answer: 'Es muss der Kennwortkomplexität entsprechen (ein starkes Passwort sein).' },
  { id: 'c-user-03', topic: 'users', source: 'pdf',
    question: 'Warum muss das root-Kennwort sicher verwahrt werden?',
    answer: 'Ohne den root-Account ist keine Systemadministration möglich.' },
  { id: 'c-user-04', topic: 'users', source: 'pdf',
    question: 'Was kann man tun, wenn das root-Kennwort verloren geht?',
    answer: 'Sofern man physikalischen Zugang zum Server hat, kann das root-Kennwort zurückgesetzt werden.' },
  { id: 'c-user-05', topic: 'users', source: 'pdf',
    question: 'Was wird empfohlen, statt ständig als root zu arbeiten?',
    answer: 'Einen Benutzer mit root-Rechten und starkem Kennwort anlegen, der zur Systemadministration verwendet wird.' },

  /* --- 4. Dienste & Systemzeit (NTP) --- */
  { id: 'c-srv-01', topic: 'services', source: 'pdf',
    question: 'Welche Server-Dienste kann man bereits während der Installation auswählen?',
    answer: 'z.B. SSH-Server, Webserver, Fileserver, Mailserver. Die Dienste können auch nachträglich nach Bedarf installiert werden.' },
  { id: 'c-srv-02', topic: 'services', source: 'pdf',
    question: 'Wofür steht NTP?',
    answer: 'Network Time Protocol – es dient dem Abgleich der Systemzeit mit einem Zeitserver.' },
  { id: 'c-srv-03', topic: 'services', source: 'pdf',
    question: 'Wann wird die Systemzeit während der Installation abgeglichen?',
    answer: 'Sofern der Rechner auf das Internet zugreifen kann, wird die Systemzeit mit einem NTP-Server abgeglichen.' },
  { id: 'c-srv-04', topic: 'services', source: 'pdf',
    question: 'Welches Paket sorgt dafür, dass nach einem Neustart die Systemzeit mit einem NTP-Server synchronisiert wird?',
    answer: 'Das Paket ntpdate. Es genügt bei Rechnern, die regelmäßig neu gestartet werden.' },
  { id: 'c-srv-05', topic: 'services', source: 'pdf',
    question: 'Warum sollte bei einem 24/7-Server die Systemzeit regelmäßig abgeglichen werden?',
    answer: 'Läuft der Rechner als Server durchgehend (24/7), sollte in regelmäßigen Abständen die Systemzeit mit einem NTP-Server abgeglichen werden, damit sie nicht abweicht.' },

  /* --- 5. Partitionen & Dateisysteme --- */
  { id: 'c-part-01', topic: 'partitions', source: 'pdf',
    question: 'Welche drei Partitionen werden im PDF genannt und wofür sind sie?',
    answer: '/ (root) – ca. +100 GB (Labor-VM 40 GB); home – für die Home-Verzeichnisse der User und Freigaben; Swap – Auslagerungsdatei.' },
  { id: 'c-part-02', topic: 'partitions', source: 'pdf',
    question: 'Wie groß soll die Swap-Partition sein?',
    answer: 'Doppelt so groß wie der RAM.' },
  { id: 'c-part-03', topic: 'partitions', source: 'pdf',
    question: 'Was enthält die /home-Partition?',
    answer: 'Die Home-Verzeichnisse der User und Freigaben.' },
  { id: 'c-part-04', topic: 'partitions', source: 'pdf',
    question: 'Welche Partitionierungs-Schemas bietet der Installer an?',
    answer: '„All files in one partition" (empfohlen für neue Benutzer), „Separate home partition" und „Separate home, /var and /tmp partitions".' },
  { id: 'c-part-05', topic: 'partitions', source: 'pdf',
    question: 'Was kennzeichnet ein Einzelplatzsystem bei der Partitionierung?',
    answer: 'Eine Partition, Swap separat.' },
  { id: 'c-part-06', topic: 'partitions', source: 'pdf',
    question: 'Wie wird ein Fileserver partitioniert?',
    answer: 'home und system getrennt, Swap separat.' },
  { id: 'c-part-07', topic: 'partitions', source: 'pdf',
    question: 'Warum trennt man bei Mehrnutzersystemen auch /tmp und /var ab?',
    answer: 'Vorteilhaft, da ein Benutzer den Server dann nicht überlastet, z.B. durch viele Log-Einträge.' },
  { id: 'c-part-08', topic: 'partitions', source: 'pdf',
    question: 'Was war ReiserFS?',
    answer: 'Das erste Linux-Filesystem mit Journaling-Funktion. Es liegt aktuell in Version 4 vor und hat mit dem ursprünglichen ReiserFS nicht mehr viel zu tun.' },
  { id: 'c-part-09', topic: 'partitions', source: 'pdf',
    question: 'Was bewirkt Journaling?',
    answer: 'Es sorgt dafür, dass Metadaten nicht mehr korrumpiert werden können. Dadurch kann nach einem Rechnerabsturz auf den kompletten Durchlauf der Integritätsprüfung verzichtet werden.' },
  { id: 'c-part-10', topic: 'partitions', source: 'pdf',
    question: 'Wofür steht Ext3 und ab wann war es verfügbar?',
    answer: 'Ext3 = drittes erweitertes Dateisystem (third extended filesystem). Verfügbar ab Linux Kernel 2.4.15.' },
  { id: 'c-part-11', topic: 'partitions', source: 'pdf',
    question: 'Welche Datei- und Dateisystemgrößen erlaubt Ext3?',
    answer: 'Individuelle Dateigröße zwischen 16 GB und 2 TB; Gesamtgröße des Dateisystems zwischen 2 TB und 32 TB.' },
  { id: 'c-part-12', topic: 'partitions', source: 'pdf',
    question: 'Welche Vorteile bietet Ext4 gegenüber Ext3?',
    answer: 'Dateigröße bis 16 TB, Dateisystem bis 1 EB (1024 PB), schnellerer Dateisystemcheck, Journaling deaktivierbar (gut für SSD), fast unbegrenzte Unterordner-Anzahl.' },
  { id: 'c-part-13', topic: 'partitions', source: 'pdf',
    question: 'Wie lang dürfen Dateiname und Pfad bei Ext4 maximal sein?',
    answer: 'Max. Dateiname 255 Bytes, max. Pfadlänge 4096 Bytes.' },
  { id: 'c-part-14', topic: 'partitions', source: 'pdf',
    question: 'Wofür steht Ext4?',
    answer: 'Viertes "extended filesystem" (fourth extended filesystem).' },

  /* --- 6. RAID, LVM & Verschlüsselung --- */
  { id: 'c-raid-01', topic: 'raid', source: 'pdf',
    question: 'Welche drei erweiterten Speicheroptionen nennt das PDF?',
    answer: 'Software-RAID (SW-RAID), Logical Volume Manager (LVM) und verschlüsselte Festplatten.' },
  { id: 'c-raid-02', topic: 'raid', source: 'pdf',
    question: 'Was bietet der Logical Volume Manager (LVM)?',
    answer: 'Die Möglichkeit, Partitionen über mehrere Festplatten zu erstellen.' },
  { id: 'c-raid-03', topic: 'raid', source: 'pdf',
    question: 'Was sollte bei verschlüsselten Festplatten zusätzlich verschlüsselt werden und warum?',
    answer: 'Auch der SWAP sollte verschlüsselt werden – wegen des Ruhezustands (dabei wird der Speicherinhalt auf die Platte geschrieben).' },
  { id: 'c-raid-04', topic: 'raid', source: 'zusatz',
    question: 'Was ist Software-RAID (im Unterschied zu Hardware-RAID)?',
    answer: 'Ein RAID-Verbund, der per Software (vom Betriebssystem) verwaltet wird, ohne dedizierten Hardware-RAID-Controller.' },

  /* --- 7. APT-Paketmanager --- */
  { id: 'c-apt-01', topic: 'apt', source: 'pdf',
    question: 'Was macht der Befehl apt-get update?',
    answer: 'Einlesen der Paketlisten aus den Repositories.' },
  { id: 'c-apt-02', topic: 'apt', source: 'pdf',
    question: 'Was macht der Befehl apt-get install "Paketname"?',
    answer: 'Pakete installieren.' },
  { id: 'c-apt-03', topic: 'apt', source: 'pdf',
    question: 'Was macht der Befehl apt-get remove "Paketname"?',
    answer: 'Pakete deinstallieren (die Konfigurationsdateien bleiben erhalten).' },
  { id: 'c-apt-04', topic: 'apt', source: 'pdf',
    question: 'Was macht der Befehl apt-get purge "Paketname"?',
    answer: 'Pakete deinstallieren inkl. Konfigurationsfiles. (Im PDF steht der Tippfehler "puge" – korrekt ist purge.)' },
  { id: 'c-apt-05', topic: 'apt', source: 'pdf',
    question: 'Was macht der Befehl apt-get upgrade?',
    answer: 'Pakete aktualisieren.' },
  { id: 'c-apt-06', topic: 'apt', source: 'pdf',
    question: 'Was ist der Unterschied zwischen apt-get remove und apt-get purge?',
    answer: 'remove entfernt nur das Paket, purge entfernt zusätzlich die Konfigurationsdateien.' },
  { id: 'c-apt-07', topic: 'apt', source: 'pdf',
    question: 'Von welchen Quellen können bei der Installation Programmpakete installiert werden?',
    answer: 'Von der DVD (bei DVD-Installation automatisch Standardquelle) oder von einer Onlinequelle, z.B. einem ftp-Server (z.B. der TU Wien).' },

  /* --- 8. Bootloader (GRUB) --- */
  { id: 'c-boot-01', topic: 'bootloader', source: 'pdf',
    question: 'Was ist die Aufgabe des Boot-Loaders?',
    answer: 'Er ist das erste vom BIOS gestartete Programm, lädt den Linux-Kernel in den Speicher und führt ihn dann aus.' },
  { id: 'c-boot-02', topic: 'bootloader', source: 'pdf',
    question: 'Was ermöglicht das Menü des Boot-Loaders?',
    answer: 'Es ermöglicht dem Nutzer, den zu ladenden Kernel oder das zu startende Betriebssystem auszuwählen.' },
  { id: 'c-boot-03', topic: 'bootloader', source: 'pdf',
    question: 'Welche zwei Boot-Loader werden genannt und welcher ist Standard bei Debian?',
    answer: 'GRUB und LILO. GRUB ist der Standard-Boot-Loader von Debian.' },

  /* --- 9. Repositories & Paketquellen --- */
  { id: 'c-repo-01', topic: 'repos', source: 'pdf',
    question: 'Was ist ein Software-Repository?',
    answer: 'Ein Depot, in dem Software-Pakete hinterlegt sind.' },
  { id: 'c-repo-02', topic: 'repos', source: 'pdf',
    question: 'In welche Datei trägt Debian die Paketquellen ein?',
    answer: '/etc/apt/sources.list (wird z.B. bei der DVD-Installation automatisch erzeugt).' },
  { id: 'c-repo-03', topic: 'repos', source: 'pdf',
    question: 'Welche Quellen (Quelltypen) sind für ein Repository möglich?',
    answer: 'cdrom/DVD-ROM, http, ftp und file (Verzeichnis).' },
  { id: 'c-repo-04', topic: 'repos', source: 'pdf',
    question: 'Welche drei Komponenten werden in den deb-Zeilen der sources.list angegeben?',
    answer: 'main, contrib und non-free.' },
  { id: 'c-repo-05', topic: 'repos', source: 'pdf',
    question: 'Was bewirkt der Befehl apt edit-sources (ab Version Jessie)?',
    answer: 'Er dient zum Editieren der sources.list. Beim Verlassen der Datei wird die Syntax überprüft.' },
  { id: 'c-repo-06', topic: 'repos', source: 'pdf',
    question: 'Was ist der Unterschied zwischen "stable" und der Angabe eines Codenamens (z.B. bullseye) in der sources.list?',
    answer: 'Mit dem Codenamen bleibt man beim jeweiligen Release. "stable" wandert hingegen automatisch mit, sobald ein neues Release veröffentlicht wird.' },
  { id: 'c-repo-07', topic: 'repos', source: 'pdf',
    question: 'Welche Release-Zweige können als Updatequelle angegeben werden?',
    answer: 'stable, testing und unstable – oder statt stable der Codename des Releases.' },
  { id: 'c-repo-08', topic: 'repos', source: 'zusatz',
    question: 'Was bedeutet eine Zeile mit "deb-src" in der sources.list?',
    answer: 'Sie definiert eine Quelle für die Quellcode-Pakete (Source-Pakete) statt der fertigen binären Pakete.' },
];

/* ------------------------------------------------------------------ */
/*  QUIZFRAGEN  (options: genau eine richtige Antwort, correct = Index) */
/* ------------------------------------------------------------------ */
const quiz = [
  /* --- Installation & Ablauf --- */
  { id: 'q-inst-01', topic: 'installation', source: 'pdf',
    question: 'Welche Einträge gehören zum Debian Installations-Menü (BIOS mode)?',
    options: ['Graphical install, Install, Advanced options, Help', 'Nur Install', 'Setup, Reparieren, Beenden', 'Quick, Normal, Custom'],
    correct: 0,
    explanation: 'Das Menü enthält u.a. Graphical install, Install, Advanced options, Accessible dark contrast installer menu, Help und Install with speech synthesis.' },
  { id: 'q-inst-02', topic: 'installation', source: 'pdf',
    question: 'Was wird während der Installation u.a. festgelegt?',
    options: ['Nur die Sprache', 'Länderauswahl, Tastaturlayout, Partitionierung, Boot-Loader u.v.m.', 'Nur das root-Kennwort', 'Nur die Bildschirmauflösung'],
    correct: 1,
    explanation: 'Zu erledigen sind u.a. Länder-/Sprachauswahl, Tastaturlayout, Server-Dienste, Netzwerk, Benutzer, root-Kennwort, Repository, Partitionierung, Boot-Loader und Desktop-Manager.' },

  /* --- Installationsmenü --- */
  { id: 'q-menu-01', topic: 'menu', source: 'pdf',
    question: 'In welchem Runlevel startet Debian nach der "Graphical Install"?',
    options: ['Runlevel 1', 'Runlevel 3', 'Runlevel 5', 'Runlevel 0'],
    correct: 2,
    explanation: 'Nach der grafischen Installation startet Debian im Runlevel 5 (Multiuser, Netzwerk, GUI).' },
  { id: 'q-menu-02', topic: 'menu', source: 'pdf',
    question: 'Wie viel mehr RAM benötigt die grafische Installation ungefähr?',
    options: ['ca. 80 MB', 'ca. 800 MB', 'ca. 2 GB', 'ca. 8 GB'],
    correct: 1,
    explanation: 'Die grafische Installation benötigt ca. 800 MB mehr Speicher im RAM.' },
  { id: 'q-menu-03', topic: 'menu', source: 'pdf',
    question: 'Was ist der Vorteil der Variante "Install" (Runlevel 3) gegenüber "Graphical Install"?',
    options: ['Schnellere Grafik', 'Mehr Speicher verfügbar, da keine GUI geladen wird', 'Automatische Partitionierung', 'Bessere Treiber'],
    correct: 1,
    explanation: 'Im Hintergrund passiert dasselbe, aber ohne GUI steht mehr Speicher zur Verfügung.' },
  { id: 'q-menu-04', topic: 'menu', source: 'pdf',
    question: 'Wozu dient der "Rescue mode"?',
    options: ['Eine neue Installation starten', 'Eine bestehende Debian-Installation reparieren', 'Die Festplatte formatieren', 'Ein Backup erstellen'],
    correct: 1,
    explanation: 'Der Rescue mode versucht, eine bestehende Debian-Installation zu reparieren, sofern die Partition noch gefunden wird.' },
  { id: 'q-menu-05', topic: 'menu', source: 'pdf',
    question: 'Welche Option gehört zu den "Advanced options"?',
    options: ['Quick install', 'Graphical expert install', 'Live install', 'Standard install'],
    correct: 1,
    explanation: 'Zu den Advanced options zählen u.a. Graphical expert install, Rescue mode, Automated install und Expert install.' },

  /* --- Root & Benutzer --- */
  { id: 'q-user-01', topic: 'users', source: 'pdf',
    question: 'Warum wird neben root ein normaler Benutzer angelegt?',
    options: ['Um mehr Speicher zu haben', 'Damit die alltägliche Arbeit nicht als root durchgeführt wird', 'Weil root kein Passwort hat', 'Um die GUI zu starten'],
    correct: 1,
    explanation: 'So wird verhindert, dass das alltägliche Arbeiten mit dem root-Account erfolgt.' },
  { id: 'q-user-02', topic: 'users', source: 'pdf',
    question: 'Welche Anforderung muss das root-Kennwort erfüllen?',
    options: ['Es muss leer sein', 'Es muss der Kennwortkomplexität entsprechen', 'Es muss genau 4 Zeichen haben', 'Es darf nur Zahlen enthalten'],
    correct: 1,
    explanation: 'Das Kennwort muss der Kennwortkomplexität entsprechen (starkes Passwort).' },
  { id: 'q-user-03', topic: 'users', source: 'pdf',
    question: 'Was ist möglich, wenn das root-Kennwort verloren geht und man physikalischen Zugang hat?',
    options: ['Nichts, das System ist verloren', 'Das root-Kennwort zurücksetzen', 'Debian neu kaufen', 'Den Account automatisch wiederherstellen lassen'],
    correct: 1,
    explanation: 'Mit physikalischem Zugang zum Server kann das root-Kennwort zurückgesetzt werden.' },
  { id: 'q-user-04', topic: 'users', source: 'pdf',
    question: 'Warum ist der root-Account so wichtig?',
    options: ['Ohne ihn ist keine Systemadministration möglich', 'Er startet die GUI', 'Er verwaltet die Systemzeit', 'Er ist der Webserver'],
    correct: 0,
    explanation: 'Ohne den root-Account ist keine Systemadministration möglich – daher das Kennwort sicher verwahren.' },

  /* --- Dienste & Systemzeit --- */
  { id: 'q-srv-01', topic: 'services', source: 'pdf',
    question: 'Wofür steht NTP?',
    options: ['New Time Protocol', 'Network Time Protocol', 'Network Transfer Protocol', 'Node Time Process'],
    correct: 1,
    explanation: 'NTP = Network Time Protocol, dient dem Abgleich der Systemzeit.' },
  { id: 'q-srv-02', topic: 'services', source: 'pdf',
    question: 'Welches Paket synchronisiert nach einem Neustart die Systemzeit mit einem NTP-Server?',
    options: ['chronyd', 'ntpdate', 'timesync', 'systemd-time'],
    correct: 1,
    explanation: 'Das Paket ntpdate sorgt dafür, dass nach einem Neustart die Zeit mit einem NTP-Server synchronisiert wird.' },
  { id: 'q-srv-03', topic: 'services', source: 'pdf',
    question: 'Welche Dienste können bereits während der Installation installiert werden?',
    options: ['Nur SSH', 'SSH-Server, Webserver, Fileserver, Mailserver', 'Nur Webserver', 'Keine Dienste'],
    correct: 1,
    explanation: 'Z.B. SSH-Server, Webserver, Fileserver und Mailserver – nachträglich ist das ebenfalls möglich.' },
  { id: 'q-srv-04', topic: 'services', source: 'pdf',
    question: 'Wann wird die Systemzeit während der Installation per NTP abgeglichen?',
    options: ['Immer', 'Wenn der Rechner auf das Internet zugreifen kann', 'Nie', 'Nur im Expert-Modus'],
    correct: 1,
    explanation: 'Der Abgleich erfolgt, sofern der Rechner auf das Internet zugreifen kann.' },

  /* --- Partitionen & Dateisysteme --- */
  { id: 'q-part-01', topic: 'partitions', source: 'pdf',
    question: 'Wie groß soll die Swap-Partition laut PDF sein?',
    options: ['Gleich groß wie der RAM', 'Doppelt so groß wie der RAM', 'Halb so groß wie der RAM', 'Immer 100 GB'],
    correct: 1,
    explanation: 'Die Swap-Partition soll doppelt so groß wie der RAM sein.' },
  { id: 'q-part-02', topic: 'partitions', source: 'pdf',
    question: 'Was enthält die /home-Partition?',
    options: ['Den Kernel', 'Die Home-Verzeichnisse der User und Freigaben', 'Die Auslagerungsdatei', 'Die Paketlisten'],
    correct: 1,
    explanation: '/home enthält die Home-Verzeichnisse der User und Freigaben.' },
  { id: 'q-part-03', topic: 'partitions', source: 'pdf',
    question: 'Welches Partitionsschema wird für neue Benutzer empfohlen?',
    options: ['Separate home-Partition', 'Alle Dateien in einer Partition', 'Separate home, var und tmp', 'Gar keine Partition'],
    correct: 1,
    explanation: '"All files in one partition" ist für neue Benutzer empfohlen.' },
  { id: 'q-part-04', topic: 'partitions', source: 'pdf',
    question: 'Warum trennt man bei Mehrnutzersystemen auch /tmp und /var ab?',
    options: ['Für mehr Geschwindigkeit', 'Damit ein Benutzer den Server nicht überlastet (z.B. durch viele Log-Einträge)', 'Weil es für die GUI nötig ist', 'Weil es gesetzlich Pflicht ist'],
    correct: 1,
    explanation: 'Getrennte /tmp- und /var-Partitionen verhindern, dass ein Benutzer den Server überlastet, z.B. durch viele Log-Einträge.' },
  { id: 'q-part-05', topic: 'partitions', source: 'pdf',
    question: 'Was war die Besonderheit von ReiserFS?',
    options: ['Erstes Linux-Filesystem mit Journaling', 'Erstes Windows-Filesystem', 'Schnellster Bootloader', 'Erstes verschlüsseltes Dateisystem'],
    correct: 0,
    explanation: 'ReiserFS war das erste Linux-Filesystem mit Journaling-Funktion.' },
  { id: 'q-part-06', topic: 'partitions', source: 'pdf',
    question: 'Was bewirkt Journaling?',
    options: ['Es verschlüsselt die Daten', 'Metadaten werden nicht korrumpiert; Integritätsprüfung nach Absturz entfällt', 'Es beschleunigt die GUI', 'Es erstellt automatische Backups'],
    correct: 1,
    explanation: 'Journaling verhindert korrumpierte Metadaten – der komplette Integritätscheck nach einem Absturz entfällt.' },
  { id: 'q-part-07', topic: 'partitions', source: 'pdf',
    question: 'Ab welchem Linux-Kernel war Ext3 verfügbar?',
    options: ['2.2.0', '2.4.15', '2.6.0', '3.0.0'],
    correct: 1,
    explanation: 'Ext3 war ab Linux Kernel 2.4.15 verfügbar.' },
  { id: 'q-part-08', topic: 'partitions', source: 'pdf',
    question: 'Wie groß kann eine einzelne Datei unter Ext4 maximal sein?',
    options: ['2 TB', '16 TB', '32 TB', '1 EB'],
    correct: 1,
    explanation: 'Unter Ext4 kann eine einzelne Datei bis zu 16 TB groß sein.' },
  { id: 'q-part-09', topic: 'partitions', source: 'pdf',
    question: 'Wie groß kann das gesamte Ext4-Dateisystem maximal werden?',
    options: ['32 TB', '2 TB', '1 EB (1024 PB)', '16 TB'],
    correct: 2,
    explanation: 'Die Gesamtgröße eines Ext4-Dateisystems kann bis zu 1 EB (1024 PB) betragen.' },
  { id: 'q-part-10', topic: 'partitions', source: 'pdf',
    question: 'Wie lang darf ein Dateiname unter Ext4 maximal sein?',
    options: ['128 Bytes', '255 Bytes', '512 Bytes', '4096 Bytes'],
    correct: 1,
    explanation: 'Der Dateiname darf unter Ext4 max. 255 Bytes lang sein.' },
  { id: 'q-part-11', topic: 'partitions', source: 'pdf',
    question: 'Wie lang darf die Pfadlänge unter Ext4 maximal sein?',
    options: ['255 Bytes', '1024 Bytes', '4096 Bytes', '2048 Bytes'],
    correct: 2,
    explanation: 'Die maximale Pfadlänge unter Ext4 beträgt 4096 Bytes.' },
  { id: 'q-part-12', topic: 'partitions', source: 'pdf',
    question: 'Welche Dateisystem-Gesamtgröße erlaubt Ext3?',
    options: ['Zwischen 2 TB und 32 TB', 'Bis 1 EB', 'Maximal 16 TB', 'Unbegrenzt'],
    correct: 0,
    explanation: 'Bei Ext3 liegt die Gesamtgröße des Dateisystems zwischen 2 TB und 32 TB.' },

  /* --- RAID, LVM & Verschlüsselung --- */
  { id: 'q-raid-01', topic: 'raid', source: 'pdf',
    question: 'Was ermöglicht der Logical Volume Manager (LVM)?',
    options: ['Dateien zu verschlüsseln', 'Partitionen über mehrere Festplatten zu erstellen', 'Den Bootloader zu ersetzen', 'Die Systemzeit zu setzen'],
    correct: 1,
    explanation: 'LVM bietet die Möglichkeit, Partitionen über mehrere Festplatten zu erstellen.' },
  { id: 'q-raid-02', topic: 'raid', source: 'pdf',
    question: 'Warum sollte auch der SWAP verschlüsselt werden?',
    options: ['Für mehr Geschwindigkeit', 'Wegen des Ruhezustands (Speicherinhalt wird auf die Platte geschrieben)', 'Damit er größer wird', 'Das ist technisch nicht möglich'],
    correct: 1,
    explanation: 'Beim Ruhezustand wird der Speicherinhalt auf die Platte (SWAP) geschrieben – daher sollte auch SWAP verschlüsselt werden.' },
  { id: 'q-raid-03', topic: 'raid', source: 'pdf',
    question: 'Welche drei erweiterten Speicheroptionen nennt das PDF?',
    options: ['SW-RAID, LVM und verschlüsselte Festplatten', 'NTFS, FAT und exFAT', 'GRUB, LILO und systemd', 'DVD, USB und Netzwerk'],
    correct: 0,
    explanation: 'Genannt werden Software-RAID, Logical Volume Manager (LVM) und verschlüsselte Festplatten.' },

  /* --- APT --- */
  { id: 'q-apt-01', topic: 'apt', source: 'pdf',
    question: 'Welcher Befehl liest die Paketlisten aus den Repositories ein?',
    options: ['apt-get install', 'apt-get update', 'apt-get upgrade', 'apt-get remove'],
    correct: 1,
    explanation: 'apt-get update liest die Paketlisten aus den Repositories ein.' },
  { id: 'q-apt-02', topic: 'apt', source: 'pdf',
    question: 'Welcher Befehl entfernt ein Paket inklusive der Konfigurationsdateien?',
    options: ['apt-get remove', 'apt-get purge', 'apt-get clean', 'apt-get delete'],
    correct: 1,
    explanation: 'apt-get purge entfernt das Paket inkl. Konfigurationsfiles.' },
  { id: 'q-apt-03', topic: 'apt', source: 'pdf',
    question: 'Welcher Befehl aktualisiert bereits installierte Pakete?',
    options: ['apt-get update', 'apt-get upgrade', 'apt-get install', 'apt-get refresh'],
    correct: 1,
    explanation: 'apt-get upgrade aktualisiert die installierten Pakete.' },
  { id: 'q-apt-04', topic: 'apt', source: 'pdf',
    question: 'Was ist der Unterschied zwischen apt-get remove und apt-get purge?',
    options: ['Kein Unterschied', 'purge entfernt zusätzlich die Konfigurationsdateien', 'remove entfernt mehr Dateien', 'purge installiert das Paket neu'],
    correct: 1,
    explanation: 'purge entfernt im Gegensatz zu remove auch die Konfigurationsdateien.' },
  { id: 'q-apt-05', topic: 'apt', source: 'pdf',
    question: 'Welche Paketquelle wird bei einer DVD-Installation automatisch ausgewählt?',
    options: ['Ein ftp-Server', 'Die DVD', 'Ein http-Mirror', 'Das lokale Dateisystem'],
    correct: 1,
    explanation: 'Wird von DVD installiert, wird automatisch die DVD als Standardquelle gewählt; alternativ eine Onlinequelle (z.B. ftp).' },

  /* --- Bootloader --- */
  { id: 'q-boot-01', topic: 'bootloader', source: 'pdf',
    question: 'Welcher ist der Standard-Boot-Loader von Debian?',
    options: ['LILO', 'GRUB', 'systemd-boot', 'NTLDR'],
    correct: 1,
    explanation: 'GRUB ist der Standard-Boot-Loader von Debian (Alternative wäre LILO).' },
  { id: 'q-boot-02', topic: 'bootloader', source: 'pdf',
    question: 'Welche Aufgabe hat der Boot-Loader?',
    options: ['Er verwaltet die Benutzer', 'Er lädt den Linux-Kernel in den Speicher und führt ihn aus', 'Er synchronisiert die Zeit', 'Er installiert Pakete'],
    correct: 1,
    explanation: 'Der Boot-Loader lädt den Linux-Kernel in den Speicher und führt ihn aus.' },
  { id: 'q-boot-03', topic: 'bootloader', source: 'pdf',
    question: 'Was ist der Boot-Loader im Startvorgang?',
    options: ['Das letzte Programm', 'Das erste vom BIOS gestartete Programm', 'Ein Dienst im Runlevel 5', 'Ein Teil des Kernels'],
    correct: 1,
    explanation: 'Der Boot-Loader ist das erste vom BIOS gestartete Programm.' },

  /* --- Repositories --- */
  { id: 'q-repo-01', topic: 'repos', source: 'pdf',
    question: 'In welche Datei trägt Debian die Paketquellen ein?',
    options: ['/etc/sources', '/etc/apt/sources.list', '/etc/repositories', '/var/apt/list'],
    correct: 1,
    explanation: 'Die Paketquellen stehen in /etc/apt/sources.list.' },
  { id: 'q-repo-02', topic: 'repos', source: 'pdf',
    question: 'Welche Quelle ist laut PDF KEINE gültige Repository-Quelle?',
    options: ['http', 'ftp', 'cdrom/DVD-ROM', 'smb'],
    correct: 3,
    explanation: 'Mögliche Quellen sind cdrom/DVD-ROM, http, ftp und file (Verzeichnis) – smb gehört nicht dazu.' },
  { id: 'q-repo-03', topic: 'repos', source: 'pdf',
    question: 'Was bewirkt die Angabe des Codenamens (z.B. bullseye) statt "stable"?',
    options: ['Man bekommt immer das neueste Release', 'Man bleibt beim jeweiligen Release', 'Die Installation wird schneller', 'Es werden keine Security-Updates geladen'],
    correct: 1,
    explanation: 'Mit dem Codenamen bleibt man am jeweiligen Release; "stable" wandert beim neuen Release automatisch mit.' },
  { id: 'q-repo-04', topic: 'repos', source: 'pdf',
    question: 'Welche drei Komponenten stehen typischerweise in einer deb-Zeile?',
    options: ['main, extra, free', 'main, contrib, non-free', 'stable, testing, unstable', 'deb, src, http'],
    correct: 1,
    explanation: 'In den deb-Zeilen stehen die Komponenten main, contrib und non-free.' },
  { id: 'q-repo-05', topic: 'repos', source: 'pdf',
    question: 'Welcher Befehl dient ab Jessie zum Editieren der sources.list mit Syntaxprüfung?',
    options: ['nano sources.list', 'apt edit-sources', 'apt-get edit', 'vi /etc/apt'],
    correct: 1,
    explanation: 'apt edit-sources editiert die sources.list und prüft beim Verlassen die Syntax.' },
  { id: 'q-repo-06', topic: 'repos', source: 'pdf',
    question: 'Welche Release-Zweige kann man als Updatequelle angeben?',
    options: ['stable, testing, unstable', 'alpha, beta, final', 'main, contrib, non-free', 'gold, silver, bronze'],
    correct: 0,
    explanation: 'Man kann stable, testing und unstable angeben (oder statt stable den Codenamen).' },
];

/* ------------------------------------------------------------------ */
/*  ZUSAMMENFASSUNGEN  (html = einfache, prüfungstaugliche Erklärung)   */
/* ------------------------------------------------------------------ */
const summaries = [
  { id: 's-installation', topic: 'installation', title: 'Debian Installation & Installationsablauf',
    html: `
<p>Debian lässt sich mittlerweile sehr einfach installieren. Während der <strong>rudimentär geführten Installation</strong> (einfache, schrittweise Führung) sind einige Punkte zu erledigen:</p>
<ul>
  <li>Länderauswahl, Sprachauswahl, <strong>Tastaturlayout</strong></li>
  <li>zu installierende <strong>Server-Dienste</strong> und Netzwerkeinstellungen</li>
  <li><strong>Benutzer</strong> anlegen und <strong>root-Kennwort</strong> festlegen</li>
  <li><strong>Software-Repository</strong>, <strong>Partitionierung</strong>, <strong>Boot-Loader</strong> und Desktop-Manager auswählen</li>
</ul>
<p>Das Debian Installations-Menü (BIOS mode) enthält:</p>
<ul>
  <li><strong>Graphical install</strong></li>
  <li><strong>Install</strong></li>
  <li><strong>Advanced options</strong></li>
  <li>Accessible dark contrast installer menu</li>
  <li>Help</li>
  <li>Install with speech synthesis</li>
</ul>` },

  { id: 's-menu', topic: 'menu', title: 'Installationsmenü & Advanced Options',
    html: `
<p><strong>Graphical Install:</strong> rudimentär geführte, grafische Installation. Nach Abschluss startet Debian im <strong>Runlevel 5</strong> (Multiuser, Netzwerk, GUI). Benötigt ca. <strong>800 MB mehr RAM</strong>.</p>
<p><strong>Install (Runlevel 3, "target"):</strong> Im Hintergrund passiert dasselbe wie bei der grafischen Installation, es steht aber mehr Speicher zur Verfügung, da die <strong>GUI nicht geladen</strong> werden muss.</p>
<p><strong>Advanced options</strong> bietet zusätzliche Optionen:</p>
<ul>
  <li>Graphical expert install / <strong>Expert install</strong> – detaillierte Konfigurationsschritte</li>
  <li><strong>Graphical rescue mode / Rescue mode</strong> – repariert eine bestehende Debian-Installation (sofern die Partition noch gefunden wird)</li>
  <li>Graphical automated install / <strong>Automated install</strong></li>
  <li>Speech-enabled advanced options</li>
</ul>` },

  { id: 's-users', topic: 'users', title: 'Root-Account & Benutzerverwaltung',
    html: `
<p><strong>root-Account:</strong> Beim Festlegen des Root-Kennworts unbedingt ein Kennwort verwenden, das der <strong>Kennwortkomplexität</strong> entspricht. Das Kennwort sicher verwahren, da ohne diesen Account <strong>keine Systemadministration</strong> möglich ist.</p>
<p>Geht das Root-Kennwort verloren, kann es – bei <strong>physikalischem Zugang</strong> zum Server – zurückgesetzt werden.</p>
<p><strong>Benutzer anlegen:</strong> Während der Installation wird zusätzlich zum root-Account ein normaler Benutzer angelegt (ebenfalls mit komplexem Kennwort). Sinn: Das <strong>alltägliche Arbeiten soll nicht mit dem root-Account</strong> erfolgen.</p>
<p>Empfehlung: einen Benutzer mit <strong>root-Rechten</strong> und starkem Kennwort anlegen, der zur Systemadministration verwendet wird.</p>` },

  { id: 's-services', topic: 'services', title: 'Server-Dienste & Systemzeit (NTP)',
    html: `
<p><strong>Server-Dienste:</strong> Schon während der Installation kann man Dienste auswählen und installieren, z.B.:</p>
<ul>
  <li><strong>ssh-server</strong>, <strong>Webserver</strong>, <strong>Fileserver</strong>, <strong>Mailserver</strong> …</li>
</ul>
<p>Die Dienste können auch <strong>nachträglich</strong> nach Bedarf installiert werden.</p>
<p><strong>Systemzeit – NTP (Network Time Protocol):</strong> Sofern der Rechner auf das Internet zugreifen kann, wird die Systemzeit während der Installation mit einem <strong>NTP-Server</strong> abgeglichen.</p>
<ul>
  <li>Wird der Rechner regelmäßig neu gestartet, genügt das Paket <code>ntpdate</code> – es synchronisiert die Zeit nach jedem Neustart.</li>
  <li>Läuft der Rechner als Server <strong>24/7</strong> durch, sollte die Zeit in regelmäßigen Abständen mit einem NTP-Server abgeglichen werden.</li>
</ul>` },

  { id: 's-partitions', topic: 'partitions', title: 'Partitionierung, Swap & Dateisysteme',
    html: `
<p>Während der Installation müssen die <strong>Partitionsgrößen</strong> festgelegt werden:</p>
<ul>
  <li><strong>/</strong> (root) – ca. +100 GB (Labor-VM 40 GB)</li>
  <li><strong>home</strong> – Home-Verzeichnisse der User und Freigaben</li>
  <li><strong>Swap</strong> – Auslagerungsdatei, <strong>doppelt so groß wie der RAM</strong></li>
</ul>
<p><strong>Partitionierungs-Schemas:</strong></p>
<ul>
  <li><strong>Einzelplatzsystem</strong> – eine Partition, Swap separat (empfohlen für neue Benutzer)</li>
  <li><strong>Fileserver</strong> – home und system getrennt, Swap separat</li>
  <li><strong>Mehrnutzersysteme</strong> – zusätzlich /tmp und /var separat, damit ein Benutzer den Server nicht überlastet (z.B. durch viele Log-Einträge)</li>
</ul>
<p><strong>Journaling</strong> sorgt dafür, dass Metadaten nicht korrumpiert werden – nach einem Absturz entfällt der komplette Integritätscheck.</p>
<p><strong>Dateisysteme:</strong></p>
<ul>
  <li><strong>ReiserFS</strong> – erstes Linux-Filesystem mit Journaling (aktuell Version 4).</li>
  <li><strong>Ext3</strong> (third extended fs, ab Kernel 2.4.15): Datei 16 GB–2 TB, Dateisystem 2 TB–32 TB.</li>
  <li><strong>Ext4</strong> (fourth extended fs): Datei bis 16 TB, Dateisystem bis 1 EB (1024 PB), schnellerer Check, Journaling deaktivierbar (SSD). Max. Dateiname 255 Bytes, max. Pfadlänge 4096 Bytes.</li>
</ul>` },

  { id: 's-raid', topic: 'raid', title: 'SW-RAID, LVM & verschlüsselte Laufwerke',
    html: `
<p>Debian bietet bei der Partitionierung erweiterte Optionen:</p>
<ul>
  <li><strong>Software-RAID (SW-RAID)</strong> – RAID-Verbund per Software.</li>
  <li><strong>Logical Volume Manager (LVM)</strong> – bietet die Möglichkeit, Partitionen <strong>über mehrere Festplatten</strong> zu erstellen.</li>
  <li><strong>Verschlüsselte Festplatten</strong> – auch der <strong>SWAP</strong> sollte verschlüsselt werden (wegen „Ruhezustand", da dabei der Speicherinhalt auf die Platte geschrieben wird).</li>
</ul>` },

  { id: 's-apt', topic: 'apt', title: 'APT-Paketmanager & wichtige Befehle',
    html: `
<p>Bei der Installation wählt man, von welcher <strong>Quelle</strong> Programmpakete installiert werden. Bei DVD-Installation ist die <strong>DVD</strong> die Standardquelle; alternativ eine Onlinequelle (z.B. ftp-Server der TU Wien).</p>
<p>Wichtige <strong>apt-Befehle</strong>:</p>
<pre><code>apt-get update              # Paketlisten aus den Repositories einlesen
apt-get install "Paketname" # Pakete installieren
apt-get remove "Paketname"  # Pakete deinstallieren
apt-get purge "Paketname"   # deinstallieren inkl. Konfigurationsfiles
apt-get upgrade             # Pakete aktualisieren</code></pre>
<p><em>Hinweis: Im PDF steht der Tippfehler „puge" – korrekt ist <strong>purge</strong>.</em></p>` },

  { id: 's-bootloader', topic: 'bootloader', title: 'Bootloader (GRUB)',
    html: `
<p>Der <strong>Boot-Loader</strong> ist das <strong>erste vom BIOS gestartete Programm</strong>. Er lädt den <strong>Linux-Kernel</strong> in den Speicher und führt ihn dann aus.</p>
<p>Häufig bietet er ein <strong>Menü</strong> an, das es ermöglicht, den zu ladenden Kernel oder das zu startende Betriebssystem auszuwählen.</p>
<p><strong>GRUB oder LILO?</strong> – <strong>GRUB</strong> ist der Standard-Boot-Loader von Debian.</p>` },

  { id: 's-repos', topic: 'repos', title: 'Software-Repositories & Paketquellen',
    html: `
<p>Ein <strong>Software-Repository</strong> ist ein Depot, in dem Software-Pakete hinterlegt sind. Bei der DVD-Installation erzeugt Debian einen Eintrag in der Datei <code>/etc/apt/sources.list</code>.</p>
<p><strong>Mögliche Quellen:</strong> cdrom/DVD-ROM, http, ftp, file (Verzeichnis).</p>
<p>Beispiel einer sources.list (stable + Security-Updates):</p>
<pre><code>deb     http://ftp.de.debian.org/debian/   stable          main contrib non-free
deb-src http://ftp.de.debian.org/debian/   stable          main contrib non-free
deb     http://security.debian.org/        stable/updates  main contrib non-free
deb-src http://security.debian.org/        stable/updates  main contrib non-free</code></pre>
<p>Statt <strong>stable</strong> kann auch der <strong>Codename</strong> des Releases angegeben werden (z.B. <code>bullseye</code>). Mit dem Codenamen <strong>bleibt man am Release</strong>; „stable" wandert beim nächsten Release automatisch mit.</p>
<p>Ab Version <strong>Jessie</strong> editiert man die Datei mit:</p>
<pre><code>apt edit-sources    # prüft beim Verlassen die Syntax der sources.list</code></pre>
<p>Es können auch <strong>unstable</strong>- und <strong>testing</strong>-Updatequellen angegeben werden.</p>` },
];

module.exports = { topics, cards, quiz, summaries };
