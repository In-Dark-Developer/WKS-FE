import { useId } from 'react';

import threadGuideYarn from '@/ui/assets/dating/thread-guide-yarn.webp';
import closeIcon from '@/ui/assets/icons/close.svg';
import { IconButton } from '@/ui/IconButton';
import { ThreadCount } from '@/ui/ThreadCount';

import { DatingDialog } from '../DatingDialog';

type Props = {
  open: boolean;
  // '바로 로그인하고 …' — 카카오 로그인으로 보낸다(Figma 1.1.1). 지급은 로그인 응답이 싣는다.
  onLogin: () => void;
  // '나중에 사용할래요'와 닫기(Figma 1.3) — 같은 자리로 모은다. 코드는 남겨 두어 나중에 로그인해도 받는다.
  onClose: () => void;
};

// 축제 배너로 들어온 사람에게 줄 개수 — 백엔드 `app.partner.rewards` 의 FESTIVAL 값(WKS-BE §12).
// 실제 지급은 백엔드가 하고 이 숫자는 안내용이다.
const PARTNER_REWARD_AMOUNT = 10;

// SCR-23 제휴 배너 진입 안내 — Figma v1.0 「축사 연결」 1.1 축사 배너 진입(234:2797).
// 로그인해야 실이 들어오는데 그 사실을 알릴 자리가 없어 배너로 들어온 사람이 그냥 나갔다(2026-09-29 QA, FR-32).
// 메인 티저 위에 한 번 떠서 로그인으로 보낸다 — 지급 결과는 RewardGrantedDialog(1.2)가 알린다.
export function PartnerEntryDialog({ open, onLogin, onClose }: Props) {
  const titleId = useId();

  return (
    <DatingDialog className="gap-[27px]" labelledBy={titleId} onClose={onClose} open={open}>
      {/* 닫기는 판 맨 위 오른쪽 — 아래 글이 왼쪽 정렬이라 겹치지 않아 띄우지 않고 줄로 둔다(Figma 234:2830). */}
      <div className="flex w-full justify-end">
        <IconButton icon={closeIcon} label="닫기" onClick={onClose} />
      </div>

      <div className="flex flex-col items-start gap-12">
        <img
          alt=""
          className="h-[84px] w-[126px] object-contain"
          draggable={false}
          src={threadGuideYarn}
        />
        <h2 className="font-display text-display-20 text-apricot-900" id={titleId}>
          운명의 실
        </h2>
        <p className="text-ui-16 text-muted">
          운명의 실을 통해 상대방의 정보를 확인하고,
          <br />
          원하는 운명을 찾을 수 있어요.
        </p>
        <ThreadCount count={PARTNER_REWARD_AMOUNT} />
      </div>

      <div className="flex flex-col items-center gap-12">
        <button
          className="rounded-8 bg-neutral-900 px-16 py-8 text-ui-14 font-medium text-inverse"
          onClick={onLogin}
          type="button"
        >
          바로 로그인하고 운명의 짝 찾아보기
        </button>
        <button className="text-ui-14 text-disabled underline" onClick={onClose} type="button">
          나중에 사용할래요
        </button>
      </div>
    </DatingDialog>
  );
}
