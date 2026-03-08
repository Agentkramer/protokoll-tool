const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API-Key nicht konfiguriert' });
  }

const { protokollText, examType } = req.body;
console.log('examType received:', examType);

  if (!protokollText) {
    return res.status(400).json({ error: 'Protokolltext erforderlich' });
  }

  try {
    let prompt;

    if (examType === 'sportspiele') {
      prompt = `Du bist Protokollant bei einer Sportspiele-Prüfung. Deine Aufgabe ist es, die folgenden Textbausteine in einen Fließtext umzuformen.

STRIKTE REGELN:
1. Der Input ist in genau drei Teile gegliedert. Jeder Teil beginnt mit einer Zeile wie "Teil 1: ...", "Teil 2: ...", "Teil 3: ..."
2. Übernimm diese Überschriften EXAKT so wie sie im Input stehen - ändere sie nicht, erfinde keine neuen
3. Schreibe für jeden Teil einen zusammenhängenden Absatz aus den Textbausteinen dieses Teils
4. Verwende NUR die Inhalte aus dem jeweiligen Teil - vermische die Teile NICHT
5. Erfinde KEINE zusätzlichen Kategorien, Bewertungskriterien oder Inhalte die nicht im Input stehen
6. KEINE Tanz-Begriffe (Improvisation, Gestaltung, Musikalität, Ausdruck, Pflichtteil, Wahlpflichtteil)
7. Keine Markdown-Formatierung (keine **, keine ###, keine ---)

FORMAT DER AUSGABE:
[Überschrift Teil 1 exakt aus Input]

[Fließtext für Teil 1]

[Überschrift Teil 2 exakt aus Input]

[Fließtext für Teil 2]

[Überschrift Teil 3 exakt aus Input]

[Fließtext für Teil 3]

Textbausteine:
${protokollText}

Schreibe jetzt den Protokolltext. Halte dich strikt an die drei Teile und ihre Überschriften aus dem Input.`;

    } else {
      // Standard: Tanz
      prompt = `Du bist Protokollant bei einer Tanzprüfung. Erstelle einen professionellen Fließtext aus den folgenden Textbausteinen.

STRUKTUR:
- Der Input enthält zwei Prüfungsteile: PFLICHTTEIL und WAHLPFLICHTTEIL
- Behalte diese Zwischenüberschriften bei
- Jeder Teil enthält 5 Kategorien (Improvisation, Gestaltung, Technik, Musikalität, Ausdruck)
- Gliedere JEDEN TEIL in 5 Absätze (einer pro Kategorie)
- KEINE Kategorienamen als Überschriften - nur die Prüfungsteil-Überschriften
- KEINE Markdown-Formatierung (keine **, keine ###)

FORMULIERUNG:
- Nutze die Textbausteine als inhaltliche Grundlage
- Passe die Grammatik an, damit die Sätze korrekt und fließend sind (z.B. Nominalisierungen, Verbformen, Artikel)
- Verbinde mehrere Aspekte einer Kategorie zu zusammenhängenden Sätzen
- Vermeide Aufzählungen - formuliere in ganzen, natürlichen Sätzen
- WICHTIG: Erfinde keine Bewertungen oder Details, die nicht in den Bausteinen enthalten sind

FORMAT:
- Nur reiner Text, keine Formatierungen
- Prüfungsteil-Überschriften: === PFLICHTTEIL === und === WAHLPFLICHTTEIL ===
- Absätze durch Leerzeilen trennen
- Keine **, keine #, keine Markdown-Syntax

Textbausteine (nach Kategorien geordnet):
${protokollText}

Erstelle daraus einen grammatikalisch korrekten, gut strukturierten Protokolltext in Absatzform mit den beiden Prüfungsteil-Überschriften.`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API-Fehler');
    }

    const data = await response.json();
    const fliesstext = data.content[0].text;

    return res.status(200).json({ 
      success: true, 
      text: fliesstext 
    });

  } catch (error) {
    console.error('Generate error:', error);
    return res.status(500).json({ 
      error: 'Fehler bei der Textgenerierung', 
      details: error.message 
    });
  }
};
