import { Button } from '@/ui/Button';

type Props = {
  onReusePrevious: () => void;
  onWriteNew: () => void;
};

// SCR-06 공유 링크 진입 분기(FR-23) — Figma v1.0 `4.2 기존 티저 (링크 진입 화면)` 30:6128 의 선택 영역.
// 이 브라우저에 사주가 있을 때 초대 머리(ShareInvite) 아래에서 고르게 한다. '이전 정보 불러오기'는 재입력 없이
// 궁합을 만들고, '새로 작성하기'는 이 아래에 사주 입력 폼을 연다(30:6323 — 초대·선택은 그대로 남는다).
export function ShareEntryChoice({ onReusePrevious, onWriteNew }: Props) {
  return (
    // UI/16/600 안내 두 줄 → Button/Primary M · 밑줄 '새로 작성하기' UI/14/400 Neutral/600 (30:6241·30:6322).
    <section aria-label="이전 정보 사용" className="flex flex-col gap-24">
      <p className="text-center text-ui-16 font-semibold text-primary">
        이미 작성된 데이터가 남아있어요.
        <br />
        이전 정보를 사용하여 지도에 등록할까요?
      </p>
      <div className="flex flex-col items-center gap-8">
        <Button className="w-full" onClick={onReusePrevious} size="m">
          이전 정보 불러오기
        </Button>
        <button
          className="text-ui-14 text-neutral-600 underline"
          onClick={onWriteNew}
          type="button"
        >
          새로 작성하기
        </button>
      </div>
    </section>
  );
}
