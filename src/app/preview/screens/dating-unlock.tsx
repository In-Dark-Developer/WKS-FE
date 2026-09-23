import type { PreviewScreen } from '@/app/preview/previewScreen';
import {
  UnlockDialog,
  UnlockDoneDialog,
  type UnlockItem,
  type UnlockOptionView,
} from '@/features/dating';

import { Cards, cardsBase } from './dating-cards';

const noop = () => {};

const allLocked: readonly UnlockOptionView[] = [
  { item: 'photo', cost: 10, isUnlocked: false },
  { item: 'name', cost: 7, isUnlocked: false },
  { item: 'department', cost: 5, isUnlocked: false },
  { item: 'reason', cost: 3, isUnlocked: false },
];

const photoOpened = allLocked.map((option) =>
  option.item === 'photo' ? { ...option, isUnlocked: true } : option,
);

function Unlock({
  options = allLocked,
  balance = cardsBase.balance,
  selected,
}: {
  options?: readonly UnlockOptionView[];
  balance?: number;
  selected?: readonly UnlockItem[];
}) {
  return (
    <>
      <Cards face="back" />
      <UnlockDialog
        balance={balance}
        initialSelected={selected}
        onClose={noop}
        onConfirm={noop}
        open
        options={options}
      />
    </>
  );
}

function Done({ items }: { items: readonly UnlockItem[] }) {
  return (
    <>
      <Cards face="back" />
      <UnlockDoneDialog balance={0} items={items} onClose={noop} open />
    </>
  );
}

// SCR-18 정보 해금 모달 — 11/T3 퍼블리싱. 차감·해금 연결은 11/T1.
export const preview: PreviewScreen = {
  title: 'SCR-18 정보 해금 모달',
  order: 13,
  states: {
    기본: () => <Unlock />,
    '선택(사진)': () => <Unlock selected={['photo']} />,
    '여러 개 선택': () => <Unlock balance={20} selected={['name', 'department', 'reason']} />,
    '이미 연 항목(사진)': () => <Unlock options={photoOpened} />,
    '잔액 부족': () => <Unlock balance={5} selected={['photo']} />,
    '구매 완료 1개': () => <Done items={['department']} />,
    '구매 완료 2개': () => <Done items={['department', 'name']} />,
    '구매 완료 3개': () => <Done items={['department', 'name', 'photo']} />,
    '구매 완료 4개': () => <Done items={['department', 'name', 'photo', 'reason']} />,
  },
};
