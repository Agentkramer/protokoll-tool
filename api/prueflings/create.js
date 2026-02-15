const { supabase } = require('../../lib/supabase.js');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, name } = req.body;

    if (!sessionId || !name) {
      return res.status(400).json({ error: 'Session ID und Name sind erforderlich' });
    }

    const { data, error } = await supabase
      .from('prueflings')
      .insert({
        session_id: sessionId,
        name: name.trim(),
        selections: {},
        completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Create error:', error);
      return res.status(500).json({ error: 'Fehler beim Erstellen', details: error.message });
    }

    res.status(200).json({
      success: true,
      pruefling: data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}

module.exports = handler;
