import { useState } from 'react';
import { getBaseUrl, setBaseUrl } from '../api/client';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function SettingsPage() {
  const [url, setUrl] = useState(getBaseUrl());
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setBaseUrl(url.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">설정</h1>
      </div>

      <Card>
        <h2 className="font-bold text-[#191F28] mb-5">서버 설정</h2>
        <form onSubmit={save} className="space-y-4">
          <Input
            label="Base URL"
            type="url"
            placeholder="https://api.example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <Button type="submit" variant={saved ? 'secondary' : 'primary'}>
            {saved ? '저장됨 ✓' : '저장'}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold text-[#191F28] mb-2">정보</h2>
        <p className="text-sm text-[#6B7684]">DMS Web v1.0.0 · 기숙사 관리 시스템 웹 클라이언트</p>
      </Card>
    </div>
  );
}
