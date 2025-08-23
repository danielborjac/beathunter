const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/dashboard`;

export async function getUsers(token) {
  const res = await fetch(`${API_BASE}/users`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error fetching users');
  return res.json();
}

export async function countUsers(token) {
  const res = await fetch(`${API_BASE}/countUsers`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error fetching users');
  return res.json();
}

export async function createUser(payload, token) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error' }));
    throw new Error(err.error || 'Error creating user');
  }
  return res.json();
}

export async function updateUser(id, payload, token) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error' }));
    throw new Error(err.error || 'Error updating user');
  }
  return res.json();
}

export async function deleteUser(id, token) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error' }));
    throw new Error(err.error || 'Error deleting user');
  }
  return res.json();
}

export async function searchUsers(query, token) {
  if (!query || query.length < 1) return [];
  const res = await fetch(`${API_BASE}/searchUsers?search=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error searching users');
  return res.json();
}