import { CompatibilityMap } from './map/CompatibilityMap';
import type { Friend } from './map/tiers';

type Props = {
  // 공유 링크 주인의 닉네임(최대 8자) — 제목·부제와 지도 제목에 들어간다(FR-15).
  ownerNickname: string;
  // 링크 주인의 궁합 지도 구슬 — 순위 순서.
  ownerFriends: readonly Friend[];
};

// SCR-06 공유 링크 진입의 초대 머리 — Figma v1.0 `4.1 신규 티저` 30:5916 · `4.2 기존 티저` 30:6128 공통(FR-15 V1).
// 'OO님의 궁합지도에 초대됐어요' 와 링크 주인의 궁합 지도. 지도는 주인이 보는 자기 지도 문구(내 친구 N명과의 …)다.
export function ShareInvite({ ownerNickname, ownerFriends }: Props) {
  return (
    <section aria-labelledby="share-invite-title" className="flex flex-col gap-20 pt-24">
      {/* Display/28 제목 두 줄 · UI/14/500 부제 두 줄 (30:5943). */}
      <header className="flex flex-col items-center gap-12 text-center">
        <h1 className="font-display text-display-28 text-primary" id="share-invite-title">
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
    </section>
  );
}
