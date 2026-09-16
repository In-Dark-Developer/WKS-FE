import { createPortal } from 'react-dom';

import { Button } from '@/ui/Button';
import { OverlayBackdrop, useOverlayBehavior } from '@/ui/Modal';

type Props = { open: boolean; onClose: () => void };

// Figma 이용약관 시트(695:2753) 본문 그대로다 — 법적 고지라 문구를 바꾸지 않는다. 기획이 고치면 여기만 고친다.
const sections = [
  {
    heading: '[서비스 이용 안내]',
    body: '본 서비스는 이용자가 입력한 생년월일시를 바탕으로 사주 정보를 확인하고, 이를 활용한 운세 및 인연 관련 콘텐츠를 제공하는 서비스입니다.',
  },
  {
    heading: '[개인정보 보호 안내]',
    body: '입력하신 생년월일시 등 개인정보는 사주 결과 제공 및 서비스 운영을 위한 목적으로만 사용됩니다. 수집된 정보는 관련 법령 및 개인정보처리방침에 따라 안전하게 관리되며, 이용자의 동의 없이 서비스 목적 외의 용도로 사용하거나 제3자에게 제공하지 않습니다.',
  },
  {
    heading: '[사주 결과 이용 안내]',
    body: '본 서비스에서 제공하는 사주 및 운세 결과는 전통적인 사주 해석을 바탕으로 한 오락·콘텐츠 목적의 참고 정보입니다. 결과는 미래의 사실이나 개인의 상황을 확정적으로 예측하거나 보장하지 않으며, 결과에 따른 개인의 선택과 판단에 대해 서비스는 책임을 지지 않습니다. 특히 연애, 재산, 학업, 진로 등 중요한 의사결정은 본 서비스의 결과만을 근거로 판단하지 마시기 바랍니다.',
  },
] as const;

// 사주 입력(SCR-02)·사전신청(SCR-09) 두 화면이 함께 여는 약관 시트 — Modal 과 같은 포커스 트랩·ESC·
// 스크롤 잠금을 쓰고 화면 아래에서 올라온다(ShareSheet 와 같은 틀).
export function TermsSheet({ open, onClose }: Props) {
  const { panelRef, titleId } = useOverlayBehavior(open, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <OverlayBackdrop onClose={onClose} />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="relative flex max-h-[80vh] w-full max-w-[400px] flex-col gap-24 overflow-y-auto rounded-t-20 bg-surface-default px-16 py-8"
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        {/* 시트 손잡이 — 끌어 내리는 조작은 없고 모양만 디자인(695:2768)과 맞춘다. */}
        <div aria-hidden="true" className="mx-auto mt-8 h-4 w-48 rounded-999 bg-neutral-100" />
        <h2 className="text-ui-18 font-semibold text-primary" id={titleId}>
          이용약관 / 개인정보 및 사주 결과 안내
        </h2>
        <div className="flex flex-col gap-16 text-ui-12 font-medium text-primary">
          {sections.map(({ heading, body }) => (
            <section className="flex flex-col" key={heading}>
              <h3>{heading}</h3>
              <p>{body}</p>
            </section>
          ))}
        </div>
        <Button onClick={onClose} size="l">
          확인
        </Button>
      </div>
    </div>,
    document.body,
  );
}
