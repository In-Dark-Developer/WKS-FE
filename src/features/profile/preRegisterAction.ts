import type { ActionFunctionArgs } from 'react-router-dom';

import { forgetSession, readSession } from '@/api/session';
import { createSignup } from '@/api/signups';
import { track } from '@/lib/analytics';

import type { PreRegisterActionData, PreRegisterInput } from './formSchema';

// PreRegisterForm 이 `encType: 'application/json'` 으로 보내는 PreRegisterInput 을 계약 모양으로 좁힌다.
// 같은 화면이 방금 검증한 값이라 필드 존재는 신뢰하되, 요청 본문은 런타임 경계라 타입은 확인한다
// (CONVENTIONS 5장) — 실제 계약 검증은 `createSignup` 안 zod 가 한다.
function toPreRegisterInput(value: unknown): PreRegisterInput {
  if (typeof value !== 'object' || value === null) throw new Error('요청 본문이 올바르지 않다');
  // 위에서 object 임을 확인했으니 필드별로 좁히기 위해 인덱스로 읽는다.
  const body = value as Record<string, unknown>;
  const { name, email, contactMethod, contactValue, gender, preferGender } = body;

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    (contactMethod !== 'PHONE' && contactMethod !== 'INSTAGRAM') ||
    typeof contactValue !== 'string' ||
    (gender !== 'MALE' && gender !== 'FEMALE') ||
    (preferGender !== 'MALE' && preferGender !== 'FEMALE')
  ) {
    throw new Error('요청 본문이 올바르지 않다');
  }

  return {
    name,
    email,
    contactMethod,
    contactValue,
    gender,
    preferGender,
    department: typeof body.department === 'string' ? body.department : null,
    // MBTI 는 16유형 문자열이거나 고르지 않았으면 null 이다 — 계약도 nullable 이다.
    mbti: typeof body.mbti === 'string' ? (body.mbti as PreRegisterInput['mbti']) : null,
    bio: typeof body.bio === 'string' ? body.bio : null,
  };
}

// SCR-09 `/reading/:id/pre-register` action — 검증·동의를 마친 입력만 여기로 온다(FR-17).
// 보관된 '내 결과'를 함께 보내 신청과 사주를 잇고, 그 결과를 백엔드가 모르면(404) 비운 뒤 한 번만 사주 없이 다시 보낸다 —
// 죽은 resultId 때문에 신청 자체가 막히지 않게 한다.
export async function preRegisterAction({
  request,
}: ActionFunctionArgs): Promise<PreRegisterActionData> {
  const input = toPreRegisterInput(await request.json());
  const resultId = readSession()?.resultId ?? null;

  let outcome = await createSignup({ ...input, resultId });
  if (
    resultId !== null &&
    !outcome.ok &&
    outcome.error.kind === 'api' &&
    outcome.error.code === 'RESULT_NOT_FOUND'
  ) {
    // 신청 API 의 RESULT_NOT_FOUND 는 resultId 뿐이다 — 죽은 '내 결과'를 비워 다음 화면이 같은 404 를 받지 않게 한다.
    forgetSession(resultId);
    outcome = await createSignup({ ...input, resultId: null });
  }

  if (outcome.ok) {
    track('pre_register_submitted', { mailSent: outcome.data.mailSent });
    return { status: 'done', mailSent: outcome.data.mailSent };
  }

  const { error } = outcome;
  const formError =
    error.kind === 'api' && error.code === 'DUPLICATE_SIGNUP'
      ? 'duplicate'
      : error.kind === 'api' && error.code === 'INVALID_EMAIL_DOMAIN'
        ? 'domain'
        : 'connection';

  track('pre_register_failed', { reason: formError });
  if (formError === 'connection') console.error('POST /signups 실패', error);
  return { formError };
}
