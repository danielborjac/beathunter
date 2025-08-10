/*export async function fetchDeezerRandomSongs(limit = 6) {
  try {
    const res = await fetch(`http://localhost:3000/api/deezer/random?limit=${limit}`);
    if (!res.ok) throw new Error('Error al obtener canciones desde Deezer');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error en fetchDeezerRandomSongs:', error);
    throw error;
  }
}*/

export async function fetchDeezerRandomSongs(state) {
  try {
    const body = {
      "type": state.type,
      "limit": state.limit,
      "playlists": state.playlists,
      "genreId": state.genreId,
      "artistId": state.artistId,
    }
    const res = await fetch(`http://localhost:3000/api/deezer/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error('Error al obtener canciones desde Deezer');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error en fetchDeezerRandomSongs:', error);
    throw error;
  }
}

export async function fetchDeezerDailySongs() {
  try {
    const res = await fetch(`http://localhost:3000/api/deezer/daily`);

    if (!res.ok) throw new Error('Error al obtener canciones desde Deezer');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error en fetchDeezerRandomSongs:', error);
    throw error;
  }
}
