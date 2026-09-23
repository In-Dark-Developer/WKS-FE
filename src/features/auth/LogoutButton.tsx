import { clearAuthToken } from '@/api/authToken';
import { Button } from '@/ui/Button';

type Props = {
  className?: string;
  // 지운 뒤 화면을 갱신하는 방법은 호출자가 정한다 — 이 컴포넌트는 토큰 삭제만 책임진다.
  onLoggedOut?: () => void;
};

// 서버에 알리지 않는다 — 서버는 토큰 상태를 들고 있지 않는다(클라이언트만 지우는 방식, 2026-09-23
// 결정, authToken.ts 참고). 지우기 전에 유출된 토큰 사본은 만료(15일)까지 여전히 유효하다.
export function LogoutButton({ className, onLoggedOut }: Props) {
  return (
    <Button
      className={className}
      variant="secondary"
      type="button"
      onClick={() => {
        clearAuthToken();
        onLoggedOut?.();
      }}
    >
      로그아웃
    </Button>
  );
}
