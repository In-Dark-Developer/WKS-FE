import { CompatibilityMapScreen, type Friend } from '@/features/friends';
import { Button } from '@/ui/Button';

type Props = {
  // 공유 링크 주인의 닉네임 — 방문자는 주인의 지도를 본다.
  nickname: string;
  friends: readonly Friend[];
  onViewMyReading: () => void;
};

// SCR-13 친구의 궁합 지도(Figma 720:3668) — 방문자 지도(05/T5) + '내 사주 내용도 확인하기'.
// 맨 위 '뒤로가기'는 없다 — 내 사주로 push 로 가서 그쪽 '뒤로가기'가 이 지도로 돌아온다(FR-6).
export function SharedMapScreen({ nickname, friends, onViewMyReading }: Props) {
  return (
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
  );
}
