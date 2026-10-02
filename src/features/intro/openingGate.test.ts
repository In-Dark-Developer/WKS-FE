import { expect, test, vi } from 'vitest';

import { formatOpenAt, formatRemaining, readOpenAt, readSiteCloseAt } from './openingGate';

const OPEN_AT = '2026-09-29T09:00:00+09:00';

test('오픈 시각이 없으면 대기 없이 연다', () => {
  expect(readOpenAt(undefined)).toBeNull();
  expect(readOpenAt('')).toBeNull();
});

test('읽을 수 없는 값도 대기 없이 연다', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(readOpenAt('9시')).toBeNull();
});

test('오프셋이 붙은 ISO 시각을 읽는다', () => {
  expect(readOpenAt(OPEN_AT)).toBe(Date.UTC(2026, 8, 29, 0, 0, 0));
});

test('오픈 시각은 기기 시간대와 무관하게 한국 시각으로 쓴다', () => {
  expect(formatOpenAt(Date.parse(OPEN_AT))).toBe('9월 29일 오전 9시');
  expect(formatOpenAt(Date.parse('2026-09-29T13:30:00+09:00'))).toBe('9월 29일 오후 1시 30분');
});

test('남은 시간은 HH:MM:SS, 하루가 넘으면 일을 앞에 붙인다', () => {
  expect(formatRemaining(9 * 3600_000 + 5 * 60_000 + 3_000)).toBe('09:05:03');
  expect(formatRemaining(26 * 3600_000)).toBe('1일 02:00:00');
  expect(formatRemaining(400)).toBe('00:00:01');
  expect(formatRemaining(-5)).toBe('00:00:00');
});

test('사이트 종료 시각도 같은 규칙으로 읽는다 — 없거나 읽을 수 없으면 닫지 않는다', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(readSiteCloseAt(undefined)).toBeNull();
  expect(readSiteCloseAt('새벽 2시')).toBeNull();
  expect(readSiteCloseAt('2026-10-04T02:00:00+09:00')).toBe(Date.UTC(2026, 9, 3, 17, 0, 0));
});
