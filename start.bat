@echo off
setlocal enabledelayedexpansion
title Debian Installation - Lerntrainer
cd /d "%~dp0"

echo.
echo ==========================================================
echo    Debian Installation - Lerntrainer wird gestartet...
echo ==========================================================
echo.

REM --- 1. Pruefen, ob Node.js installiert ist ---------------
where node >nul 2>nul
if errorlevel 1 (
    echo [FEHLER] Node.js wurde nicht gefunden.
    echo.
    echo Bitte zuerst Node.js installieren: https://nodejs.org
    echo Danach diese Datei erneut starten.
    echo.
    pause
    exit /b 1
)

for /f "delims=" %%v in ('node --version') do set NODEVER=%%v
echo Node.js erkannt: !NODEVER!
echo.

REM --- 2. Fehlende npm-Pakete beim ersten Start installieren -
if not exist "node_modules" (
    echo Erststart erkannt - installiere benoetigte Pakete...
    echo Das kann beim ersten Mal ein bis zwei Minuten dauern.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [FEHLER] "npm install" ist fehlgeschlagen.
        echo Pruefe deine Internetverbindung und starte erneut.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Pakete erfolgreich installiert.
    echo.
) else (
    echo Pakete bereits vorhanden - ueberspringe Installation.
    echo.
)

REM --- 3. Server starten ------------------------------------
echo Starte Server auf Port 3003...
echo Oeffne im Browser:  http://localhost:3003
echo.
echo (Dieses Fenster bitte geoeffnet lassen. Zum Beenden Strg+C.)
echo.

node server.js

REM --- 4. Fenster offen halten, falls der Server endet ------
echo.
echo Der Server wurde beendet.
pause
endlocal
