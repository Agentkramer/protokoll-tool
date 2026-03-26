const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const auth = require('./api/auth');
const generate = require('./api/generate');
const sessionsCreate = require('./api/sessions-create');
const sessionsGet = require('./api/sessions-get');
const sessionsComplete = require('./api/sessions-complete');
const sessionsActive = require('./api/sessions-active');
const sessionsCompleted = require('./api/sessions-completed');
const sessionsDelete = require('./api/sessions-delete');
const sessionsUpdate = require('./api/sessions-update');
const prueflingsUpdate = require('./api/prueflings-update');
const prueflingsCreate = require('./api/prueflings-create');

app.post('/api/auth', auth);
app.post('/api/generate', generate);
app.post('/api/sessions-create', sessionsCreate);
app.get('/api/sessions-get', sessionsGet);
app.post('/api/sessions-complete', sessionsComplete);
app.get('/api/sessions-active', sessionsActive);
app.get('/api/sessions-completed', sessionsCompleted);
app.post('/api/sessions-delete', sessionsDelete);
app.post('/api/sessions-update', sessionsUpdate);
app.post('/api/prueflings-update', prueflingsUpdate);
app.post('/api/prueflings-create', prueflingsCreate);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});