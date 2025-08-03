const express = require('express');
const router = express.Router();

const videoIds = [
  '3JZ4pnNtyxQ', // Fleur East
  '_c1w056MItU', // linkin park
  'iIGOgM5Oi2U', // Imagine Dragon
  'xwsYvBYZcx4', // John Legend
  'Lk0sZwXTwnc', // sunflower
  'TUVcZfQe-Kw', // Dua Lipa
  'rYEDA3JcQqw', // Adele
  'nYh-n7EOtMA', // Shawn Mendes
];

router.get('/', (req, res) => {
  const shuffled = videoIds.sort(() => 0.5 - Math.random());
  res.json(shuffled.slice(0, 6));
});

module.exports = router;