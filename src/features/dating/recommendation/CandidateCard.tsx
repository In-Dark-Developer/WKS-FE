import { ProfileCard, type ProfileCardFace } from '@/ui/ProfileCard';

import { CandidateBack, CandidateFront, CandidatePhotoLayer } from '../card/CandidateFaces';
import { type MatchCandidateView, relationLabelByRank } from './cardsView';

type Props = {
  candidate: MatchCandidateView;
  // 뒷면 '열람하기'·자물쇠 알약 — 해금 모달(SCR-18)을 여는 일은 부르는 쪽이 한다. 없으면 버튼을 그리지 않는다
  // (운명의 실을 보낸 상대 — FR-29).
  onOpenUnlock?: (candidateId: string) => void;
  initialFace?: ProfileCardFace;
};

// 오늘의 인연 카드 — 앞면(점수·관계 유형·MBTI·자기소개, Figma 96:1876) · 뒷면(이름·학과·궁합 이유, 103:2543).
export function CandidateCard({ candidate, onOpenUnlock, initialFace }: Props) {
  return (
    <ProfileCard
      back={
        <CandidateBack
          department={candidate.department}
          name={candidate.name}
          onUnlock={onOpenUnlock ? () => onOpenUnlock(candidate.id) : undefined}
          photo={candidate.photo}
          reason={candidate.reason}
        />
      }
      background={<CandidatePhotoLayer photo={candidate.photo} />}
      front={
        <CandidateFront
          bio={candidate.bio}
          mbti={candidate.mbti}
          rank={candidate.rank}
          relationLabel={relationLabelByRank[candidate.rank]}
          score={candidate.score}
        />
      }
      initialFace={initialFace}
    />
  );
}
