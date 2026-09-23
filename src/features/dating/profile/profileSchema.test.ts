import { expect, test } from 'vitest';

import {
  initialDetailsStepValues,
  initialSajuStepValues,
  profileErrorMessages,
  validateDetailsStep,
  validateSajuStep,
  type DetailsStepValues,
  type SajuStepValues,
} from './profileSchema';

const now = new Date(2026, 8, 24);

const validSaju: SajuStepValues = {
  ...initialSajuStepValues,
  gender: 'FEMALE',
  birthDate: '20030517',
  birthTime: '12:30',
  nickname: ' 달빛토끼 ',
};

const validDetails: DetailsStepValues = {
  name: '김채원',
  isPhotoReady: true,
  email: 'chaewon@dgu.ac.kr',
  contactMethod: 'PHONE',
  contactValue: '01012345678',
  department: '컴퓨터공학과',
  mbti: 'ENTP',
  bio: '영화와 전시를 좋아해요.',
};

test('(1/2) 빈 폼은 성별·생년월일·태어난 시간·닉네임 오류를 함께 돌려준다', () => {
  const result = validateSajuStep(initialSajuStepValues, now);

  expect(result).toEqual({
    success: false,
    fieldErrors: {
      gender: profileErrorMessages.gender,
      birthDate: profileErrorMessages.birthDateFormat,
      birthTime: profileErrorMessages.birthTime,
      nickname: profileErrorMessages.nickname,
    },
  });
});

test('(1/2) 없는 날짜와 범위 밖 날짜를 구분한다', () => {
  expect(validateSajuStep({ ...validSaju, birthDate: '20030230' }, now)).toMatchObject({
    fieldErrors: { birthDate: profileErrorMessages.birthDateReal },
  });
  expect(validateSajuStep({ ...validSaju, birthDate: '20270101' }, now)).toMatchObject({
    fieldErrors: { birthDate: profileErrorMessages.birthDateRange },
  });
});

test("(1/2) 통과하면 ISO 날짜로 바꾸고 '시간 몰라요'면 시간을 비운다", () => {
  const result = validateSajuStep({ ...validSaju, birthTimeUnknown: true }, now);

  expect(result).toEqual({
    success: true,
    data: {
      gender: 'FEMALE',
      calendarType: 'SOLAR',
      isLeapMonth: false,
      birthDate: '2003-05-17',
      birthTime: null,
      nickname: '달빛토끼',
    },
  });
});

test('(2/2) 빈 폼은 사진을 포함한 모든 필수 항목 오류를 돌려준다', () => {
  const result = validateDetailsStep(initialDetailsStepValues);

  expect(result).toEqual({
    success: false,
    fieldErrors: {
      name: profileErrorMessages.name,
      photo: profileErrorMessages.photo,
      email: profileErrorMessages.email,
      contactValue: profileErrorMessages.phone,
      department: profileErrorMessages.department,
      mbti: profileErrorMessages.mbti,
      bio: profileErrorMessages.bio,
    },
  });
});

test('(2/2) 연락 수단에 따라 전화번호·인스타그램 아이디 규칙이 바뀐다', () => {
  expect(validateDetailsStep({ ...validDetails, contactValue: '010-1234' })).toMatchObject({
    fieldErrors: { contactValue: profileErrorMessages.phone },
  });

  const instagram = validateDetailsStep({
    ...validDetails,
    contactMethod: 'INSTAGRAM',
    contactValue: '@moon.rabbit',
  });

  expect(instagram).toMatchObject({ success: true, data: { contactValue: 'moon.rabbit' } });
});

test('(2/2) 학과는 14자, 자기소개는 170자를 넘으면 막는다', () => {
  const result = validateDetailsStep({
    ...validDetails,
    department: '바이오헬스의료기기규제과학과학',
    bio: '가'.repeat(171),
  });

  expect(result).toMatchObject({
    fieldErrors: {
      department: profileErrorMessages.department,
      bio: profileErrorMessages.bio,
    },
  });
});
