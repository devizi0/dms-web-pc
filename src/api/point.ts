import { client } from './client';

export interface PointItem {
  point_name?: string;
  point_type?: 'BONUS' | 'MINUS';
  score?: number;
  date?: string;
}

interface RawPointItem {
  point_name?: string;
  point_type?: 'BONUS' | 'MINUS';
  name?: string;
  type?: 'BONUS' | 'MINUS';
  score?: number;
  date?: string;
}

export interface PointsResponse {
  total_point: number;
  point_histories: PointItem[];
  points: PointItem[];
}

interface RawPointsResponse {
  total_point: number;
  point_histories?: RawPointItem[];
  points?: RawPointItem[];
}

function normalizePointItem(item: RawPointItem): PointItem {
  return {
    point_name: item.point_name ?? item.name,
    point_type: item.point_type ?? item.type,
    score: item.score,
    date: item.date,
  };
}

function normalizePointsResponse(response: RawPointsResponse): PointsResponse {
  return {
    total_point: response.total_point,
    point_histories: (response.point_histories ?? []).map(normalizePointItem),
    points: (response.points ?? []).map(normalizePointItem),
  };
}

export const pointApi = {
  async fetchPoints(type: 'ALL' | 'BONUS' | 'MINUS' = 'ALL', page = 0, size = 50) {
    const response = await client.get<RawPointsResponse>('/points', { query: { type, page, size } });
    return normalizePointsResponse(response);
  },
};
