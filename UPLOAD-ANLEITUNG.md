# 📤 UPLOAD-ANLEITUNG

## So lädst du das Projekt zu GitHub hoch

### Option A: Via GitHub Website (Am einfachsten)

#### 1. Dateien herunterladen
- Lade `protokoll-tool-deploy.tar.gz` herunter
- Entpacke die Datei → Ordner `protokoll-tool-project`

#### 2. Zu GitHub hochladen
1. Gehe zu https://github.com/Agentkramer/protokoll-tool
2. Klicke **"Add file"** → **"Upload files"**
3. **Ziehe den ganzen `protokoll-tool-project` Ordner-Inhalt** in das Feld
   (Alle Dateien und Ordner: `api/`, `public/`, `package.json`, etc.)
4. Commit message: `Initial commit - Tanz-Protokoll Tool`
5. Klicke **"Commit changes"**

#### 3. Fertig! ✅
Das Projekt ist jetzt auf GitHub und bereit für Vercel.

---

### Option B: Via Terminal (Für Profis)

#### 1. Dateien vorbereiten
```bash
# Entpacken
tar -xzf protokoll-tool-deploy.tar.gz
cd protokoll-tool-project
```

#### 2. Git initialisieren und pushen
```bash
# Git initialisieren
git init
git add .
git commit -m "Initial commit - Tanz-Protokoll Tool"

# Mit GitHub verbinden
git branch -M main
git remote add origin https://github.com/Agentkramer/protokoll-tool.git

# Hochladen
git push -u origin main
```

#### 3. Fertig! ✅

---

## ⚠️ Wichtige Dateien die hochgeladen werden müssen:

```
✅ api/auth.js
✅ api/generate.js
✅ public/index.html (Login-Seite)
✅ public/app.html (Hauptanwendung)
✅ package.json
✅ vercel.json
✅ .env.example
✅ .gitignore
✅ README.md
```

**NICHT hochladen:**
- ❌ node_modules/ (wird von .gitignore ausgeschlossen)
- ❌ .env (enthält Secrets!)

---

## 🔜 Nächster Schritt

Sobald das Projekt auf GitHub ist:
→ Weiter mit **Vercel Deployment** (siehe README.md)

---

Bei Problemen: Einfach fragen! 🚀
