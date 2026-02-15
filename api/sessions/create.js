const { supabase } = require('../../lib/supabase.js');

async function handler(req, res) {
  // Nur POST erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { exam_type, datum, pruefer, protokollant, fachpruefungsleitung, prueflings } = req.body;

    // Validierung
    if (!exam_type || !datum || !pruefer || !protokollant || !fachpruefungsleitung || !prueflings || prueflings.length === 0) {
      return res.status(400).json({ error: 'Fehlende Pflichtfelder' });
    }

    // 1. Session erstellen
    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .insert({
        exam_type,
        datum,
        pruefer,
        protokollant,
        fachpruefungsleitung
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return res.status(500).json({ error: 'Fehler beim Erstellen der Session', details: sessionError.message });
    }

    // 2. Prüflinge erstellen
    const prueflingRecords = prueflings.map(name => ({
      session_id: session.id,
      name,
      selections: {},
      completed: false
    }));

    const { error: prueflingsError } = await supabase
      .from('prueflings')
      .insert(prueflingRecords);

    if (prueflingsError) {
      console.error('Prueflings error:', prueflingsError);
      return res.status(500).json({ error: 'Fehler beim Erstellen der Prüflinge', details: prueflingsError.message });
    }

    // Erfolg
    res.status(200).json({
      success: true,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}

module.exports = handler;
