import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router-dom';

import { Toast } from '@/ui/Toast';

import { DatingIntro, type DatingIntroView } from '../intro/DatingIntro';
import { findDatingStart } from './datingEntry';

type Props = {
  view: DatingIntroView;
  // 카카오 로그인 시작·로그아웃은 로그인 Task(09/T2)의 몫이라 부르는 쪽(라우트)이 넘긴다.
  onKakaoLogin: () => void;
  onLogout: () => void;
};

export const DATING_START_FAILED_MESSAGE = '정보를 불러오지 못했어요. 잠시 후 다시 눌러 주세요.';

// SCR-15 소개팅 인트로 연결(FR-24) — 등록 상태를 다시 물어 필요한 단계 또는 Top 3 로 보낸다.
export function DatingIntroScreen({ view, onKakaoLogin, onLogout }: Props) {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isStarting, setIsStarting] = useState(false);
  const [hasStartFailed, setHasStartFailed] = useState(false);

  async function handleStart() {
    if (isStarting) return;
    setIsStarting(true);
    const start = await findDatingStart();
    setIsStarting(false);
    if (start.kind === 'go') void navigate(start.path);
    else if (start.kind === 'guest') void revalidator.revalidate();
    else setHasStartFailed(true);
  }

  return (
    <>
      <DatingIntro
        // 로그인 상태가 바뀌면 시트 열림 상태를 새로 시작한다.
        key={view.viewer}
        onKakaoLogin={onKakaoLogin}
        onLogout={onLogout}
        onStart={() => void handleStart()}
        view={view}
      />
      <Toast
        message={DATING_START_FAILED_MESSAGE}
        onClose={() => setHasStartFailed(false)}
        open={hasStartFailed}
      />
    </>
  );
}
