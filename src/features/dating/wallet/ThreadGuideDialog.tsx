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
const others: readonly EarnWay[] = [
  { icon: earnFriendMap, title: '지도 별 달성', when: '별 1개 획득 시', amount: 3 },
  { icon: earnFestival, title: '축제 사이트 방문', when: '축제 사이트에서 들어오면', amount: 10 },
];

// 소개팅 상단 '운명의 실'을 누르면 뜨는 재화 안내 — Figma v1.0 「운명의실 재화 모달」 295:3281.
// 로그인한 소개팅 화면에서만 열리므로 디자인의 로그인 버튼 영역은 두지 않고 닫기만 둔다(2026-09-27 결정).
export function ThreadGuideDialog({ open, onClose, balance, checkedInToday }: Props) {
  const titleId = useId();

  return (
    <DatingDialog className="gap-12" labelledBy={titleId} onClose={onClose} open={open}>
      <div className="-mt-20 -mr-8 -mb-4 flex w-full justify-end">
        <IconButton icon={closeIcon} label="닫기" onClick={onClose} />
      </div>

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
          {others.map((way) => (
            <EarnRow isDone={false} key={way.title} way={way} />
          ))}
        </ul>
      </div>
    </DatingDialog>
  );
}

// 받은 방법은 개수 대신 '지급 완료'만 보인다(Figma 445:2701).
function EarnRow({ way, isDone }: { way: EarnWay; isDone: boolean }) {
  return (
    <li className="flex h-[82px] items-center justify-between rounded-12 bg-rose-100 p-12">
      <div className="flex h-full items-center gap-12">
        <img alt="" className="size-[58px] object-contain" draggable={false} src={way.icon} />
        <div className="flex flex-col gap-4">
          <span className="text-ui-16 font-semibold text-apricot-900">{way.title}</span>
          <span className="text-ui-14 text-muted">{way.when}</span>
        </div>
      </div>
      {isDone ? (
        <span className="rounded-8 bg-rose-50 px-8 text-ui-12 text-muted">지급 완료</span>
      ) : (
        <span className="flex items-center gap-4 rounded-8 bg-rose-200 px-8 py-[2px] text-rose-700">
          <span className="text-ui-12">+</span>
          <span className="text-ui-16 font-semibold">{way.amount}</span>
        </span>
      )}
    </li>
  );
}
