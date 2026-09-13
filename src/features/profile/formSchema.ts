import { z } from 'zod';

import type { Mbti } from './options';

// 화면이 들고 있는 입력값. 사진은 전송 방식이 미정(PRD Q14)이라 화면 안에만 둔다.
export type PreRegisterValues = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  department: string;
  mbti: Mbti | null;
  bio: string;
  agreed: boolean;
};

// 검증을 통과해 route action 에 보내는 값 — 백엔드 요청 모양으로 바꾸는 일은 06/T3 가 한다.
export type PreRegisterInput = {
  name: string;
  email: string;
  phone: string;
  instagram: string | null;
  department: string;
  mbti: Mbti | null;
  bio: string;
};

export type PreRegisterField = 'name' | 'email' | 'phone' | 'instagram';

export const initialPreRegisterValues: PreRegisterValues = {
  name: '',
  email: '',
  phone: '',
  instagram: '',
  department: '',
  mbti: null,
  bio: '',
  agreed: false,
};

export const preRegisterErrorMessages = {
  name: '이름을 입력해 주세요',
  email: '이메일 형식을 확인해 주세요',
  phone: '전화번호를 숫자 10~11자리로 입력해 주세요',
  instagram: '인스타그램 아이디를 확인해 주세요',
} as const;

export type PreRegisterValidation =
  | { success: true; data: PreRegisterInput }
  | { success: false; fieldErrors: Partial<Record<PreRegisterField, string>> };

// 필수는 이름·이메일·전화번호와 동의 — 그 밖의 필수 여부·길이 제한은 정책 확정 전(PRD Q10)이라 두지 않는다.
export function validatePreRegister(values: PreRegisterValues): PreRegisterValidation {
  const name = values.name.trim();
  const email = values.email.trim();
  const instagram = values.instagram.trim().replace(/^@/, '');
  const fieldErrors: Partial<Record<PreRegisterField, string>> = {};

  if (name.length === 0) fieldErrors.name = preRegisterErrorMessages.name;
  if (!z.email().safeParse(email).success) fieldErrors.email = preRegisterErrorMessages.email;
  if (!/^01\d{8,9}$/.test(values.phone)) fieldErrors.phone = preRegisterErrorMessages.phone;
  if (instagram.length > 0 && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) {
    fieldErrors.instagram = preRegisterErrorMessages.instagram;
  }

  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  return {
    success: true,
    data: {
      name,
      email,
      phone: values.phone,
      instagram: instagram.length > 0 ? instagram : null,
      department: values.department.trim(),
      mbti: values.mbti,
      bio: values.bio.trim(),
    },
  };
}

// route action 이 돌려주는 값 — 완료, 또는 연결 실패(입력값은 화면이 그대로 둔다).
export const preRegisterActionDataSchema = z.union([
  z.object({ status: z.literal('done') }),
  z.object({ formError: z.literal('connection') }),
]);
