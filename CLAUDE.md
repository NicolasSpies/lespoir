# Steckbrief: L'Espoir

Dieses Repo nutzt den Skill `laconis-frontend` aus dem Plugin `laconis`. Seine Regeln gelten. Hier steht nur, was für dieses Projekt anders oder besonders ist.

## Projekt

- Domain: lespoir.laconis.be; Ziel asbl-espoir.be, noch nicht auf dem VPS
- Technik: Astro SSR
- Sprachen: fr
- Branch: `main`

## ContentCore

- Mandant: offen (Host lespoir.contentcore.app)
- CC-Modus: Live (abgeleitet am 20.11.2026: Kundin pflegt Inhalte in CC, Seite öffentlich; Test nur bei reiner Vorschau ohne Kundendomain, im Zweifel Live). Keine Testdaten, Formulare nie absenden.
- API-Adresse: aus `.env` (Wert nicht hier eintragen)

## Ausrollen

- Weg: `bash deploy/deploy-vps.sh` vom Mac
- Live-Branch: `main`
- Chat darf: pushen und ausrollen (Skript ruft pm2 als `ccsites` auf; abgeleitet am 20.11.2026)
- Zielordner auf dem VPS: `/var/www/lespoir`
- pm2-App: `lespoir`, Benutzer: `ccsites`, Port: 4325
- Installation: `npm install --omit=dev` im Zielordner

## Texte

- Anrede auf der Website: offen

## Besonderheiten

- Französische Typografie: geschütztes Leerzeichen vor Doppelpunkt.
- Altlast: feste Rückfälle im Code. Bleiben, bis das Projekt angefasst wird.
