import httpClient from '../../../config/services/httpClient';

export async function fetchMobileDrhMetrics() {
  try {
    const res = await httpClient.get('/services/drh/metrics');
    return res.data;
  } catch (err) {
    return { retentionRate: '84.5%', monthlyCount: 128 };
  }
}
