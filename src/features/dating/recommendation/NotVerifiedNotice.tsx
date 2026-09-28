import { DatingBackdrop } from '../DatingBackdrop';

// 학교 메일 인증 전 상태(403 DATING_NOT_VERIFIED) — 인증 흐름은 아직 정해지지 않아(PRD Q20) 안내만 한다.
export function NotVerifiedNotice() {
  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-12 text-center">
      <DatingBackdrop />
      <h1 className="font-display text-display-24 text-rose-500">학교 메일 인증이 필요해요</h1>
      <p className="text-ui-14 text-secondary">
        인증이 끝나면 나와 잘 맞는 인연 세 사람을 보여드릴게요.
      </p>
    </section>
  );
}
