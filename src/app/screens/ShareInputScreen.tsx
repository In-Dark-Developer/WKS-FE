import { SajuForm } from '@/features/saju';

type Props = {
  // 공유 링크 주인의 닉네임 — 설명 문구에 들어간다.
  ownerNickname: string;
};

// SCR-06 공유 링크 입력(Figma 720:3653) — 사주 입력 폼에 링크 주인 닉네임이 든 설명과 '운명 지도 확인하기'.
// 첫 방문의 인트로(FR-1)는 라우트가 감싼다.
export function ShareInputScreen({ ownerNickname }: Props) {
  return (
    <SajuForm
      description={`아래 정보를 입력하고 나와 ${ownerNickname} 님의 귀인 궁합을 관계로 확인해보아요.`}
      submitLabel="운명 지도 확인하기"
    />
  );
}
