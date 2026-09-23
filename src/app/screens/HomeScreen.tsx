import { Link } from 'react-router-dom';

import { FriendRanking } from '@/features/friends';
import { PreRegisterTeaser } from '@/features/profile';
import { ReadingResult, type ReadingView } from '@/features/saju';
import { ResultCard, ShareLinkButton } from '@/features/share';

import { BackRow } from './BackRow';

type Props = {
  view: ReadingView;
  // 사전신청 티저를 눌렀을 때 — 이동은 라우트가 정한다.
  onPreRegister: () => void;
  // 친구의 궁합 지도에서 들어왔을 때만 맨 위 '뒤로가기'가 있다(Figma 720:3587, FR-6).
  onBack?: () => void;
};

// SCR-04 사주 결과 = 홈 — saju 의 결과 화면에 share(카드·공유)·friends(순위)·profile(사전신청 티저)을 잇는다.
// features 는 서로를 import 하지 않으므로 조립은 app 이 한다(ARCHITECTURE Module Boundaries).
// '친구에게 공유'(04/T3)는 친구 궁합 순위가 비어 있으면 안내 아래(713:4078), 있으면 목록 아래(796:3885)에 둔다(PRD FR-4).
export function HomeScreen({ view, onPreRegister, onBack }: Props) {
  return (
    <ReadingResult
      back={onBack ? <BackRow onBack={onBack} /> : null}
      ranking={
        <FriendRanking
          friends={view.friends ?? []}
          headerAction={
            // Figma 798:3138 '지도 보기 >' — UI/14/600 Action/Teal/Default.
            <Link
              className="text-ui-14 font-semibold whitespace-nowrap text-primary-500"
              to="/me/map"
            >
              지도 보기 &gt;
            </Link>
          }
          limit={3}
          shareAction={
            <ShareLinkButton
              nickname={view.nickname}
              shareId={view.shareId}
              size="m"
              surface="reading"
            />
          }
        />
      }
      elementMatchAction={
        view.elementMatch ? (
          // Figma 39:2477 'OO 기운의 사람 만나보기 →' — Display/15 Text/Brand. 소개팅으로 간다(기능명세서 3.6).
          <Link className="font-display text-ui-14 text-brand" to="/dating">
            {view.elementMatch.korean} 기운의 사람 만나보기 →
          </Link>
        ) : undefined
      }
      renderCard={(face) => <ResultCard {...face} />}
      teaser={<PreRegisterTeaser onApply={onPreRegister} />}
      view={view}
    />
  );
}
