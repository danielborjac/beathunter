export async function fetchLeaderboard(mode, time_range = 'daily') {
  const response = await fetch(`http://localhost:3000/api/cache?mode=${mode}&time_range=${time_range}`);
  if (!response.ok) {
    throw new Error('Error al obtener el leaderboard');
  }
  const data = await response.json();
  return data;
}