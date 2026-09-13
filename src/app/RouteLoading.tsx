import { ContentState } from '@/ui/state/ContentState';

// 첫 진입에서 loader 가 끝나기 전까지 보이는 대기 화면 (SCR-12 로딩).
export function RouteLoading() {
  return <ContentState state="loading" />;
}
