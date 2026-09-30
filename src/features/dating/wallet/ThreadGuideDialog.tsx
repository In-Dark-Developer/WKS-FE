import { useId } from 'react';

import earnCheckIn from '@/ui/assets/dating/earn-check-in.webp';
import earnFestival from '@/ui/assets/dating/earn-festival.webp';
import earnFriendMap from '@/ui/assets/dating/earn-friend-map.webp';
import earnSignup from '@/ui/assets/dating/earn-signup.webp';
import threadGuideYarn from '@/ui/assets/dating/thread-guide-yarn.webp';
import closeIcon from '@/ui/assets/icons/close.svg';
import { IconButton } from '@/ui/IconButton';

import { DatingDialog } from '../DatingDialog';

type Props = {
  open: boolean;
  onClose: () => void;
  balance: number;
  // 오늘 출석 지급을 받았는지 — `GET /wallet` 의 canCheckInToday 가 거짓이면 받은 것이다.
  checkedInToday: boolean;
  // 축제 사이트 유입 보상을 받았는지 — `GET /wallet` 의 partnerRewards 에 FESTIVAL 이 있으면 받은 것이다(QA 2026-09-30).
  festivalRewarded: boolean;
};

type EarnWay = {
  icon: string;
  title: string;
  when: string;
  amount: number;
};

// 획득 방법 — 개수는 백엔드 원장 값(WKS-BE api-spec §12, 2026-09-27 결정: 디자인의 +10 대신 백엔드 값).
// 문구는 Figma 그대로다. 지급은 모두 백엔드가 한다 — 출석은 사이트 접속 때 자동이다(ensureDailyCheckIn).
const signup: EarnWay = {
  icon: earnSignup,
  title: '기본 지급',
  when: '처음 접속 시 지급',
  amount: 10,
};
const checkIn: EarnWay = { icon: earnCheckIn, title: '출석 체크', when: '매일 출석 시', amount: 5 };
// '친구에게 공유'는 Figma 522:2791 개정본을 따른다(2026-09-29) — 사람 수만 세던 규칙이 익명 결과를 반복
// 생성해 실을 무한히 쌓는 길을 열어 두어, 친구가 로그인해야 세는 규칙으로 바뀌었다(개수도 +3 → +2).
const friendMap: EarnWay = {
  icon: earnFriendMap,
  title: '친구에게 공유',
  when: '지도 등록한 친구가 로그인 시',
  amount: 2,
};
const festival: EarnWay = {
  icon: earnFestival,
  title: '축제 사이트 방문',
  when: '축제 사이트에서 들어오면',
  amount: 10,
};

// 소개팅 상단 '운명의 실'을 누르면 뜨는 재화 안내 — Figma v1.0 「운명의실 재화 모달」 522:2739.
// 로그인한 소개팅 화면에서만 열리므로 디자인의 로그인 버튼 영역은 두지 않고 닫기만 둔다(2026-09-27 결정).
export function ThreadGuideDialog({
  open,
  onClose,
  balance,
  checkedInToday,
  festivalRewarded,
}: Props) {
  const titleId = useId();

  return (
    <DatingDialog className="gap-12" labelledBy={titleId} onClose={onClose} open={open}>
      {/* 닫기는 판 모서리에 띄운다 — 실타래 그림이 닫기 줄 아래로 밀리지 않고 판 위쪽에서 시작한다(Figma 295:3281). */}
      <IconButton
        className="absolute top-20 right-16"
        icon={closeIcon}
        label="닫기"
        onClick={onClose}
      />

      <div className="flex w-full flex-col gap-12">
        <img
          alt=""
          className="h-[84px] w-[126px] object-contain"
          draggable={false}
          src={threadGuideYarn}
        />
        <div className="flex items-center justify-between">
          <h2 className="font-display text-display-20 text-apricot-900" id={titleId}>
            운명의 실 획득 방법
          </h2>
          <p className="flex items-center gap-4 rounded-8 bg-rose-50 px-8">
            <span className="text-ui-12 text-muted">보유</span>
            <span className="text-ui-14 text-primary">{balance}개</span>
          </p>
        </div>
        <p className="text-ui-16 text-muted">운명의 실을 모아 새로운 인연을 확인해보세요.</p>

        <ul className="flex flex-col gap-8">
          <EarnRow isDone way={signup} />
          <EarnRow isDone={checkedInToday} way={checkIn} />
          {/* 친구 공유는 여러 번 받을 수 있어 늘 개수로 보인다. */}
          <EarnRow isDone={false} way={friendMap} />
          <EarnRow isDone={festivalRewarded} way={festival} />
        </ul>
      </div>
    </DatingDialog>
  );
}

// 받은 방법은 개수 칩 대신 '지급 완료'만 줄 가운데 높이에 보인다(Figma 445:2701). 줄 높이는 Figma 82px 가 최소다.
function EarnRow({ way, isDone }: { way: EarnWay; isDone: boolean }) {
  return (
    <li
      className="flex min-h-[82px] items-center justify-between gap-8 rounded-12 p-12"
      data-earn-row=""
    >
      <div className="flex items-center gap-12">
        <img
          alt=""
          className="size-[58px] shrink-0 object-contain"
          draggable={false}
          src={way.icon}
        />
        <div className="flex flex-col gap-4">
          <span className="text-ui-16 font-semibold text-apricot-900">{way.title}</span>
          <span className="text-ui-14 text-muted">{way.when}</span>
        </div>
      </div>
      {isDone ? (
        <span className="shrink-0 rounded-8 bg-rose-50 px-8 text-ui-12 text-muted">지급 완료</span>
      ) : (
        <span
          className="flex shrink-0 items-center gap-4 rounded-8 px-8 py-[2px]"
          data-earn-amount=""
        >
          <span className="text-ui-12">+</span>
          <span className="text-ui-16 font-semibold">{way.amount}</span>
        </span>
      )}
    </li>
  );
}
