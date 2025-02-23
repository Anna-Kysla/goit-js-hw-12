import axios from 'axios';

const API_KEY = '48875390-cd749f18f58e0c0fd72bc8c02';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

export async function fetchImages(query, page = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: PER_PAGE,
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
