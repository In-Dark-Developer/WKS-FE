import { useRef, useState } from 'react';

import downloadIcon from '@/ui/assets/icons/download.svg';
import spinnerIcon from '@/ui/assets/icons/spinner.svg';
import type { Grade } from '@/ui/DestinyCard';
import { Icon } from '@/ui/Icon';
import { Toast } from '@/ui/Toast';
import type { Zodiac } from '@/ui/ZodiacCharacter';

import { ConnectionCard } from './ConnectionCard';
import { cardMessages } from './messages';
import { shareCardImage } from './shareCardImage';

type Props = {
  nickname: string;
  zodiac: Zodiac;
  title: string;
  description: string;
  grades: readonly { label: string; grade: Grade }[];
};

// 결과 화면(SCR-04)의 운명 카드와 카드 앞면 오른쪽 아래의 '카드 저장하기' 아이콘(FR-5, Figma v1.0 사주 카드 화면
// 8:794 · 아이콘 58:2523 — 2026-09-27 QA 로 카드 아래 버튼에서 옮김, 09/T11). '카드 뒤집기'는 카드 자신이 갖고 있다.
// 인연카드 전용 화면은 결과 화면에 합쳤다(2026-09-15, 04/T7).
export function ResultCard(card: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const [making, setMaking] = useState(false);
  const [failed, setFailed] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function shareStory() {
    // 이미지에는 앞면만 담는다 — 뒷면이 보이는 중이어도 앞면 DOM 은 있다. 뒤집기 버튼과 뒷면은 카드 밖이다.
    const front = holder.current?.querySelector('[data-destiny-card]');
    if (!(front instanceof HTMLElement)) return;

    setMaking(true);
    setFailed(false);
    try {
      if ((await shareCardImage(front, card.nickname)) === 'saved') {
        setNotice(cardMessages.saved);
      }
    } catch {
      // 원인은 사용자에게 보이지 않는다 (docs/CONVENTIONS.md 7장).
      setFailed(true);
    } finally {
      setMaking(false);
    }
  }

  function handleShareStory() {
    void shareStory();
  }

  return (
    <div className="flex flex-col gap-20">
      <div ref={holder}>
        {/* 결과 화면에 들어오면 뒷면부터 보이고 '카드 뒤집기'로 앞면을 연다 (PRD FR-5). */}
        <ConnectionCard
          {...card}
          frontAction={
            <button
              aria-busy={making || undefined}
              aria-label={making ? cardMessages.making : cardMessages.save}
              className="flex size-[44px] items-center justify-center text-brand disabled:cursor-progress"
              disabled={making}
              onClick={handleShareStory}
              type="button"
            >
              <Icon
                className={making ? 'animate-spin' : undefined}
                src={making ? spinnerIcon : downloadIcon}
              />
            </button>
          }
          initialFace="back"
        />
      </div>

      {failed ? (
        <p className="text-ui-14 text-status-error-foreground" role="alert">
          {cardMessages.failed}
        </p>
      ) : null}

      <Toast message={notice ?? ''} onClose={() => setNotice(null)} open={notice !== null} />
    </div>
  );
}
