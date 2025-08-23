const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const songRoutes = require('./routes/song.routes');
const authRoutes = require('./routes/auth.routes');
const gameSessionRoutes = require('./routes/gameSession.routes');
const statisticsRoutes = require('./routes/statistics.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const videosRoutes = require('./routes/videos.routes');
const deezerRoutes = require('./routes/deezer.routes');
const categoryRoutes = require('./routes/category.routes');
const deezerSearchRoutes = require('./routes/deezerSearch.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const generalParamRoutes = require('./routes/generalParam.routes');


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api', songRoutes);
app.use('/api', authRoutes);
app.use('/api', gameSessionRoutes);
app.use('/api', statisticsRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api', categoryRoutes);
app.use('/api/deezer', deezerRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/videos', videosRoutes);
//dashboard
app.use('/api/dashboard', deezerSearchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard', generalParamRoutes);
const PORT = process.env.PORT || 3000

sequelize.authenticate()
  .then(() => {
    console.log('Conexión con base de datos exitosa.');
    app.listen(PORT, () => console.log('Servidor corriendo en http://localhost:3000'));
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });