const { supabase } = require('../lib/supabase.js');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID fehlt' });
    }

    const { data, error } = await supabase
      .from('exam_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Complete error:', error);
      return res.status(500).json({ error: 'Fehler beim Abschließen', details: error.message });
    }

    res.status(200).json({
      success: true,
      session: data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}

module.exports = handler;
