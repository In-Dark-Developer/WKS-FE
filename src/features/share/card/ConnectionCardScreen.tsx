import { useRef, useState } from 'react';

import instagramIcon from '@/ui/assets/icons/instagram.svg';
import { Button } from '@/ui/Button';
import type { Grade } from '@/ui/DestinyCard';
import { Icon } from '@/ui/Icon';
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
//
// 치수는 Figma 「UI 최종 - 개발용」 결과 화면 Frame 93(713:4021)에서 가져왔다 — 그 화면이
// 카드와 인스타 공유 버튼이 함께 놓인 유일한 근거다(인연카드 전용 화면은 디자인에 없다):
//   카드 y=23·343×461 · 인스타 버튼 713:4070 = Action/Teal/Default · 높이 48 · radius 12 ·
//   UI/16/600 · instagram 아이콘 24 + 간격 8 · 카드 아래 20.
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
    // pt-8 은 앱 셸의 16 과 합쳐 Figma 의 카드 top 23 이 된다.
    <div className="flex flex-col gap-20 pt-8 pb-24">
      <h1 className="sr-only">{card.nickname}님의 인연카드</h1>

      <div ref={holder}>
        <ConnectionCard {...card} />
      </div>

      <div className="flex flex-col gap-8">
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
        <ShareLinkButton nickname={card.nickname} shareId={shareId} size="m" />
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
