import { Modal } from '@/ui/Modal';

import type { PreRegisterValues } from './formSchema';
import { PreRegisterForm } from './PreRegisterForm';

type Props = {
  open: boolean;
  // 닫기 버튼·ESC·배경·완료 화면의 '확인' 모두 여기로 온다 — 라우트를 되돌리는 일은 조립하는 쪽이 한다.
  onClose: () => void;
  defaultValues?: Partial<PreRegisterValues>;
};

// SCR-09 사전신청 모달 — 02/T3 Modal(포커스 트랩·ESC·배경 스크롤 잠금) 안에 본문(PreRegisterForm)을 넣는다.
// 수정본(695:2614)은 화면 전체를 쓰는 긴 폼이라 모달 패널을 화면 폭 가득·세로 스크롤로 쓴다.
export function PreRegisterModal({ open, onClose, defaultValues }: Props) {
  return (
    <Modal
      aria-label="사전신청"
      className="max-w-[430px] bg-surface-brand px-16"
      onClose={onClose}
      open={open}
    >
      <PreRegisterForm defaultValues={defaultValues} onDone={onClose} />
    </Modal>
  );
}
