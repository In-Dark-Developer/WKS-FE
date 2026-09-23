import type { ReactNode } from 'react';

import { BlurredPhoto } from '@/ui/BlurredPhoto';
import { LockedValue } from '@/ui/LockedValue';

import type { CandidatePhoto, LockableField } from '../recommendation/cardsView';

// 인연 카드의 사진·앞면·뒷면 내용 — 오늘의 인연(SCR-17)과 요청함 상세(SCR-20)가 ProfileCard 슬롯에 같이 쓴다.

export function CandidatePhotoLayer({ photo }: { photo: CandidatePhoto }) {
  return (
    <BlurredPhoto
      alt={photo.isLocked ? '흐리게 가린 인연 사진' : '인연 사진'}
      className="size-full"
      isBlurred={photo.isLocked}
      src={photo.isLocked ? photo.thumbnailUrl : photo.url}
    />
  );
}

type FrontProps = {
  // 추천 순위 — 받은 신청처럼 순위가 없는 카드는 null.
  rank: number | null;
  relationLabel: string;
  mbti: string | null;
  // 궁합 점수 — 보이지 않기로 한 카드(받은 신청, Q17 미정)는 null.
  score: number | null;
  bio: string;
  // 자기소개 아래 버튼 줄(요청함 상세).
  footer?: ReactNode;
};

// 앞면 — 순위·관계 유형·MBTI·점수·자기소개(Figma 96:1876).
export function CandidateFront({ rank, relationLabel, mbti, score, bio, footer }: FrontProps) {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-8">
            {rank === null ? null : (
              <span className="rounded-999 bg-neutral-700 px-16 text-ui-12 text-neutral-100">
                Top{rank}
              </span>
            )}
            <p className="font-sungkok text-display-24 text-neutral-0">{relationLabel}</p>
          </div>
          {mbti ? (
            <p className="flex items-center gap-12">
              <span className="text-ui-12 text-neutral-200">MBTI</span>
              <span className="font-sungkok text-ui-14 text-neutral-0">{mbti}</span>
            </p>
          ) : null}
        </div>
        {score === null ? null : (
          <p
            aria-label={`궁합 점수 ${score}점`}
            className="flex size-48 items-center justify-center rounded-999 border border-neutral-300 font-display text-display-32 text-neutral-0"
          >
            {score}
          </p>
        )}
      </div>
      <p className="text-ui-12 break-keep text-neutral-0">{bio}</p>
      {footer ? <div className="flex justify-center gap-16">{footer}</div> : null}
    </div>
  );
}

type BackProps = {
  photo: CandidatePhoto;
  name: LockableField<string>;
  department: LockableField<string>;
  reason: LockableField<string>;
  // 해금 모달을 연다. 없으면(운명의 실을 보낸 뒤, FR-29) 잠긴 항목은 흐리게만 보인다.
  onUnlock?: () => void;
};

// 뒷면 — 이름·학과·궁합 이유(Figma 103:2543).
// 아무것도 열지 않았으면 '열람하기' 하나(103:2533), 일부를 열었으면 잠긴 항목마다 자물쇠 알약(112:3241)을 둔다.
export function CandidateBack({ photo, name, department, reason, onUnlock }: BackProps) {
  const isNothingOpened = [photo, name, department, reason].every((field) => field.isLocked);
  const rowUnlock = onUnlock && !isNothingOpened ? onUnlock : undefined;

  return (
    <div className="flex h-full flex-col justify-end gap-24 px-24 pt-48 pb-24">
      {rowUnlock && photo.isLocked ? (
        <LockedValue
          className="absolute top-[113px] left-1/2 -translate-x-1/2"
          label={`사진 ${photo.cost}개로 열기`}
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
      <dl className="flex flex-col gap-8 text-ui-12">
        <BackRow field={name} label="이름" onUnlock={rowUnlock} placeholder="○○○" />
        <BackRow field={department} label="학과" onUnlock={rowUnlock} placeholder="○○○○○○학과" />
        <BackRow
          field={reason}
          isBlock
          label="궁합 이유"
          onUnlock={rowUnlock}
          placeholder="두 사람의 사주가 서로를 채워 주는 까닭이 여기에 적혀 있어요. 운명의 실로 열어 보세요."
        />
      </dl>
    </div>
  );
}

type BackRowProps = {
  label: string;
  field: LockableField<string>;
  // 잠긴 항목 자리에 흐리게 보일 가짜 글 — 실제 값이 아니다.
  placeholder: string;
  isBlock?: boolean;
  onUnlock?: () => void;
};

function BackRow({ label, field, placeholder, isBlock = false, onUnlock }: BackRowProps) {
  const fake = <span className="font-medium text-neutral-0">{placeholder}</span>;

  return (
    <div className={isBlock ? 'flex flex-col gap-8' : 'flex items-center gap-8'}>
      <dt className="shrink-0 text-neutral-200">{label}</dt>
      {field.isLocked ? (
        onUnlock ? (
          <dd className="min-w-0 flex-1">
            <LockedValue label={`${label} ${field.cost}개로 열기`} onUnlock={onUnlock}>
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
        <dd className="font-medium text-neutral-0">{field.value}</dd>
      )}
    </div>
  );
}
