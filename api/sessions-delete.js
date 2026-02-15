const { supabase } = require('../lib/supabase.js');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionIds } = req.body;

    if (!sessionIds || !Array.isArray(sessionIds) || sessionIds.length === 0) {
      return res.status(400).json({ error: 'Session IDs fehlen oder ungültig' });
    }

    // Sessions löschen (Prüflinge werden durch CASCADE automatisch gelöscht)
    const { error } = await supabase
      .from('exam_sessions')
      .delete()
      .in('id', sessionIds);

    if (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Fehler beim Löschen', details: error.message });
    }

    res.status(200).json({
      success: true,
      deleted: sessionIds.length
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}

module.exports = handler;
