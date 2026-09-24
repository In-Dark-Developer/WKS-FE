import { Button } from '@/ui/Button';

type Props = {
  // 공유 링크 주인의 닉네임 — 설명 문구에 들어간다(FR-15).
  ownerNickname: string;
  onReusePrevious: () => void;
  onWriteNew: () => void;
};

// SCR-06 공유 링크 진입 분기(FR-23) — 이 브라우저에 사주가 있을 때 입력 전에 고르게 한다.
// '이전 정보 불러오기'는 재입력 없이 궁합을 만들고, '새로 작성하기'는 사주 입력 폼을 연다.
// 머리글은 사주 입력(SajuForm)과 같은 자리·글꼴이다 — Figma `4.2 기존 티저 (링크 진입 화면)` 확인 전 임시 배치.
export function ShareEntryChoice({ ownerNickname, onReusePrevious, onWriteNew }: Props) {
  return (
    <section aria-labelledby="share-entry-choice-title" className="flex flex-col gap-40 pt-24">
      <header className="flex flex-col gap-8">
        <h1 className="font-display text-display-28 text-primary" id="share-entry-choice-title">
          운명도 꿰어야 사랑이다
        </h1>
        <p className="text-ui-14 text-inverse">
          {`${ownerNickname}님의 궁합지도에 초대됐어요. 전에 입력한 사주 정보로 바로 궁합을 볼 수 있어요.`}
        </p>
      </header>

      <div className="flex flex-col gap-12">
        <Button className="w-full" onClick={onReusePrevious} variant="apricot">
          이전 정보 불러오기
        </Button>
        <Button className="w-full" onClick={onWriteNew} variant="secondary">
          새로 작성하기
        </Button>
      </div>
    </section>
  );
}
