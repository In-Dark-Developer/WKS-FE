import { useState } from 'react';

import { cn } from '@/lib/cn';
import { Button } from '@/ui/Button';
import { Toast } from '@/ui/Toast';

import { shareLinkMessages } from './messages';
import { shareLink } from './shareLink';
import { buildShareUrl } from './shareUrl';

type Props = {
  // 결과 응답의 공개 UUID. 응답 스키마를 알 필요가 없도록 값만 받는다 (공지 publishing-first).
  shareId: string;
  nickname: string;
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'apricot';
  // Figma 결과 화면(713:4021)의 CTA 는 높이 48(size m)이다. 기본은 Button 과 같은 l.
  size?: 'm' | 'l';
  className?: string;
};

// SCR-04 결과 화면·SCR-08 궁합 지도의 '친구에게 공유' (FR-4).
// 공유 시트 → 클립보드 복사 → 링크 직접 노출 순으로 물러난다.
export function ShareLinkButton({
  shareId,
  nickname,
  variant = 'secondary',
  size = 'l',
  className,
}: Props) {
  const [sharing, setSharing] = useState(false);
  // 복사가 막힌 동안에는 링크를 계속 보여준다 — Toast 는 잠깐 뒤 스스로 사라진다.
  const [showLink, setShowLink] = useState(false);
  const [toast, setToast] = useState<'copied' | 'manual' | null>(null);
  const url = buildShareUrl(shareId);

  async function share() {
    setSharing(true);
    try {
      const outcome = await shareLink(url, {
        title: shareLinkMessages.shareTitle,
        text: shareLinkMessages.shareText(nickname),
      });
      setShowLink(outcome === 'manual');
      setToast(outcome === 'copied' || outcome === 'manual' ? outcome : null);
    } finally {
      setSharing(false);
    }
  }

  function handleShare() {
    void share();
  }

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <Button
        loading={sharing}
        loadingLabel={shareLinkMessages.sharing}
        onClick={handleShare}
        size={size}
        variant={variant}
      >
        {shareLinkMessages.button}
      </Button>

      {showLink ? (
        <label className="flex flex-col gap-4">
          <span className="text-ui-12 font-medium text-muted">{shareLinkMessages.manualLabel}</span>
          <input
            className="rounded-12 border border-default bg-surface-subtle px-12 py-8 text-ui-14 text-primary"
            onFocus={(event) => event.currentTarget.select()}
            readOnly
            value={url}
          />
        </label>
      ) : null}

      <Toast
        message={toast === 'manual' ? shareLinkMessages.manual : shareLinkMessages.copied}
        onClose={() => setToast(null)}
        open={toast !== null}
      />
    </div>
  );
}
