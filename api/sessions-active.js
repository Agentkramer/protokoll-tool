const { supabase } = require('../../lib/supabase.js');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: sessions, error } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Active sessions error:', error);
      return res.status(500).json({ error: 'Fehler beim Laden', details: error.message });
    }

    res.status(200).json({
      success: true,
      sessions: sessions || []
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}

module.exports = handler;
