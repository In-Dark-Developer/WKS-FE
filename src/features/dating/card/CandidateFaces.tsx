import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { BlurredPhoto } from '@/ui/BlurredPhoto';
import { LockedValue } from '@/ui/LockedValue';

import type { CandidatePhoto, LockableField } from '../recommendation/cardsView';
import { CostText } from '../unlock/CostText';
import { listedCost } from '../unlock/unlockView';

import '../dating.css';

// 인연 카드의 사진·앞면·뒷면 내용 — 오늘의 인연(SCR-17)과 요청함 상세(SCR-20)가 ProfileCard 슬롯에 같이 쓴다.

export function CandidatePhotoLayer({ photo }: { photo: CandidatePhoto }) {
  const src = photo.isLocked ? photo.thumbnailUrl : photo.url;
  // 썸네일이 없는 잠긴 사진은 그림 없이 어두운 바탕만 둔다.
  if (src === null) {
    return <div aria-label="가려진 인연 사진" className="size-full bg-neutral-700" role="img" />;
  }
  return (
    <BlurredPhoto
      alt={photo.isLocked ? '흐리게 가린 인연 사진' : '인연 사진'}
      className="size-full"
      isBlurred={photo.isLocked}
      src={src}
    />
  );
}

type FrontProps = {
  // 추천 순위 — 받은 신청처럼 순위가 없는 카드는 null.
  rank: number | null;
  relationLabel: string;
  mbti: string;
  // 나이 — '02년생'. 없으면 칸을 그리지 않는다.
  birthYear?: string | null;
  // 궁합 점수 — 보이지 않기로 한 카드(받은 신청, Q17 미정)는 null.
  score: number | null;
  bio: string;
  // 자기소개 아래 버튼 줄(요청함 상세).
  footer?: ReactNode;
};

// 앞면 — 순위·관계 유형·MBTI·나이·점수·자기소개(Figma 96:1876 · 나이 추가 448:2759).
export function CandidateFront({
  rank,
  relationLabel,
  mbti,
  birthYear,
  score,
  bio,
  footer,
}: FrontProps) {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col items-start gap-8">
          {rank === null ? null : (
            <span
              className="rounded-999 bg-opacity-card-badge-50 px-16 text-ui-12 text-neutral-100"
              data-card-glass=""
            >
              Top{rank}
            </span>
          )}
          {/* 점수 원(45px)은 관계 유형 오른쪽 16px(Figma 448:2833). 원이 글줄(34px)보다 커서 아래쪽에 맞추면 원이
              위로 솟아 수평이 어긋나 보였다 — 관계 유형과 세로 가운데로 맞춘다(QA 2026-09-28). */}
          <div className="flex items-center gap-16" data-candidate-headline="">
            <p className="font-sungkok text-display-24 text-neutral-0">{relationLabel}</p>
            {score === null ? null : (
              <p
                aria-label={`궁합 점수 ${score}점`}
                className="flex size-[45px] shrink-0 items-center justify-center rounded-999 bg-opacity-card-score-20 font-display text-display-32 text-neutral-0"
                data-card-glass=""
              >
                {score}
              </p>
            )}
          </div>
        </div>
        {/* 라벨(Pretendard 12)과 값(성곡 14)은 글꼴 높이가 달라 가운데 맞춤이면 글자 바닥이 어긋난다 — 바닥선에 맞춘다. */}
        <p className="flex items-baseline gap-12" data-candidate-meta="">
          <span className="text-ui-12 text-neutral-200">MBTI</span>
          <span className="font-sungkok text-ui-14 text-neutral-0">{mbti}</span>
          {birthYear ? (
            <>
              <span className="text-ui-12 text-neutral-200">나이</span>
              <span className="font-sungkok text-ui-14 text-neutral-0">{birthYear}</span>
            </>
          ) : null}
        </p>
      </div>
      {/* 띄어쓰기 없는 긴 글도 카드 폭 안에서 줄을 바꾼다 — 낱말 단위 줄바꿈(break-keep)은 그대로 두고 넘칠 때만 끊는다. */}
      <p className="text-ui-12 wrap-anywhere break-keep text-neutral-0">{bio}</p>
      {footer ? <div className="flex justify-center gap-16">{footer}</div> : null}
    </div>
  );
}

type BackProps = {
  photo: CandidatePhoto;
  name: LockableField<string>;
  department: LockableField<string>;
  // 궁합 까닭 — 요청함에서 까닭을 모르는 상대는 null(흐림 대신 없음 안내).
  reason: LockableField<string> | null;
  // 해금 모달을 연다. 없으면(운명의 실을 보낸 뒤, FR-29) 잠긴 항목은 흐리게만 보인다.
  onUnlock?: () => void;
};

