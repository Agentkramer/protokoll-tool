const { supabase } = require('../lib/supabase.js');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID fehlt' });
    }

    // 1. Session laden
    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return res.status(404).json({ error: 'Session nicht gefunden' });
    }

    // 2. Prüflinge laden
    const { data: prueflings, error: prueflingsError } = await supabase
      .from('prueflings')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (prueflingsError) {
      console.error('Prueflings error:', prueflingsError);
      return res.status(500).json({ error: 'Fehler beim Laden der Prüflinge' });
    }

    res.status(200).json({
      success: true,
      session,
      prueflings
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}

module.exports = handler;
