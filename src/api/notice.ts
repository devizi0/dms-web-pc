import { client } from './client';

export interface Notice {
  id: string;
  title: string;
  created_at: string;
}

export interface NoticeDetail extends Notice {
  content: string;
}

export const noticeApi = {
  fetchNotices(order: 'NEW' | 'OLD' = 'NEW') {
    return client.get<{ notices: Notice[] }>('/notices', { query: { order } });
  },
  fetchNoticeDetail(id: string) {
    return client.get<NoticeDetail>(`/notices/${id}`);
  },
  fetchLatestNotice() {
    return client.get<Notice>('/notices/latest');
  },
  fetchHasNewNotice() {
    return client.get<{ whether_new_notices: boolean }>('/notices/status');
  },
};
