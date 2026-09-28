import { CompatibilityMapScreen, type Friend } from '@/features/friends';
import { Button } from '@/ui/Button';

import { BackRow } from './BackRow';

type Props = {
  // 공유 링크 주인의 닉네임 — 방문자는 주인의 지도를 본다.
  nickname: string;
  friends: readonly Friend[];
  onViewMyReading: () => void;
  // 공유 궁합 결과(SCR-24)의 '전체 보기 >'로 들어왔을 때만 — 맨 위 '뒤로가기'가 결과로 돌아간다(Figma 16:1827).
  onBack?: () => void;
};

// SCR-13 친구의 궁합 지도(Figma 720:3668 · v1.0 16:1827) — 방문자 지도(05/T5) + '내 사주 내용도 확인하기'.
// 내 사주로는 push 로 가서 그쪽 '뒤로가기'가 이 지도로 돌아온다(FR-6).
export function SharedMapScreen({ nickname, friends, onViewMyReading, onBack }: Props) {
  return (
    <div className="flex flex-col gap-12">
      {/* 셸 위 여백 16 에 바로 — 지도가 Figma 처럼 56 에서 시작한다(16:1939). */}
      {onBack ? <BackRow onBack={onBack} /> : null}
      <CompatibilityMapScreen
        friends={friends}
        nickname={nickname}
        share={
          <Button className="w-full" onClick={onViewMyReading} variant="apricot">
            내 사주 내용도 확인하기
          </Button>
        }
        variant="visitor"
      />
    </div>
  );
}
