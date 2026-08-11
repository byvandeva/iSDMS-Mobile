import httpClient from '../../config/services/httpClient';

export async function loginMobileApi(credentials) {
  const res = await httpClient.post('/auth/login', credentials);
  return res.data;
}
