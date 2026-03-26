import { client } from './client';

export interface StudentProfile {
  name: string;
  school_name: string;
  gcn: string; // e.g. "3110" = 3학년 1반 10번
  profile_image_url?: string;
  sex?: string;
  bonus_point?: number;
  minus_point?: number;
  phrase?: string;
}

export interface StudentItem {
  id: string;
  name: string;
  gcn: string;
  profile_image_url?: string;
}

export const studentApi = {
  fetchProfile() {
    return client.get<StudentProfile>('/students/profile');
  },
  fetchStudents() {
    return client.get<{ students: StudentItem[] }>('/students');
  },
  editProfile(body: { profile_image_url?: string }) {
    return client.patch('/students/profile', { body });
  },
};
