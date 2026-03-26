import { client } from './client';

export interface TimeSlot { time_slot_id: string; start_time: string; end_time: string; }
export interface StudyRoom {
  study_room_id: string;
  study_room_name: string;
  floor: number;
  available_seat: number;
  total_seat: number;
}
export interface Seat {
  seat_id: string;
  row: number;
  column: number;
  type_name?: string;
  color?: string;
  student_name?: string;
  student_id?: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'IN_USE' | 'MINE';
}
export interface StudyRoomDetail extends StudyRoom {
  width: number;
  height: number;
  seats: Seat[];
}
export interface MyStudyRoom {
  study_room_id: string;
  study_room_name: string;
  seat_id: string;
  row: number;
  column: number;
  time_slot_id: string;
  start_time: string;
  end_time: string;
}

export const studyRoomApi = {
  fetchTimeSlots() {
    return client.get<{ time_slots: TimeSlot[] }>('/study-rooms/time-slots');
  },
  fetchApplicationTime() {
    return client.get<{ start_day_of_week: string; start_time: string; end_day_of_week: string; end_time: string }>('/study-rooms/available-time');
  },
  fetchStudyRooms(time_slot?: string) {
    return client.get<{ study_rooms: StudyRoom[] }>('/study-rooms/list/students', {
      query: time_slot ? { time_slot } : {},
    });
  },
  fetchStudyRoomDetail(id: string, time_slot?: string) {
    return client.get<StudyRoomDetail>(`/study-rooms/${id}/students`, {
      query: time_slot ? { time_slot } : {},
    });
  },
  fetchMyStudyRoom() {
    return client.get<MyStudyRoom>('/study-rooms/my');
  },
  applySeat(seat_id: string, time_slot?: string) {
    return client.put(`/study-rooms/seats/${seat_id}`, {
      query: time_slot ? { time_slot } : {},
    });
  },
  cancelSeat(seat_id: string, time_slot?: string) {
    return client.delete(`/study-rooms/seats/${seat_id}`, {
      query: time_slot ? { time_slot } : {},
    });
  },
};
