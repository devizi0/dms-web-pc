import { client } from './client';

export interface OutingApplication {
  outing_application_id: string;
  outing_type: string;
  start_time: string;
  end_time: string;
  date: string;
  reason?: string;
  status?: string;
}

export const outingApi = {
  fetchTypes() {
    return client.get<{ titles: string[] }>('/outings/types');
  },
  fetchAvailableTime(dayOfWeek?: string) {
    return client.get('/outings/available-time', {
      query: dayOfWeek ? { dayOfWeek } : {},
    });
  },
  fetchMyOuting() {
    return client.get<OutingApplication>('/outings/my');
  },
  applyOuting(body: { outing_type: string; start_time: string; end_time: string; date: string; reason?: string }) {
    return client.post('/outings', { body });
  },
  cancelOuting(id: string) {
    return client.delete(`/outings/${id}`);
  },
};
