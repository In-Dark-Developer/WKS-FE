import type { ContactMethod, Gender } from '@/api/signups';
import type { SelectOption } from '@/ui/Select';

// 성별·선호 성별은 `POST /signups` 필수값인데 디자인에 없어 폼에 세그먼트 두 줄로 받는다(FR-10).
// 문구는 사주 입력(SCR-02)의 성별 세그먼트와 같은 '남자·여자'다.
export const genderOptions = [
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
] as const satisfies readonly [SelectOption<Gender>, SelectOption<Gender>];

export const preferGenderOptions = [
  { value: 'FEMALE', label: '여자' },
  { value: 'MALE', label: '남자' },
] as const satisfies readonly [SelectOption<Gender>, SelectOption<Gender>];

// 연락 수단 택1 — 디자인(695:2614)의 세그먼트 그대로다. 백엔드는 고른 수단과 값 하나를 저장한다.
export const contactMethodOptions = [
  { value: 'PHONE', label: '전화번호' },
  { value: 'INSTAGRAM', label: '인스타그램' },
] as const satisfies readonly [SelectOption<ContactMethod>, SelectOption<ContactMethod>];

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
