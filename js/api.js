// js/api.js - Axios API requests with async/await and local db.json fallback

const LOCAL_JSON_SERVER_URL = 'http://localhost:3000/bouquets';

export async function fetchBouquets({ page = 1, limit = 4, category = 'all', search = '' }) {
  try {
    // 1. Try local json-server if available
    try {
      const params = new URLSearchParams();
      params.append('_page', page);
      params.append('_limit', limit);
      if (category && category !== 'all') {
        params.append('category', category);
      }
      if (search && search.trim() !== '') {
        params.append('q', search.trim());
      }

      const response = await axios.get(`${LOCAL_JSON_SERVER_URL}?${params.toString()}`, { timeout: 1000 });
      const items = response.data;
      const totalCount = parseInt(response.headers['x-total-count'] || items.length, 10);
      return {
        items,
        total: totalCount,
        hasMore: page * limit < totalCount,
      };
    } catch (jsonServerErr) {
      // 2. Fallback to ./db.json for static server / GitHub Pages
      const response = await axios.get('./db.json');
      let allBouquets = response.data.bouquets || [];

      // Filter by category
      if (category && category !== 'all') {
        allBouquets = allBouquets.filter(b => b.category === category);
      }

      // Filter by search query
      if (search && search.trim() !== '') {
        const query = search.trim().toLowerCase();
        allBouquets = allBouquets.filter(b =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query)
        );
      }

      // Calculate pagination slice
      const start = (page - 1) * limit;
      const paginatedItems = allBouquets.slice(start, start + limit);

      return {
        items: paginatedItems,
        total: allBouquets.length,
        hasMore: start + limit < allBouquets.length,
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to load bouquets list. Please check server or network connection.');
  }
}
