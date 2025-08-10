import axios from 'axios';

export const fetchCategories = async (mode) => {
  try {
    let response;
    if (mode=="all") response = await axios.get(`http://localhost:3000/api/categories`);
    else response = await axios.get(`http://localhost:3000/api/categories?mode=${mode}`);
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