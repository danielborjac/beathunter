export async function saveGameSession(sessionData, token) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/game-sessions`, {
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

export async function getGameSessionDailyAttempt(token) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/game-sessions-daily-attempt`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });
    if (!res.ok) throw new Error('Error al revisar partida jugada');
    return await res.json();
  } catch (err) {
    console.error('Error al enviar la sesión de juego:', err);
    throw err;
  }
}