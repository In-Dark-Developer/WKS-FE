import { Button } from '@/ui/Button';

import './PreRegisterTeaser.css';

type Props = { onApply?: () => void };

// SCR-04 맨 아래 사전신청 섹션 — Figma 결과 화면(873:4155). 누르면 사전신청 모달이 열린다(FR-9).
// 글자 색은 Figma 그대로: 날짜·서비스명 Neutral 0, 'GRAND OPEN !!' 청록 그라데이션(CSS), 안내 Neutral 50.
export function PreRegisterTeaser({ onApply }: Props) {
  return (
    <section
      aria-labelledby="pre-register-teaser-title"
      className="flex flex-col justify-between px-16 pb-32"
      data-pre-register-teaser=""
    >
      <div className="flex flex-col items-center gap-24">
        <div className="flex flex-col items-center">
          <p className="flex items-center gap-12 font-sungkok text-ui-20 text-neutral-0">
            <span>09월 29일</span>
            <span>사주 소개팅</span>
          </p>
          {/* Figma 873:1871 — Cafe24 PRO Slim Max 40/1.2. */}
          <h2
            className="font-slim text-display-40"
            data-pre-register-teaser-title=""
            id="pre-register-teaser-title"
          >
            GRAND OPEN !!
          </h2>
        </div>
        <p className="pb-24 text-center text-ui-16 font-medium whitespace-pre-line text-neutral-50">
          {'동국대학교 가을 대동제에서\n본인의 운명을 만나보세요!'}
        </p>
      </div>
      <Button className="w-full" onClick={onApply} size="l" variant="accent">
        사전 신청하고 알림 받기
      </Button>
    </section>
  );
}
