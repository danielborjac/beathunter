export async function fetchDeezerRandomSongs(state, limit, options) {
  try {
    const body = {
      "type": state.type,
      //"limit": state.limit,
      "limit": limit,
      "playlists": state.playlists,
      "genreId": state.genreId,
      "artistId": state.artistId,
      "options": options
    }
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deezer/category`, {
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

export async function fetchDeezerDailySongs(total_options) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deezer/daily?number=${total_options}`);

    if (!res.ok) throw new Error('Error al obtener canciones desde Deezer');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error en fetchDeezerRandomSongs:', error);
    throw error;
  }
}
