import { Button } from '@/ui/Button';

type Props = { onApply?: () => void };

// SCR-04 맨 아래 사전신청 섹션 — Figma 결과 화면(873:4155). 누르면 사전신청 모달이 열린다(FR-9).
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
        {/* Figma 873:1871 — Cafe24 PRO Slim Max 40/1.2. */}
        <h2 className="font-slim text-display-40 text-on-brand" id="pre-register-teaser-title">
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
