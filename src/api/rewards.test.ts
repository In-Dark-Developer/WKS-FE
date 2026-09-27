import { afterEach, expect, test } from 'vitest';

import { rememberPendingReward, takePendingReward } from './rewards';

const reward = { partnerName: '축사', amount: 10 };

afterEach(() => {
  sessionStorage.clear();
});

test('지급을 남겨 두면 한 번만 꺼내진다', () => {
  rememberPendingReward(reward);

  expect(takePendingReward()).toEqual(reward);
  // 두 번째부터는 없다 — 새로고침·재방문에 모달이 다시 뜨지 않는다.
  expect(takePendingReward()).toBeNull();
});

test('지급이 없으면(null) 아무것도 남기지 않는다', () => {
  rememberPendingReward(null);

  expect(takePendingReward()).toBeNull();
  expect(sessionStorage.getItem('wks:pending-reward')).toBeNull();
});

test('깨진 값은 없는 것으로 본다', () => {
  sessionStorage.setItem('wks:pending-reward', '{"amount":"열개"}');

  expect(takePendingReward()).toBeNull();
});
