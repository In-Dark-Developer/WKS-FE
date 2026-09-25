// features/auth 진입점 — app 은 이 파일을 통해서만 가져온다(ARCHITECTURE Module Boundaries).
// 로그인 시트 화면은 features/dating 의 LoginSheet 가 그리고, 여기는 카카오 왕복만 맡는다.
export {
  KAKAO_CALLBACK_PATH,
  completeKakaoLogin,
  goToKakaoLogin,
  startKakaoLogin,
  type KakaoLoginOutcome,
} from './kakaoLogin';
