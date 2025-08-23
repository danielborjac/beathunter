const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/dashboard`;

export async function fetchPlaylists(search) {
  if (!search) return [];
  const res = await fetch(`${API_BASE}/playlists?search=${encodeURIComponent(search)}`);
  if (!res.ok) throw new Error('Error fetching playlists');
  return await res.json();
}

export async function fetchGenres() {
  const res = await fetch(`${API_BASE}/genres`);
  if (!res.ok) throw new Error('Error fetching genres');
  return await res.json();
}

export async function fetchArtists(search) {
  if (!search) return [];
  const res = await fetch(`${API_BASE}/artists?search=${encodeURIComponent(search)}`);
  if (!res.ok) throw new Error('Error fetching artists');
  return await res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Error fetching categories');
  const data = await res.json();

  const combined = [
    ...(data.genres || []),
    ...(data.mixes || []),
    ...(data.artists || []),
    ...(data.random || []),
  ];

  return combined;
}

export async function countCategories() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/countCategoriesByMode`);
  if (!res.ok) throw new Error('Error fetching categories');
  const data = await res.json();
  return data;
}

export async function createCategory(categoryData, token) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(categoryData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error creating category');
  }
  return await res.json();
}

export async function updateCategory(id, categoryData, token) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(categoryData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error updating category');
  }
  return await res.json();
}

export async function deleteCategory(id, token) {
  const res = await fetch(`${API_BASE}/categories/${id}`, { 
    method: 'DELETE', 
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error deleting category');
  }
  return true;
}