import { Button } from '@/ui/Button';

type Props = { onApply?: () => void };

// SCR-04 맨 아래 사전신청 섹션 — Figma 결과 화면(873:4155). 누르면 사전신청 모달이 열린다(FR-9).
// 디자인의 'GRAND OPEN !!' 은 Cafe24 PRO Slim 40px 이지만 그 폰트가 저장소에 없어 성곡 서체 32px 로 쓴다
// (토큰 밖 크기·폰트를 새로 들이지 않는다 — CONVENTIONS 4장).
export function PreRegisterTeaser({ onApply }: Props) {
  return (
    <section
      aria-labelledby="pre-register-teaser-title"
      className="flex flex-col items-center gap-24 px-16 pt-24 pb-32"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="flex items-center gap-12 font-sungkok text-ui-20 text-inverse">
          <span>09월 29일</span>
          <span>사주 소개팅</span>
        </p>
        <h2
          className="font-sungkok text-display-32 text-on-brand"
          id="pre-register-teaser-title"
        >
          GRAND OPEN !!
        </h2>
      </div>
      <p className="text-center text-ui-16 font-medium whitespace-pre-line text-neutral-50">
        {'동국대학교 가을 대동제에서\n본인의 운명을 만나보세요!'}
      </p>
      <Button className="w-full" onClick={onApply} size="l" variant="accent">
        사전 신청하고 알림 받기
      </Button>
    </section>
  );
}
