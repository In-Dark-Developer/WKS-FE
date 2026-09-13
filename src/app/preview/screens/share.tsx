import { useEffect, useState } from 'react';

import type { PreviewScreen } from '@/app/preview/previewScreen';
import { ShareLinkButton } from '@/features/share';

// 브라우저마다 다른 분기를 개발 서버에서 강제로 보려고, 화면이 떠 있는 동안만
// navigator.share·clipboard 를 갈아 끼운다. 상태를 떠날 때 원래대로 돌린다.
type Capability = 'sheet' | 'clipboard' | 'none';

type SharePayload = { title?: string; text?: string; url?: string };

function useCapability(capability: Capability, onShare: (data: SharePayload) => void): void {
  useEffect(() => {
    const original = {
      share: Object.getOwnPropertyDescriptor(navigator, 'share'),
      clipboard: Object.getOwnPropertyDescriptor(navigator, 'clipboard'),
    };
    const set = (key: 'share' | 'clipboard', value: unknown) =>
      Object.defineProperty(navigator, key, { value, configurable: true, writable: true });

    if (capability === 'sheet') {
      set('share', (data: SharePayload) => {
        onShare(data);
        return Promise.resolve();
      });
    } else {
      Reflect.deleteProperty(navigator, 'share');
    }

    if (capability === 'clipboard') {
      set('clipboard', { writeText: () => Promise.resolve() });
    } else if (capability === 'none') {
      set('clipboard', { writeText: () => Promise.reject(new Error('denied')) });
    }

    return () => {
      Reflect.deleteProperty(navigator, 'share');
      Reflect.deleteProperty(navigator, 'clipboard');
      if (original.share) Object.defineProperty(navigator, 'share', original.share);
      if (original.clipboard) Object.defineProperty(navigator, 'clipboard', original.clipboard);
    };
  }, [capability, onShare]);
}

function Demo({ capability, hint }: { capability: Capability; hint: string }) {
  const [shared, setShared] = useState<SharePayload | null>(null);
  useCapability(capability, setShared);

  return (
    <div className="flex flex-col gap-16">
      <p className="text-ui-14 text-secondary">{hint}</p>
      <ShareLinkButton nickname="달빛토끼" shareId="9f0d3f1e-0000-4000-8000-000000000001" />
      {shared ? (
        <dl className="flex flex-col gap-4 rounded-12 bg-surface-subtle p-16 text-ui-12 text-secondary">
          <dt className="font-medium text-primary">공유 시트로 넘어간 값</dt>
          <dd>title: {shared.title}</dd>
          <dd>text: {shared.text}</dd>
          <dd>url: {shared.url}</dd>
        </dl>
      ) : null}
    </div>
  );
}

function SheetState() {
  return <Demo capability="sheet" hint="공유 시트를 지원하는 브라우저 — 시트로 넘기고 끝난다." />;
}

function ClipboardState() {
  return (
    <Demo capability="clipboard" hint="공유 시트가 없는 브라우저 — 클립보드에 복사하고 알린다." />
  );
}

function ManualState() {
  return <Demo capability="none" hint="복사까지 막힌 경우 — 링크를 직접 고를 수 있게 보여준다." />;
}

// SCR-04·SCR-08 의 '친구에게 공유' (FR-4) — 04/T3.
export const preview: PreviewScreen = {
  title: 'FR-4 친구에게 공유',
  order: 3,
  states: { '공유 시트': SheetState, '링크 복사': ClipboardState, '링크 직접 노출': ManualState },
};
