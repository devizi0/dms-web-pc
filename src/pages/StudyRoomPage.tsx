import { useEffect, useState } from 'react';
import { studyRoomApi, type StudyRoom, type StudyRoomDetail, type TimeSlot, type Seat } from '../api/studyRoom';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { Empty } from '../components/ui/Empty';
import { ChevronLeft } from 'lucide-react';

export function StudyRoomPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
  const [detail, setDetail] = useState<StudyRoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    studyRoomApi.fetchTimeSlots()
      .then(r => {
        const slots = r?.time_slots ?? [];
        setTimeSlots(slots);
        if (slots.length > 0) setSelectedSlot(slots[0].time_slot_id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSlot) return;
    studyRoomApi.fetchStudyRooms(selectedSlot)
      .then(r => setRooms(r?.study_rooms ?? []))
      .catch(() => setRooms([]));
    setSelectedRoom(null);
    setDetail(null);
  }, [selectedSlot]);

  const openRoom = async (room: StudyRoom) => {
    setSelectedRoom(room);
    setDetail(null);
    setDetailLoading(true);
    try {
      const d = await studyRoomApi.fetchStudyRoomDetail(room.study_room_id, selectedSlot);
      setDetail(d);
    } finally {
      setDetailLoading(false);
    }
  };

  const applySeat = async (seat: Seat) => {
    if (seat.status !== 'AVAILABLE') return;
    setApplying(seat.seat_id);
    setMsg(null);
    try {
      await studyRoomApi.applySeat(seat.seat_id, selectedSlot);
      setMsg({ type: 'success', text: `${seat.row}행 ${seat.column}열 신청 완료!` });
      if (selectedRoom) openRoom(selectedRoom);
    } catch (e: unknown) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : '신청 실패' });
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">자습실 신청</h1>
        <p className="text-sm text-[#6B7684] mt-1">시간대와 좌석을 선택하세요</p>
      </div>

      {/* Time slot tabs */}
      <div className="flex gap-2 flex-wrap">
        {timeSlots.map(slot => (
          <button
            key={slot.time_slot_id}
            onClick={() => setSelectedSlot(slot.time_slot_id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedSlot === slot.time_slot_id
                ? 'bg-[#3182F6] text-white'
                : 'bg-white text-[#6B7684] hover:bg-[#F2F4F6]'
            }`}
            style={selectedSlot !== slot.time_slot_id ? { boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } : {}}
          >
            {slot.start_time} ~ {slot.end_time}
          </button>
        ))}
      </div>

      {msg && (
        <div className={`p-3 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-[#E8FAF0] text-[#05C072]' : 'bg-[#FFF0F0] text-[#F04452]'}`}>
          {msg.text}
        </div>
      )}

      {selectedRoom ? (
        <div className="space-y-4">
          <button
            onClick={() => { setSelectedRoom(null); setDetail(null); }}
            className="flex items-center gap-1.5 text-sm text-[#6B7684] hover:text-[#191F28] transition-colors"
          >
            <ChevronLeft size={16} /> 목록으로
          </button>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#191F28]">{selectedRoom.study_room_name}</h2>
                <p className="text-sm text-[#6B7684]">{selectedRoom.floor}층</p>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-[#6B7684]">가능 <strong className="text-[#05C072]">{selectedRoom.available_seat}</strong></span>
                <span className="text-[#6B7684]">전체 <strong className="text-[#191F28]">{selectedRoom.total_seat}</strong></span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-5 text-xs text-[#6B7684]">
              {[
                { color: 'bg-white border-2 border-[#3182F6]', label: '선택 가능' },
                { color: 'bg-[#3182F6]', label: '내 자리' },
                { color: 'bg-[#E5E8EB]', label: '사용 중' },
                { color: 'bg-[#F2F4F6]', label: '사용 불가' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded ${color}`} />
                  {label}
                </div>
              ))}
            </div>

            {detailLoading ? <Loading /> : !detail ? null : (
              <SeatGrid seats={detail.seats} width={detail.width} height={detail.height} onApply={applySeat} applying={applying} />
            )}
          </Card>
        </div>
      ) : (
        rooms.length === 0
          ? <Empty text="자습실이 없습니다" icon="📚" />
          : (
            <div className="grid grid-cols-3 gap-4">
              {rooms.map(room => (
                <Card
                  key={room.study_room_id}
                  className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
                  onClick={() => openRoom(room)}
                >
                  <p className="font-bold text-[#191F28] mb-1">{room.study_room_name}</p>
                  <p className="text-xs text-[#6B7684] mb-3">{room.floor}층</p>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-[#F2F4F6] rounded-full h-1.5">
                      <div
                        className="bg-[#3182F6] h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.max(0, ((room.total_seat - room.available_seat) / room.total_seat) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#6B7684] ml-3 shrink-0">
                      {room.available_seat}/{room.total_seat}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )
      )}
    </div>
  );
}

function SeatGrid({ seats, width, height, onApply, applying }: {
  seats: Seat[];
  width: number;
  height: number;
  onApply: (seat: Seat) => void;
  applying: string | null;
}) {
  const grid: (Seat | null)[][] = Array.from({ length: height }, () => Array(width).fill(null));
  seats.forEach(seat => {
    const r = seat.row - 1;
    const c = seat.column - 1;
    if (r >= 0 && r < height && c >= 0 && c < width) grid[r][c] = seat;
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {grid.map((row, ri) => (
          <div key={ri} className="flex gap-2 mb-2">
            {row.map((seat, ci) => (
              <SeatCell key={ci} seat={seat} onApply={onApply} applying={applying} />
            ))}
          </div>
        ))}
      </div>
      {/* Teacher desk */}
      <div className="mt-4 flex justify-center">
        <div className="px-8 py-2 bg-[#F2F4F6] rounded-lg text-xs text-[#6B7684] font-medium">칠판 / 교탁</div>
      </div>
    </div>
  );
}

function SeatCell({ seat, onApply, applying }: { seat: Seat | null; onApply: (s: Seat) => void; applying: string | null }) {
  if (!seat) return <div className="w-10 h-10 shrink-0" />;

  const isApplying = applying === seat.seat_id;
  const statusStyle: Record<string, string> = {
    AVAILABLE:   'bg-white border-2 border-[#3182F6] cursor-pointer hover:bg-[#EBF2FF]',
    MINE:        'bg-[#3182F6] text-white cursor-default',
    IN_USE:      'bg-[#E5E8EB] cursor-default',
    UNAVAILABLE: 'bg-[#F2F4F6] cursor-default',
  };

  return (
    <button
      onClick={() => onApply(seat)}
      disabled={seat.status !== 'AVAILABLE' || !!applying}
      title={seat.student_name ? `${seat.student_name} (${seat.row}행 ${seat.column}열)` : `${seat.row}행 ${seat.column}열`}
      className={`w-10 h-10 shrink-0 rounded-lg text-xs font-medium transition-all flex items-center justify-center
        ${statusStyle[seat.status] ?? 'bg-[#F2F4F6]'}
        ${isApplying ? 'opacity-60' : ''}
      `}
    >
      {isApplying ? '...' : `${seat.row}-${seat.column}`}
    </button>
  );
}
