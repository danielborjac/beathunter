const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const songRoutes = require('./routes/song.routes');
const authRoutes = require('./routes/auth.routes');
const gameSessionRoutes = require('./routes/gameSession.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', songRoutes);
app.use('/auth', authRoutes);
app.use('/api', gameSessionRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('📡 Conexión con base de datos exitosa.');
    app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });