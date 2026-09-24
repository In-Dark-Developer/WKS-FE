import { Button } from '@/ui/Button';

import { CompatibilityMap } from './map/CompatibilityMap';
import type { Friend } from './map/tiers';

type Props = {
  // 공유 링크 주인의 닉네임(최대 8자) — 제목·부제와 지도 제목에 들어간다(FR-15).
  ownerNickname: string;
  // 링크 주인의 궁합 지도 구슬 — 순위 순서.
  ownerFriends: readonly Friend[];
  onReusePrevious: () => void;
  onWriteNew: () => void;
};

// SCR-06 공유 링크 진입 분기(FR-23) — Figma v1.0 `4.2 기존 티저 (링크 진입 화면)` 30:6128.
// 이 브라우저에 사주가 있을 때 초대 제목·링크 주인의 궁합 지도 아래에서 고르게 한다. '이전 정보 불러오기'는 재입력
// 없이 궁합을 만들고, '새로 작성하기'는 이 화면 아래에 사주 입력 폼을 연다(30:6323 — 초대·선택은 그대로 남는다).
// 지도는 주인이 보는 자기 지도 문구(내 친구 N명과의 …)를 그대로 쓴다.
export function ShareEntryChoice({
  ownerNickname,
  ownerFriends,
  onReusePrevious,
  onWriteNew,
}: Props) {
  return (
    <section aria-labelledby="share-entry-choice-title" className="flex flex-col gap-40 pt-24">
      <div className="flex flex-col gap-20">
        {/* Display/28 제목 두 줄 · UI/14/500 부제 두 줄 (30:6130). */}
        <header className="flex flex-col items-center gap-12 text-center">
          <h1 className="font-display text-display-28 text-primary" id="share-entry-choice-title">
            {`${ownerNickname}님의`}
            <br />
            궁합지도에 초대됐어요
          </h1>
          <p className="text-ui-14 font-medium text-primary-900">
            {`나는 ${ownerNickname}님에게 어떤 인연일까요?`}
            <br />
            생년월일을 입력해 지도에 등록되어 보세요.
          </p>
        </header>

        <CompatibilityMap friends={ownerFriends} nickname={ownerNickname} />
      </div>

      {/* UI/16/600 안내 두 줄 → Button/Primary M · 밑줄 '새로 작성하기' UI/14/400 Neutral/600 (30:6241·30:6322). */}
      <div className="flex flex-col gap-24">
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
      </div>
    </section>
  );
}
