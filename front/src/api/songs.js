export async function fetchRandomSongs(limit = 6) {
  try {
    const res = await fetch(`http://localhost:3000/api/songs/random?limit=${limit}`);
    if (!res.ok) throw new Error('Error al obtener canciones');
    const data = await res.json();

    const allTitles = data.map(song => song.title);
    const songsWithOptions = data.map(song => {
      const incorrect = allTitles
        .filter(t => t !== song.title)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      const allOptions = [...incorrect, song.title].sort(() => 0.5 - Math.random());
      return { ...song, options: allOptions };
    });

    return songsWithOptions;
  } catch (error) {
    console.error('Error en fetchRandomSongs:', error);
    throw error;
  }
}