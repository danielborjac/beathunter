import axios from 'axios';

export const fetchCategories = async (mode) => {
  try {
    let response;
    if (mode=="all") response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`);
    else response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories?mode=${mode}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    alert("hubo un error inesperado, volverás al inicio")
    window.location.href="/";
    return {
      genres: [],
      mixes: [],
      artists: [],
      random: [],
    };
  }
};