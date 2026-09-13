import type { ComponentType } from 'react';
import type { ActionFunction } from 'react-router-dom';

import type { Backdrop } from '@/app/AppShell';

// `src/app/preview/screens/<화면>.tsx` 가 `export const preview` 로 내보내는 모양.
// 화면은 가짜 데이터를 props 로 받아 그린 컴포넌트를 상태 이름별로 둔다 — 첫 상태가 기본이다.
export type PreviewScreen = {
  title: string;
  // 목록 순서 — 작은 값이 먼저. 같으면 파일 이름순.
  order: number;
  backdrop?: Backdrop;
  states: Readonly<Record<string, ComponentType>>;
  // 화면이 폼을 제출할 때 받는 action — 로딩·실패 상태를 보려고 가짜 응답을 돌려준다.
  action?: ActionFunction;
};
