import { client } from './client';

export interface RemainsOption {
  id: string;
  title: string;
  description: string;
  is_applied: boolean;
}

export interface RemainsTime {
  start_day_of_week: string;
  start_time: string;
  end_day_of_week: string;
  end_time: string;
}

export interface MyRemains {
  id: string;
  title: string;
}

export const remainsApi = {
  fetchOptions() {
    return client.get<{ remain_options: RemainsOption[] }>('/remains/options');
  },
  fetchMyRemains() {
    return client.get<MyRemains>('/remains/my');
  },
  fetchApplicationTime() {
    return client.get<RemainsTime>('/remains/available-time');
  },
  applyRemains(optionId: string) {
    return client.put(`/remains/${optionId}`);
  },
};
