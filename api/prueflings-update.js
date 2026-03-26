const { supabase } = require('../lib/supabase.js');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prueflingId, selections, aiText, name } = req.body;

    if (!prueflingId) {
      return res.status(400).json({ error: 'Prüfling ID fehlt' });
    }

    // Update-Objekt bauen (nur übergebene Felder)
    const updateData = {};

    if (selections !== undefined) updateData.selections = selections;
    if (aiText !== undefined)     updateData.ai_text    = aiText;
    if (name !== undefined)       updateData.name       = name;

    const { data, error } = await supabase
      .from('prueflings')
      .update(updateData)
      .eq('id', prueflingId)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Fehler beim Speichern', details: error.message });
    }

    res.status(200).json({ success: true, pruefling: data });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
  }
}

module.exports = handler;
