const sanitizeTitle= (title) => {
  return title
    .replace(/\s*[\(\[].*?[\)\]]\s*/g, '')  // Elimina paréntesis o corchetes y su contenido
    .replace(/\s*-\s*(remastered|version|live|edit|mono|stereo).*$/i, '') // Elimina " - remastered" u otras versiones
    .replace(/\s{2,}/g, ' ')                // Reemplaza espacios múltiples por uno
    .trim();                                // Elimina espacios al principio y al final
};


const shuffleArray = (array) => {
  return array
    .map((item) => ({ sort: Math.random(), value: item }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.value);
};

/**
 * Clasifica canciones según su "rank" para dificultad
 */
exports.classifyDifficulty = (tracks) => {
  const easy = tracks.filter(track => track.rank >= 500000);
  const medium = tracks.filter(track => track.rank < 500000);

  return { easy, medium };
};

/**
 * Genera 6 opciones de canciones incluyendo la correcta (track)
 */
exports.generateOptions = (correctTitle, optionsPool, options) => {
  const optionsSet = new Set();
  optionsSet.add(correctTitle);

  const candidates = shuffleArray(optionsPool.filter(title => title !== correctTitle));

  for (const title of candidates) {
    if (optionsSet.size >= options) break;
    optionsSet.add(title);
  }

  return shuffleArray([...optionsSet]);
};

exports.shuffleArray = shuffleArray;
exports.sanitizeTitle = sanitizeTitle;
