import { BlurredPhoto } from '@/ui/BlurredPhoto';
import { ProfileCard, type ProfileCardFace } from '@/ui/ProfileCard';

import type { LockableField, MatchCandidateView } from './cardsView';

type Props = {
  candidate: MatchCandidateView;
  // 뒷면 '열람하기' — 해금 모달(Phase 11 T3)을 여는 일은 부르는 쪽이 한다.
  onOpenUnlock: (candidateId: string) => void;
  initialFace?: ProfileCardFace;
};

// 오늘의 인연 카드 — 앞면(점수·관계 유형·MBTI·자기소개, Figma 96:1876) · 뒷면(이름·학과·궁합 이유, 103:2543).
export function CandidateCard({ candidate, onOpenUnlock, initialFace }: Props) {
  const { photo } = candidate;
  const hasLockedBack = [candidate.name, candidate.department, candidate.reason].some(
    (field) => field.isLocked,
  );

  return (
    <ProfileCard
      back={
        <div className="flex h-full flex-col justify-end gap-24 px-24 pt-48 pb-24">
          {hasLockedBack ? (
            <div className="flex flex-col items-center gap-16 self-center text-center">
              <p className="text-ui-14 font-medium text-neutral-100">
                추가 정보를 얻고 싶으시면
                <br />
                운명의 실로 정보를 열어보세요
              </p>
              <button
                className="w-full rounded-8 border border-neutral-900 bg-surface-default px-20 py-4 text-ui-14 font-medium text-primary"
                onClick={() => onOpenUnlock(candidate.id)}
                type="button"
              >
                열람하기
              </button>
            </div>
          ) : null}
          <dl className="flex flex-col gap-8 text-ui-12">
            <BackRow field={candidate.name} label="이름" placeholder="○○○" />
            <BackRow field={candidate.department} label="학과" placeholder="○○○○○○학과" />
            <BackRow
              field={candidate.reason}
              isBlock
              label="궁합 이유"
              placeholder="두 사람의 사주가 서로를 채워 주는 까닭이 여기에 적혀 있어요. 운명의 실로 열어 보세요."
            />
          </dl>
        </div>
      }
      background={
        <BlurredPhoto
          alt={photo.isLocked ? '흐리게 가린 인연 사진' : '인연 사진'}
          className="size-full"
          isBlurred={photo.isLocked}
          src={photo.isLocked ? photo.thumbnailUrl : photo.url}
        />
      }
      front={
        <div className="flex flex-col gap-16">
          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-start gap-8">
                <span className="rounded-999 bg-neutral-700 px-16 text-ui-12 text-neutral-100">
                  Top{candidate.rank}
                </span>
                <p className="font-sungkok text-display-24 text-neutral-0">
                  {candidate.relationLabel}
                </p>
              </div>
              {candidate.mbti ? (
                <p className="flex items-center gap-12">
                  <span className="text-ui-12 text-neutral-200">MBTI</span>
                  <span className="font-sungkok text-ui-14 text-neutral-0">{candidate.mbti}</span>
                </p>
              ) : null}
            </div>
            <p
              aria-label={`궁합 점수 ${candidate.score}점`}
              className="flex size-48 items-center justify-center rounded-999 border border-neutral-300 font-display text-display-32 text-neutral-0"
            >
              {candidate.score}
            </p>
          </div>
          <p className="text-ui-12 break-keep text-neutral-0">{candidate.bio}</p>
        </div>
      }
      initialFace={initialFace}
    />
  );
}

type BackRowProps = {
  label: string;
  field: LockableField<string>;
  // 잠긴 항목 자리에 흐리게 보일 가짜 글 — 실제 값이 아니다.
  placeholder: string;
  isBlock?: boolean;
};

function BackRow({ label, field, placeholder, isBlock = false }: BackRowProps) {
  return (
    <div className={isBlock ? 'flex flex-col gap-8' : 'flex items-center gap-8'}>
      <dt className="text-neutral-200">{label}</dt>
      {field.isLocked ? (
        <dd>
          <span aria-hidden="true" className="font-medium text-neutral-0 blur-sm select-none">
            {placeholder}
          </span>
          <span className="sr-only">잠겨 있어요 · 운명의 실 {field.cost}개로 열 수 있어요</span>
        </dd>
      ) : (
        <dd className="font-medium text-neutral-0">{field.value}</dd>
      )}
    </div>
  );
}
