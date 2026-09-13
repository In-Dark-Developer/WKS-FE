import type { SelectOption } from '@/ui/Select';

// 16유형 — 순서는 Figma 수정본 MBTI 드롭다운(Frame 88·89).
const mbtiTypes = [
  'ENTJ',
  'ENTP',
  'INTJ',
  'INTP',
  'ENFJ',
  'ENFP',
  'INFJ',
  'INFP',
  'ESTJ',
  'ESFJ',
  'ISTJ',
  'ISFJ',
  'ESTP',
  'ESFP',
  'ISTP',
  'ISFP',
] as const;

export type Mbti = (typeof mbtiTypes)[number];

export const mbtiOptions: readonly SelectOption<Mbti>[] = mbtiTypes.map((type) => ({
  value: type,
  label: type,
}));
