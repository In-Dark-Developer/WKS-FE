import { useState } from 'react';

import type { PreviewScreen } from '@/app/preview/previewScreen';
import instagramIcon from '@/ui/assets/icons/instagram.svg';
import { Button } from '@/ui/Button';
import { Modal } from '@/ui/Modal';
import { ShareSheet } from '@/ui/ShareSheet';
import { Toast } from '@/ui/Toast';

// 02/T3 — 버튼으로 열어서 포커스 트랩·ESC 닫기·배경 스크롤 잠금·자동 닫힘을 직접 확인한다.
function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-16">
      <Button onClick={() => setOpen(true)}>Modal 열기</Button>
      <Modal onClose={() => setOpen(false)} open={open} title="예시 모달">
        <p className="text-ui-14 text-secondary">
          Tab 으로 포커스가 안에서만 도는지, Escape·배경 클릭으로 닫히는지, 뒤 화면 스크롤이
          잠기는지 확인한다.
        </p>
        <Button className="mt-16" onClick={() => setOpen(false)}>
          확인
        </Button>
      </Modal>
    </div>
  );
}

function ShareSheetDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-16">
      <Button onClick={() => setOpen(true)}>ShareSheet 열기</Button>
      {selected ? <p className="text-ui-14 text-secondary">선택함: {selected}</p> : null}
      <ShareSheet
        onClose={() => setOpen(false)}
        open={open}
        options={[
          {
            id: 'instagram',
            icon: instagramIcon,
            label: '인스타 스토리 공유하기',
            onSelect: () => setSelected('인스타 스토리 공유하기'),
          },
          {
            id: 'copy',
            icon: instagramIcon,
            label: '링크 복사',
            onSelect: () => setSelected('링크 복사'),
          },
        ]}
      />
    </div>
  );
}

function ToastDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-16">
      <Button onClick={() => setOpen(true)}>Toast 띄우기(3초 뒤 자동으로 사라짐)</Button>
      <Toast message="복사되었습니다" onClose={() => setOpen(false)} open={open} />
    </div>
  );
}

export const preview: PreviewScreen = {
  title: '오버레이 확인 (Modal·ShareSheet·Toast)',
  order: 5,
  states: { Modal: ModalDemo, ShareSheet: ShareSheetDemo, Toast: ToastDemo },
};
