import { useRef, useState } from 'react';

import { Button } from '@/ui/Button';
import type { Grade } from '@/ui/DestinyCard';
import { Toast } from '@/ui/Toast';
import type { Zodiac } from '@/ui/ZodiacCharacter';

import { ShareLinkButton } from '../link/ShareLinkButton';
import { ConnectionCard } from './ConnectionCard';
import { cardMessages } from './messages';
import { shareCardImage } from './shareCardImage';

type Props = {
  nickname: string;
  zodiac: Zodiac;
  title: string;
  description: string;
  grades: readonly { label: string; grade: Grade }[];
  // 공유 링크 재료. 응답 스키마를 모르도록 값만 받는다 (공지 publishing-first).
  shareId: string;
};

// SCR-05 인연카드 화면 — 카드(04/T2) 아래에 '인스타 스토리 공유하기'(FR-5)와
// '친구에게 공유'(04/T3, FR-4)를 둔다. '카드 뒤집기'는 카드 자신이 갖고 있다.
export function ConnectionCardScreen({ shareId, ...card }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const [making, setMaking] = useState(false);
  const [failed, setFailed] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function shareStory() {
    // 이미지에는 앞면만 담는다 — 뒤집기 버튼과 뒷면은 카드 밖이다.
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
        <ConnectionCard {...card} />
      </div>

      <div className="flex flex-col gap-8">
        <Button
          loading={making}
          loadingLabel={cardMessages.making}
          onClick={handleShareStory}
          variant="apricot"
        >
          {cardMessages.story}
        </Button>
        <ShareLinkButton nickname={card.nickname} shareId={shareId} />
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
