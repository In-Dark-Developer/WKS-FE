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
  phone: '01012345678',
};

test('필수는 이름·이메일·전화번호이고 나머지는 비워도 된다', () => {
  expect(validatePreRegister(valid)).toEqual({
    success: true,
    data: {
      name: '김운꿰',
      email: 'wks@dongguk.edu',
      phone: '01012345678',
      instagram: null,
      department: '',
      mbti: null,
      bio: '',
    },
  });
});

test('인스타그램 아이디는 @ 를 떼고, 쓸 수 없는 글자가 있으면 오류다', () => {
  const ok = validatePreRegister({ ...valid, instagram: '@wks.fe_1' });
  expect(ok.success && ok.data.instagram).toBe('wks.fe_1');

  expect(validatePreRegister({ ...valid, instagram: '운꿰사' })).toEqual({
    success: false,
    fieldErrors: { instagram: preRegisterErrorMessages.instagram },
  });
});

test('이메일 형식·전화번호 자릿수를 검사한다', () => {
  expect(validatePreRegister({ ...valid, name: '', email: 'a@b', phone: '0101234' })).toEqual({
    success: false,
    fieldErrors: {
      name: preRegisterErrorMessages.name,
      email: preRegisterErrorMessages.email,
      phone: preRegisterErrorMessages.phone,
    },
  });
});
