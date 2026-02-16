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

  const { protokollText } = req.body;

  if (!protokollText) {
    return res.status(400).json({ error: 'Protokolltext erforderlich' });
  }

  try {
const prompt = `Du bist Protokollant bei einer Tanzprüfung. Erstelle einen professionellen Fließtext aus den folgenden Textbausteinen.

STRUKTUR:
- Gliedere den Text in 5 Absätze (einer pro Kategorie)
- Jeder Absatz behandelt eine Bewertungskategorie zusammenhängend
- KEINE Überschriften, keine Kategorienamen, keine Markdown-Formatierung
- KEINE einleitende Gesamtüberschrift

FORMULIERUNG:
- Nutze die Textbausteine als inhaltliche Grundlage
- Passe die Grammatik an, damit die Sätze korrekt und flüssig sind (z.B. Nominalisierungen, Verbformen, Artikel)
- Verbinde mehrere Aspekte einer Kategorie zu zusammenhängenden Sätzen
- Vermeide Aufzählungen - formuliere in ganzen, natürlichen Sätzen
- WICHTIG: Erfinde keine Bewertungen oder Details, die nicht in den Bausteinen enthalten sind

ABSCHLUSS:
- Füge nach den 5 Absätzen einen kurzen, wertenden Gesamteindruck hinzu (basierend auf den genannten Aspekten)

FORMAT:
- Nur reiner Text, keine Formatierungen
- Absätze durch Leerzeilen trennen
- Keine **, keine #, keine Markdown-Syntax

Textbausteine (nach Kategorien geordnet):
${protokollText}

Erstelle daraus einen grammatikalisch korrekten, gut strukturierten Protokolltext in Absatzform.`;

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
