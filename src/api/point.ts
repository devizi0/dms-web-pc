import { client } from './client';

export interface PointItem {
  point_name?: string;
  point_type?: 'BONUS' | 'MINUS';
  score?: number;
  date?: string;
}

export interface PointsResponse {
  total_point: number;
  point_histories: PointItem[];
  points: PointItem[];
}

export const pointApi = {
  fetchPoints(type: 'ALL' | 'BONUS' | 'MINUS' = 'ALL', page = 1, size = 50) {
    return client.get<PointsResponse>('/points', { query: { type, page, size } });
  },
};
