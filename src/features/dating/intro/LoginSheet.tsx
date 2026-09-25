import kakaoLogo from '@/ui/assets/dating/kakao-logo.svg';
import loginCharacter from '@/ui/assets/dating/login-character.webp';
import { BottomSheet } from '@/ui/BottomSheet';

import '../dating.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onKakaoLogin: () => void;
  // 시트 문구 — 기본은 소개팅(132:3429). 궁합지도 저장 유도는 '궁합지도 저장하기'(Figma v1.0 8:905).
  title?: string;
  description?: string;
};

// Intro 1.1.1 카카오 로그인 시트 — Figma 132:3429. 로그인 시작(백엔드 카카오 인증으로 나가기)은 부르는 쪽이 한다.
export function LoginSheet({
  open,
  onClose,
  onKakaoLogin,
  title = '내 운명 찾아 떠나기',
  description = '간편하게 로그인 후 내 반쪽을 찾으러 가요!',
}: Props) {
  return (
    <BottomSheet
      className="items-center gap-4 border border-neutral px-8"
      label={title}
      onClose={onClose}
      open={open}
    >
      <img
        alt=""
        className="h-[64px] w-[51px] object-contain"
        draggable={false}
        src={loginCharacter}
      />
      <div className="flex flex-col items-center gap-16">
        <div className="flex flex-col items-center text-center text-primary">
          <h2 className="text-ui-20 font-bold">{title}</h2>
          <p className="text-ui-14">{description}</p>
        </div>
        <div className="flex flex-col items-center gap-8">
          <button
            className="flex h-40 w-[281px] items-center justify-center gap-8 rounded-12 text-ui-16 font-semibold"
            data-kakao-login=""
            onClick={onKakaoLogin}
            type="button"
          >
            <img alt="" className="size-[18px]" src={kakaoLogo} />
            카카오로 시작하기
          </button>
          <button className="text-ui-14 text-disabled" onClick={onClose} type="button">
            나중에 할래요
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
