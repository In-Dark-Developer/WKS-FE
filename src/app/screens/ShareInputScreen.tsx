import { SajuForm } from '@/features/saju';

type Props = {
  // 공유 링크 주인의 닉네임 — 설명 문구에 들어간다.
  ownerNickname: string;
};

// SCR-06 공유 링크 입력 폼 — Figma v1.0 `4.1 신규 티저` 30:6120·30:6041. 초대 머리(링크 주인의 궁합 지도) 아래의
// 섹션이라 페이지 제목 대신 섹션 머리글을 쓴다. 기존 방문자의 '새로 작성하기'(30:6323)도 같은 폼이다(FR-15).
// 첫 방문의 인트로(FR-1)는 라우트가 감싼다.
export function ShareInputScreen({ ownerNickname }: Props) {
  return (
    <SajuForm
      description={`생년월일만 입력하면 끝이에요.\n${ownerNickname}님과 나의 궁합을 확인할 수 있어요.`}
      sectionTitle="사주를 입력해 인연을 확인하세요"
      submitLabel="내 운명을 친구 궁합 지도에 꿰기"
    />
  );
}
