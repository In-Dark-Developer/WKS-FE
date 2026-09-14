import { useRef, useState } from 'react';

import instagramIcon from '@/ui/assets/icons/instagram.svg';
import { Button } from '@/ui/Button';
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

// 결과 화면(SCR-04)의 운명 카드와 그 아래 '인스타 스토리 공유하기'(FR-5). '카드 뒤집기'는 카드 자신이 갖고 있다.
// 인연카드 전용 화면은 결과 화면에 합쳤다(2026-09-15, 04/T7).
//
// 치수는 Figma 「UI 최종 - 개발용」 결과 화면 Frame 93(713:4021):
//   카드 343×461 · 인스타 버튼 713:4070 = Action/Teal/Default · 높이 48 · radius 12 ·
//   UI/16/600 · instagram 아이콘 24 + 간격 8 · 카드 아래 20.
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
        <ConnectionCard {...card} initialFace="back" />
      </div>

      <Button
        leadingIcon={<Icon src={instagramIcon} />}
        loading={making}
        loadingLabel={cardMessages.making}
        onClick={handleShareStory}
        size="m"
        variant="accent"
      >
        {cardMessages.story}
      </Button>

      {failed ? (
        <p className="text-ui-14 text-status-error-foreground" role="alert">
          {cardMessages.failed}
        </p>
      ) : null}

      <Toast message={notice ?? ''} onClose={() => setNotice(null)} open={notice !== null} />
    </div>
  );
}
