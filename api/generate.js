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
    const prompt = `Du bist ein Experte für die Erstellung professioneller Prüfungsprotokolle im Bereich Tanz.

Ich habe folgende Textbausteine zu verschiedenen Bewertungskriterien ausgewählt:

${protokollText}

Bitte formuliere daraus ein professionelles, zusammenhängendes Prüfungsprotokoll in Fließtext-Form. 

Anforderungen:
- Schreibe einen kohärenten Text, der die ausgewählten Aspekte geschickt verbindet
- Nutze Übergänge zwischen den verschiedenen Kategorien
- Der Ton soll sachlich und professionell sein
- Behalte den Inhalt der Textbausteine bei, formuliere sie aber elegant um
- Beginne NICHT mit "Die Prüfung zeigte..." oder ähnlichen Floskeln, sondern steige direkt in die erste Kategorie ein
- Gliedere den Text in zusammenhängende Absätze (nicht nach Kategorien getrennt)
- Der Text sollte wie ein professionelles Gutachten wirken

Gib NUR den fertigen Fließtext aus, ohne Überschriften, ohne Einleitung, ohne Erklärungen.`;

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
