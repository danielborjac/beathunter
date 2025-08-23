const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/dashboard`;

export async function getParamsByMode(mode) {
  const res = await fetch(`${API_BASE}/params?mode=${encodeURIComponent(mode)}`);
  if (!res.ok) throw new Error('Error fetching params');
  return res.json();
}

export async function updateParams(id, payload, token) {
  const res = await fetch(`${API_BASE}/params/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error' }));
    throw new Error(err.error || 'Error updating params');
  }
  return res.json();
}
