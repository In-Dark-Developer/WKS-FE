import { Link } from 'react-router-dom';

// SCR-14 `/verify` — 학교 웹메일 매직링크가 백엔드 인증(`GET /signups/verify`)을 거쳐 302 로 보내는 자리다.
// 인증 성공만 여기로 오고(실패는 백엔드가 400 을 그린다), 화면은 알릴 것만 알린다.
export function VerifyComplete() {
  return (
    <section
      aria-labelledby="verify-complete-title"
      className="flex flex-col items-center gap-48 px-16 pt-48"
      role="status"
    >
      <div className="flex flex-col items-center gap-24 text-center">
        <h1 className="font-display text-display-24 text-primary" id="verify-complete-title">
          이메일 인증이 끝났어요
        </h1>
        <p className="text-ui-14 text-secondary">
          소개팅은 09월 29일에 열려요. 그때 알림을 보내 드릴게요.
        </p>
      </div>
      <Link className="text-ui-14 font-semibold text-brand underline" to="/">
        처음으로 돌아가기
      </Link>
    </section>
  );
}
