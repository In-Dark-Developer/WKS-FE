import { useState } from 'react';

import { LoginSheet } from '@/features/dating';
import { CompatibilityMapScreen, MapSaveCard, type Friend } from '@/features/friends';
import { ShareLinkButton } from '@/features/share';

import { BackRow } from './BackRow';

type Props = {
  nickname: string;
  // 공유 링크 재료 — 맨 아래 '친구에게 공유하고 궁합 지도 넓히기'가 쓴다(FR-4).
  shareId: string;
  friends: readonly Friend[];
  // 내 사주 결과로 돌아간다 — 주소에 결과 id 가 없어 라우트가 보관된 id 로 정한다.
  onBack: () => void;
  // 친구 줄을 눌렀을 때 — 궁합 이유 시트(FR-22)로 가는 이동은 라우트가 정한다.
  onSelectFriend?: (friend: Friend) => void;
  // 비로그인일 때만 준다 — 맨 아래 저장 유도 카드가 로그인 시트를 띄우고, '카카오로 시작하기'가 이것을 부른다(FR-20).
  onKakaoLogin?: () => void;
};

// SCR-08 내 궁합 지도(`/me/map`) — 05/T2 지도에 '뒤로가기'와 '친구에게 공유'(04/T3)를 잇는다.
export function MyMapScreen({
  nickname,
  shareId,
  friends,
  onBack,
  onSelectFriend,
  onKakaoLogin,
}: Props) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <>
      <CompatibilityMapScreen
        back={<BackRow onBack={onBack} />}
        footer={onKakaoLogin ? <MapSaveCard onLogin={() => setIsLoginOpen(true)} /> : null}
        friends={friends}
        nickname={nickname}
        onSelectFriend={onSelectFriend}
        share={
          <ShareLinkButton
            className="w-full"
            label="친구에게 공유하고 궁합 지도 넓히기"
            nickname={nickname}
            shareId={shareId}
            surface="map"
            variant="accent"
          />
        }
      />
      {onKakaoLogin ? (
        <LoginSheet
          description="카카오로 로그인하고 지금까지의 인연을 이어가세요."
          onClose={() => setIsLoginOpen(false)}
          onKakaoLogin={onKakaoLogin}
          open={isLoginOpen}
          title="궁합지도 저장하기"
        />
      ) : null}
    </>
  );
}
