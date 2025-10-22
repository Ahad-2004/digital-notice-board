require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initAdminFromEnv } = require('./adminInit');
const noticesRouter = require('./routes/notices');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin using env service account
initAdminFromEnv();

app.use('/api/notices', noticesRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => res.json({ ok: true, service: 'Digital Notice Board Backend' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
