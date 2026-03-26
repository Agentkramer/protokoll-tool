const { supabase } = require('../lib/supabase.js');

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sessionId, datum, pruefer, protokollant, fachpruefungsleitung } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: 'sessionId fehlt' });
    }

    // Nur Felder aktualisieren, die übergeben wurden
    const updates = {};
    if (datum !== undefined)                updates.datum                = datum;
    if (pruefer !== undefined)              updates.pruefer              = pruefer;
    if (protokollant !== undefined)         updates.protokollant         = protokollant;
    if (fachpruefungsleitung !== undefined) updates.fachpruefungsleitung = fachpruefungsleitung;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Keine Felder zum Aktualisieren übergeben' });
    }

    try {
        const { error } = await supabase
            .from('exam_sessions')
            .update(updates)
            .eq('id', sessionId);

        if (error) throw error;

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('sessions-update Fehler:', error);
        return res.status(500).json({ error: 'Interner Server-Fehler', details: error.message });
    }
}

module.exports = handler;
