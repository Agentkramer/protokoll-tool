const { supabase } = require('../../lib/supabase.js');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sessions mit Anzahl der Prüflinge laden
    const { data: sessions, error } = await supabase
      .from('exam_sessions')
      .select(`
        *,
        pruefling_count:prueflings(count)
      `)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Completed sessions error:', error);
      return res.status(500).json({ error: 'Fehler beim Laden', details: error.message });
    }

    // Anzahl der Prüflinge formatieren
    const formattedSessions = sessions.map(session => ({
      ...session,
      pruefling_count: session.pruefling_count[0]?.count || 0
    }));

    res.status(200).json({
      success: true,
      sessions: formattedSessions
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}

module.exports = handler;
