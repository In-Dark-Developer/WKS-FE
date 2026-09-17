import { expect, test } from 'vitest';

import { externalBrowserUrl } from './inAppBrowser';

const KAKAO_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 25.8.0';
const KAKAO_ANDROID =
  'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36 KAKAOTALK/25.8.0 (INAPP)';
const INSTAGRAM_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0.0 (iPhone16,2; iOS 18_0; ko_KR; ko; scale=3.00; 1290x2796)';
const INSTAGRAM_ANDROID =
  'Mozilla/5.0 (Linux; Android 14; SM-S921N Build/UP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0 Mobile Safari/537.36 Instagram 350.0.0.0.0 Android (34/14; 480dpi; 1080x2340; samsung; SM-S921N; ko_KR)';
const SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const CHROME_ANDROID =
  'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';

const HREF = 'https://threadoffate.site/s/3f1c?utm=insta#top';

test('카카오톡 인앱(iOS·Android)이면 현재 주소 전체를 인코딩해 외부 브라우저 스킴으로 만든다', () => {
  const expected = `kakaotalk://web/openExternal?url=${encodeURIComponent(HREF)}`;

  expect(externalBrowserUrl(KAKAO_IOS, HREF)).toBe(expected);
  expect(externalBrowserUrl(KAKAO_ANDROID, HREF)).toBe(expected);
});

test('인스타그램 인앱 iOS 면 Safari 스킴으로 연다', () => {
  expect(externalBrowserUrl(INSTAGRAM_IOS, HREF)).toBe(
    'x-safari-https://threadoffate.site/s/3f1c?utm=insta#top',
  );
});

test('인스타그램 인앱 Android 면 해시를 뺀 주소를 Chrome intent 로 연다', () => {
  expect(externalBrowserUrl(INSTAGRAM_ANDROID, HREF)).toBe(
    'intent://threadoffate.site/s/3f1c?utm=insta#Intent;scheme=https;package=com.android.chrome;end',
  );
});

test('기본 브라우저면 넘기지 않는다 — 넘어간 브라우저에서 다시 넘기는 반복이 없다', () => {
  expect(externalBrowserUrl(SAFARI, HREF)).toBeNull();
  expect(externalBrowserUrl(CHROME_ANDROID, HREF)).toBeNull();
});
