import { expect, test } from 'vitest';

import { kakaoTalkExternalUrl } from './inAppBrowser';

const KAKAO_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 25.8.0';
const KAKAO_ANDROID =
  'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36 KAKAOTALK/25.8.0 (INAPP)';
const SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const INSTAGRAM =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0';

test('카카오톡 인앱(iOS·Android)이면 현재 주소 전체를 인코딩해 외부 브라우저 스킴으로 만든다', () => {
  const href = 'https://threadoffate.site/s/3f1c?utm=kakao#top';
  const expected = `kakaotalk://web/openExternal?url=${encodeURIComponent(href)}`;

  expect(kakaoTalkExternalUrl(KAKAO_IOS, href)).toBe(expected);
  expect(kakaoTalkExternalUrl(KAKAO_ANDROID, href)).toBe(expected);
});

test('기본 브라우저·인스타그램 인앱이면 넘기지 않는다 — 외부 브라우저에서 다시 넘기는 반복도 없다', () => {
  expect(kakaoTalkExternalUrl(SAFARI, 'https://threadoffate.site/')).toBeNull();
  expect(kakaoTalkExternalUrl(INSTAGRAM, 'https://threadoffate.site/')).toBeNull();
});
