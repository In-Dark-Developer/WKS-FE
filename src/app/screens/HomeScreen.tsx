import { Link } from 'react-router-dom';

import { ReadingResult, type ReadingView } from '@/features/saju';
import { ResultCard } from '@/features/share';

import { BackRow } from './BackRow';

type Props = {
  view: ReadingView;
  // 친구의 궁합 지도에서 들어왔을 때만 맨 위 '뒤로가기'가 있다(Figma 720:3587, FR-6).
  onBack?: () => void;
};

// SCR-04 사주 결과 = 홈 — saju 의 결과 화면에 share(카드)를 잇는다. 사전신청(GRAND OPEN) 섹션은 없다(2026-09-27 QA, 09/T13).
// features 는 서로를 import 하지 않으므로 조립은 app 이 한다(ARCHITECTURE Module Boundaries).
// 친구 궁합 순위와 '친구에게 공유'는 홈에 두지 않는다(2026-09-27 QA, 09/T12) — 궁합지도(/me/map)에 있다.
export function HomeScreen({ view, onBack }: Props) {
  return (
    <ReadingResult
      back={onBack ? <BackRow onBack={onBack} /> : null}
      elementMatchAction={
        view.elementMatch ? (
          // Figma 39:2477 'OO 기운의 사람 만나보기 →' — Display/15 Text/Brand. 소개팅으로 간다(기능명세서 3.6).
          <Link className="font-display text-ui-14 text-brand" to="/dating">
            {view.elementMatch.korean} 기운의 사람 만나보기 →
          </Link>
        ) : undefined
      }
      mapLink={
        onBack ? (
          // Figma 4.1.3 '지도 보기 >'(30:6964) — UI/14/600 Primary-500. 궁합지도로 간다.
          <Link className="text-ui-14 font-semibold text-primary-500" to="/me/map">
            지도 보기 &gt;
          </Link>
        ) : undefined
      }
      renderCard={(face) => <ResultCard {...face} />}
      view={view}
    />
  );
}
