import { Card } from '../components/ui/Card';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">설정</h1>
      </div>

      <Card>
        <div className="space-y-2">
          <h2 className="font-bold text-[#191F28]">서버 설정</h2>
          <p className="text-sm text-[#6B7684]">이 앱은 고정된 서버에 연결됩니다.</p>
          <p className="text-sm text-[#6B7684]">서버 주소는 앱 내부에 설정되어 있어 별도 입력이나 수정이 필요하지 않습니다.</p>
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-[#191F28] mb-2">정보</h2>
        <p className="text-sm text-[#6B7684]">DMS Web v1.0.0 · 기숙사 관리 시스템 웹 클라이언트</p>
      </Card>
    </div>
  );
}
