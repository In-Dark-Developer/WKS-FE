import { z } from 'zod';

import type { ContactMethod, Gender } from '@/api/signups';

import type { Mbti } from './options';

// 화면이 들고 있는 입력값. 사진은 받는 계약이 아직 없어 화면 안에만 둔다
// (ADR-20260916-signup-contract-gap).
export type PreRegisterValues = {
  name: string;
  email: string;
  // 연락 수단은 택1 이다 — 백엔드가 `contactMethod` 하나와 그 값 하나를 저장한다(FR-10).
  contactMethod: ContactMethod;
  contactValue: string;
  department: string;
  mbti: Mbti | null;
  bio: string;
  gender: Gender | null;
  preferGender: Gender | null;
  agreed: boolean;
};

// 검증을 통과해 route action 에 보내는 값 — 백엔드 요청 모양으로 바꾸는 일은 preRegisterAction 이 한다.
export type PreRegisterInput = {
  name: string;
  email: string;
  contactMethod: ContactMethod;
  contactValue: string;
  department: string | null;
  mbti: Mbti | null;
  bio: string | null;
  gender: Gender;
  preferGender: Gender;
};

export type PreRegisterField = 'name' | 'email' | 'contactValue' | 'gender' | 'preferGender';

export const BIO_MAX = 500;

export const initialPreRegisterValues: PreRegisterValues = {
  name: '',
  email: '',
  contactMethod: 'PHONE',
  contactValue: '',
  department: '',
  mbti: null,
  bio: '',
  gender: null,
  preferGender: null,
  agreed: false,
};

export const preRegisterErrorMessages = {
  name: '이름을 입력해 주세요',
  email: '이메일 주소를 확인해 주세요',
  phone: '전화번호를 숫자 10~11자리로 입력해 주세요',
  instagram: '인스타그램 아이디를 확인해 주세요',
  gender: '성별을 선택해 주세요',
  preferGender: '어떤 인연을 찾는지 선택해 주세요',
} as const;

export type PreRegisterValidation =
  | { success: true; data: PreRegisterInput }
  | { success: false; fieldErrors: Partial<Record<PreRegisterField, string>> };

function trimToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// 필수는 이름·이메일·연락처·성별·선호 성별과 동의다. 학과·MBTI·자기소개는 백엔드가 nullable 로 받으므로
// 비워 둘 수 있다. 길이 제한은 백엔드 @Size 와 같은 값이다(`src/api/schema/signups.ts`).
export function validatePreRegister(values: PreRegisterValues): PreRegisterValidation {
  const name = values.name.trim();
  const email = values.email.trim();
  const contactValue = values.contactValue.trim().replace(/^@/, '');
  const fieldErrors: Partial<Record<PreRegisterField, string>> = {};

  if (name.length === 0) fieldErrors.name = preRegisterErrorMessages.name;
  if (!z.email().safeParse(email).success) fieldErrors.email = preRegisterErrorMessages.email;
  if (values.contactMethod === 'PHONE') {
    if (!/^01\d{8,9}$/.test(contactValue))
      fieldErrors.contactValue = preRegisterErrorMessages.phone;
  } else if (!/^[A-Za-z0-9._]{1,30}$/.test(contactValue)) {
    fieldErrors.contactValue = preRegisterErrorMessages.instagram;
  }
  if (values.gender === null) fieldErrors.gender = preRegisterErrorMessages.gender;
  if (values.preferGender === null) {
    fieldErrors.preferGender = preRegisterErrorMessages.preferGender;
  }

  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };
  // 위에서 null 을 걸렀다 — 좁히기 위해 단언한다.
  const gender = values.gender as Gender;
  const preferGender = values.preferGender as Gender;

  return {
    success: true,
    data: {
      name,
      email,
      contactMethod: values.contactMethod,
      contactValue,
      department: trimToNull(values.department),
      mbti: values.mbti,
      bio: trimToNull(values.bio.slice(0, BIO_MAX)),
      gender,
      preferGender,
    },
  };
}

// route action 이 돌려주는 값 — 완료, 또는 다시 시도해야 하는 실패다. 실패는 사용자에게 다른 문구로 보인다:
// 'duplicate' 이미 신청한 이메일(409) · 'domain' 학교 웹메일이 아님(400) · 'connection' 그 밖의 실패.
export const preRegisterActionDataSchema = z.union([
  z.object({ status: z.literal('done'), mailSent: z.boolean() }),
  z.object({ formError: z.enum(['duplicate', 'domain', 'connection']) }),
]);

export type PreRegisterActionData = z.infer<typeof preRegisterActionDataSchema>;
