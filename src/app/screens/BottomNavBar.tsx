import { useNavigate } from 'react-router-dom';

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

// 홈 탭 — 이 브라우저의 사주가 있으면 결과(= 홈), 없으면 `/` 의 메인 티저가 홈이다(FR-19, 2026-09-26).
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
export function BottomNavBar({ active }: { active: NavTab }) {
  const navigate = useNavigate();
  return (
    <div data-bottom-nav="">
      <BottomNav
        activeId={active}
        items={items}
        onSelect={(id) => {
          if (isNavTab(id)) void navigate(pathOf(id));
        }}
      />
    </div>
  );
}
