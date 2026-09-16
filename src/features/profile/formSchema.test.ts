import { expect, test } from 'vitest';

import {
  initialPreRegisterValues,
  preRegisterErrorMessages,
  validatePreRegister,
} from './formSchema';

const valid = {
  ...initialPreRegisterValues,
  name: ' 김운꿰 ',
  email: 'wks@dongguk.edu',
  contactMethod: 'PHONE' as const,
  contactValue: '01012345678',
  gender: 'MALE' as const,
  preferGender: 'FEMALE' as const,
};

test('필수는 이름·이메일·연락처·성별·찾는 인연이고 나머지는 비워도 된다', () => {
  expect(validatePreRegister(valid)).toEqual({
    success: true,
    data: {
      name: '김운꿰',
      email: 'wks@dongguk.edu',
      contactMethod: 'PHONE',
      contactValue: '01012345678',
      department: null,
      mbti: null,
      bio: null,
      gender: 'MALE',
      preferGender: 'FEMALE',
    },
  });
});

test('인스타그램 아이디는 @ 를 떼고, 쓸 수 없는 글자가 있으면 오류다', () => {
  const ok = validatePreRegister({
    ...valid,
    contactMethod: 'INSTAGRAM',
    contactValue: '@wks.fe_1',
  });
  expect(ok.success && ok.data.contactValue).toBe('wks.fe_1');

  expect(
    validatePreRegister({ ...valid, contactMethod: 'INSTAGRAM', contactValue: '운꿰사' }),
  ).toEqual({
    success: false,
    fieldErrors: { contactValue: preRegisterErrorMessages.instagram },
  });
});

test('이메일 형식·전화번호 자릿수·성별 선택을 검사한다', () => {
  expect(
    validatePreRegister({
      ...valid,
      name: '',
      email: 'a@b',
      contactValue: '0101234',
      gender: null,
      preferGender: null,
    }),
  ).toEqual({
    success: false,
    fieldErrors: {
      name: preRegisterErrorMessages.name,
      email: preRegisterErrorMessages.email,
      contactValue: preRegisterErrorMessages.phone,
      gender: preRegisterErrorMessages.gender,
      preferGender: preRegisterErrorMessages.preferGender,
    },
  });
});

test('학과·자기소개는 공백을 떼고 비면 null 이다 — 백엔드가 nullable 로 받는다', () => {
  const ok = validatePreRegister({ ...valid, department: '  컴퓨터공학과 ', bio: '   ' });

  expect(ok.success && ok.data.department).toBe('컴퓨터공학과');
  expect(ok.success && ok.data.bio).toBeNull();
});