// 뒷면 — 이름·학과·궁합 이유(Figma 103:2543).
// 아무것도 열지 않았으면 '열람하기' 하나(103:2533), 일부를 열었으면 잠긴 항목마다 자물쇠 알약(112:3241)을 둔다.
export function CandidateBack({ photo, name, department, reason, onUnlock }: BackProps) {
  const isNothingOpened = [photo, name, department, reason].every(
    (field) => field === null || field.isLocked,
  );
  const rowUnlock = onUnlock && !isNothingOpened ? onUnlock : undefined;

  return (
    <div className="flex h-full flex-col justify-end gap-24 px-24 pt-48 pb-24">
      {rowUnlock && photo.isLocked ? (
        <LockedValue
          className="absolute top-[113px] left-1/2 -translate-x-1/2"
          label={
            <>
              사진 <CostText cost={photo.cost} listed={listedCost.photo} />
              개로 열기
            </>
          }
          onUnlock={rowUnlock}
        />
      ) : null}
      {onUnlock && isNothingOpened ? (
        <div className="flex flex-col items-center gap-16 self-center text-center">
          <p className="text-ui-14 font-medium text-neutral-100">
            추가 정보를 얻고 싶으시면
            <br />
            운명의 실로 정보를 열어보세요
          </p>
          <button
            className="w-full rounded-8 border border-neutral-900 bg-surface-default px-20 py-4 text-ui-14 font-medium text-primary"
            onClick={onUnlock}
            type="button"
          >
            열람하기
          </button>
        </div>
      ) : null}
      {/* 자물쇠 알약(28px)이 글줄(18px)보다 높아 잠긴 줄이 붙으면 겹친다 — 알약이 있을 때만 줄 간격을 넓힌다. */}
      <dl className={cn('flex flex-col text-ui-12', rowUnlock ? 'gap-16' : 'gap-8')}>
        <BackRow
          field={name}
          label="이름"
          listed={listedCost.name}
          onUnlock={rowUnlock}
          placeholder="○○○"
        />
        <BackRow
          field={department}
          label="학과"
          listed={listedCost.department}
          onUnlock={rowUnlock}
          placeholder="○○○○○○학과"
        />
        {reason === null ? (
          <div className="flex flex-col gap-8">
            <dt className="text-neutral-200">궁합 이유</dt>
            <dd className="text-neutral-200">궁합 이유는 오늘의 인연 카드에서만 볼 수 있어요.</dd>
          </div>
        ) : (
          <BackRow
            field={reason}
            isBlock
            label="궁합 이유"
            listed={listedCost.reason}
            onUnlock={rowUnlock}
            placeholder="두 사람의 사주가 서로를 채워 주는 까닭이 여기에 적혀 있어요. 운명의 실로 열어 보세요."
          />
        )}
      </dl>
    </div>
  );
}

type BackRowProps = {
  label: string;
  field: LockableField<string>;
  // 정가 — 할인 중이면 알약에 취소선으로 함께 적는다.
  listed: number;
  // 잠긴 항목 자리에 흐리게 보일 가짜 글 — 실제 값이 아니다.
  placeholder: string;
  isBlock?: boolean;
  onUnlock?: () => void;
};

function BackRow({ label, field, listed, placeholder, isBlock = false, onUnlock }: BackRowProps) {
  const fake = <span className="font-medium text-neutral-0">{placeholder}</span>;
  // 해금은 됐는데 값이 아직 없는 항목(궁합 까닭 생성 지연)은 비용 없이 다시 연다(WKS-BE §10.4).
  const pillLabel = field.isLocked && field.cost === 0 ? `${label} 다시 열기` : null;

  return (
    <div className={isBlock ? 'flex flex-col gap-8' : 'relative flex items-center gap-8'}>
      <dt className="shrink-0 text-neutral-200">{label}</dt>
      {field.isLocked ? (
        onUnlock ? (
          <dd className="min-w-0 flex-1">
            {/* 한 줄 항목의 알약은 글줄이 아니라 카드 가운데에 둔다 — 사진·궁합 이유 알약과 한 줄로(Figma 112:3241). */}
            <LockedValue
              className={isBlock ? undefined : 'static'}
              label={
                pillLabel ?? (
                  <>
                    {label} <CostText cost={field.cost} listed={listed} />
                    개로 열기
                  </>
                )
              }
              onUnlock={onUnlock}
            >
              {fake}
            </LockedValue>
          </dd>
        ) : (
          <dd>
            <span aria-hidden="true" className="blur-sm select-none">
              {fake}
            </span>
            <span className="sr-only">잠겨 있어요 · 운명의 실 {field.cost}개로 열 수 있어요</span>
          </dd>
        )
      ) : (
        // 띄어쓰기 없는 긴 궁합 이유도 카드 폭 안에서 줄을 바꾸고(앞면 자기소개와 같다), 백엔드 문장의 줄바꿈은 그대로 둔다.
        <dd className="min-w-0 font-medium wrap-anywhere break-keep whitespace-pre-line text-neutral-0">
          {field.value}
        </dd>
      )}
    </div>
  );
}
