import { CompatibilityMapScreen, type Friend } from '@/features/friends';
import { ShareLinkButton } from '@/features/share';

import { BackRow } from './BackRow';

type Props = {
  nickname: string;
  // 공유 링크 재료 — 맨 아래 '친구에게 공유하고 궁합 지도 넓히기'가 쓴다(FR-4).
  shareId: string;
  friends: readonly Friend[];
  // 내 사주 결과로 돌아간다 — 주소에 결과 id 가 없어 라우트가 보관된 id 로 정한다.
  onBack: () => void;
};

// SCR-08 내 궁합 지도(`/me/map`) — 05/T2 지도에 '뒤로가기'와 '친구에게 공유'(04/T3)를 잇는다.
export function MyMapScreen({ nickname, shareId, friends, onBack }: Props) {
  return (
    <CompatibilityMapScreen
      back={<BackRow onBack={onBack} />}
      friends={friends}
      nickname={nickname}
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
  );
}
