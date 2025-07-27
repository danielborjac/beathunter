export async function saveGameSession(sessionData, token) {
  try {
    const res = await fetch('http://localhost:3000/api/game-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(sessionData)
    });

    if (!res.ok) throw new Error('Error al guardar la partida');

    return await res.json();
  } catch (err) {
    console.error('Error al enviar la sesión de juego:', err);
    throw err;
  }
}