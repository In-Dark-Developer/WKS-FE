import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { ContentState } from '@/ui/state/ContentState';

// 모든 라우트의 errorElement (SCR-12 오류). 원인은 콘솔에만 남긴다 (CONVENTIONS 7).
export function RouteError() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  if (!isNotFound) console.error(error);

  return (
    <ContentState
      action={
        <Link className="text-ui-14 font-semibold text-brand underline" to="/">
          처음으로 돌아가기
        </Link>
      }
      description={isNotFound ? '주소를 다시 확인해 주세요.' : undefined}
      state="error"
      title={isNotFound ? '찾는 점지가 없어요' : undefined}
    />
  );
}
