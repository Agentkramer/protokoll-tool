const bcrypt = require('bcryptjs');

// Passwort-Hash (wird in Vercel als Environment Variable gesetzt)
const PASSWORD_HASH = process.env.PASSWORD_HASH || '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; // default: "demo"

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Passwort erforderlich' });
  }

  try {
    const isValid = await bcrypt.compare(password, PASSWORD_HASH);
    
    if (isValid) {
      // Einfacher Token (in Produktion würdest du JWT verwenden)
      const token = Buffer.from(`${Date.now()}`).toString('base64');
      return res.status(200).json({ 
        success: true, 
        token,
        message: 'Erfolgreich eingeloggt' 
      });
    } else {
      return res.status(401).json({ error: 'Falsches Passwort' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Server-Fehler' });
  }
};
