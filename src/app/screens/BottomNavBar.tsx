import { useLocation, useNavigate } from 'react-router-dom';

import { readSession } from '@/api/session';
import heartIcon from '@/ui/assets/icons/heart.svg';
import homeIcon from '@/ui/assets/icons/home.svg';
import mapIcon from '@/ui/assets/icons/map.svg';
import { BottomNav } from '@/ui/BottomNav';

export type NavTab = 'home' | 'map' | 'dating';

const items = [
  { id: 'home', label: '홈', icon: homeIcon },
  { id: 'map', label: '궁합지도', icon: mapIcon },
  { id: 'dating', label: '소개팅', icon: heartIcon },
] as const;

// 홈 탭은 티저로 돌아가지 않는다 — 이 브라우저의 사주가 있으면 결과(= 홈), 없으면 사주 입력으로 간다(FR-19).
// 누르는 순간 읽는다: 네비가 떠 있는 동안 새 결과가 생길 수 있다.
function pathOf(tab: NavTab): string {
  if (tab === 'map') return '/me/map';
  if (tab === 'dating') return '/dating';
  const session = readSession();
  return session ? `/reading/${session.resultId}` : '/';
}

function isNavTab(id: string): id is NavTab {
  return items.some((item) => item.id === id);
}

// 라우트 handle.nav 가 켠 화면에만 뜬다(`RootLayout`). 자리는 layout.css 의 [data-bottom-nav] 가 정한다.
// 지금 있는 주소로는 이동하지 않는다 — 같은 주소가 이동 기록에 한 번 더 쌓이면 브라우저 뒤로 가기가 제자리에 머문다.
export function BottomNavBar({ active }: { active: NavTab }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div data-bottom-nav="">
      <BottomNav
        activeId={active}
        items={items}
        onSelect={(id) => {
          if (!isNavTab(id)) return;
          const path = pathOf(id);
          if (path !== pathname) void navigate(path);
        }}
      />
    </div>
  );
}
