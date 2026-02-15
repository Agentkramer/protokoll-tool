Protokoll Tool

Professionelles Tool für die Erstellung von Prüfungsprotokollen mit KI-Unterstützung.

## ✨ Features

- ✅ Textbausteine-basierte Protokollerstellung
- ✅ Automatische Notenberechnung (1-6 → 0-15 Punkte)
- ✅ KI-generierte Fließtexte (Claude Sonnet 4)
- ✅ Passwortgeschützt
- ✅ Responsive Design (Desktop & iPad)
- ✅ 5 Bewertungskategorien mit je 6 Stufen

---

## 🚀 Schnell-Deployment auf Vercel

### Schritt 1: Repository zu GitHub pushen

```bash
# Im Projektordner:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Agentkramer/protokoll-tool.git
git push -u origin main
```

### Schritt 2: Vercel Account erstellen

1. Gehe zu https://vercel.com
2. Klicke **"Sign Up"**
3. Wähle **"Continue with GitHub"**
4. Autorisiere Vercel

### Schritt 3: Projekt deployen

1. In Vercel Dashboard: **"Add New Project"**
2. **"Import Git Repository"**
3. Wähle `protokoll-tool`
4. Klicke **"Import"**

### Schritt 4: Environment Variables konfigurieren

**WICHTIG:** Bevor du auf "Deploy" klickst, füge diese Environment Variables hinzu:

#### 4.1 Passwort-Hash generieren

Öffne https://bcrypt-generator.com oder verwende:

```bash
node -e "console.log(require('bcryptjs').hashSync('DEIN_PASSWORT', 10))"
```

#### 4.2 In Vercel eintragen:

```
Name: PASSWORD_HASH
Value: $2a$10$... (der generierte Hash)
```

```
Name: ANTHROPIC_API_KEY
Value: sk-ant-... (dein Anthropic API-Key)
```

### Schritt 5: Deploy!

Klicke **"Deploy"** und warte ca. 2 Minuten.

---

## 🔐 Passwort ändern

1. Generiere neuen Hash (siehe oben)
2. Vercel Dashboard → Dein Projekt → **Settings** → **Environment Variables**
3. Editiere `PASSWORD_HASH`
4. **Redeploy** (Deployments Tab → ... → Redeploy)

---

## 💻 Lokale Entwicklung

```bash
npm install
npm run dev
```

Erstelle `.env` Datei:

```
ANTHROPIC_API_KEY=sk-ant-...
PASSWORD_HASH=$2a$10$...
```

Öffne: http://localhost:3000

---

## 📱 Nutzung

### Login
- Öffne deine Vercel-URL (z.B. `protokoll-tool.vercel.app`)
- Gib das Team-Passwort ein

### Protokoll erstellen
1. Metadaten ausfüllen (Prüfling, Datum, etc.)
2. Kategorie wählen
3. Textbausteine anklicken (grün = ausgewählt)
4. Alle 5 Kategorien bewerten
5. **"✨ KI-Fließtext generieren"** klicken
6. Fertig!

---

## 🎯 Nächste Schritte

- [ ] PDF-Export implementieren
- [ ] Weitere Sportarten hinzufügen (Sportspiele, etc.)
- [ ] Individuelle Nutzer-Accounts
- [ ] Protokoll-Historie speichern

---

## 📞 Support

Bei Fragen oder Problemen: Einfach melden!

---

**Entwickelt mit ❤️ für effiziente Prüfungsprotokolle**
