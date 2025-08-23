const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/dashboard`;

export async function getDailySongs(token) {
  const res = await fetch(`${API_BASE}/daily`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`  },
  });
  if (!res.ok) throw new Error('Error fetching daily songs');
  return res.json();
}

export async function createDailySong(payload, token) {
  const res = await fetch(`${API_BASE}/daily`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`  },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({ error: 'Error' }));
    throw new Error(err.error || 'Error creating daily song');
  }
  return res.json();
}

export async function updateDailySong(id, payload, token) {
  const res = await fetch(`${API_BASE}/daily/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`  },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({ error: 'Error' }));
    throw new Error(err.error || 'Error updating daily song');
  }
  return res.json();
}

export async function deleteDailySong(id, token) {
  const res = await fetch(`${API_BASE}/daily/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({ error: 'Error' }));
    throw new Error(err.error || 'Error deleting daily song');
  }
  return res.json();
}

// Buscar canciones (endpoint: /api/dashboard/songs?search=...)
export async function searchSongs(query) {
  if (!query || query.length < 1) return [];
  const res = await fetch(`${API_BASE}/songs?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Error searching songs');
  return res.json();
}
