import httpClient from '../../config/services/httpClient';

export async function fetchMobileSparepartStock() {
  try {
    const res = await httpClient.get('/sparepart/stock');
    return res.data;
  } catch (err) {
    return [];
  }
}
