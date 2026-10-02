import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';

import { FEEDBACK_MAX_LENGTH, submitFeedback } from '@/api/feedbacks';
import coffee from '@/ui/assets/closing/coffee.webp';
import { Button } from '@/ui/Button';
import { OverlayBackdrop, useOverlayBehavior } from '@/ui/Modal';
import { Toast } from '@/ui/Toast';

// '커피 사주기'가 복사하는 계좌(2026-10-03 소유자 전달). 은행 앱 입력란에 그대로 붙도록 숫자만 복사한다.
const COFFEE_BANK = '국민은행';
const COFFEE_ACCOUNT = '28370204038174';

type View = 'notice' | 'coffee' | 'feedback';

type Props = {
  // 미리보기가 모달·피드백 화면을 바로 열 때만 넘긴다.
  initialView?: View;
};

// 사이트 종료 화면 — Figma v1.0 「0. 메인 진입 티저」 종료판 세 장(610:2717 안내 · 610:2742 커피 모달 · 610:2777 피드백).
// 배경은 AppShell 의 dawn 이다. 간격은 375 × 812 프레임 기준(콘텐츠 여백 16 을 뺀 값).
export function SiteClosed({ initialView = 'notice' }: Props) {
  const [view, setView] = useState<View>(initialView);
  const [toast, setToast] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const closeToast = useCallback(() => setToast(null), []);
  const closeCoffee = useCallback(() => setView('notice'), []);
  // 피드백 화면은 기록을 한 칸 쌓는다 — 휴대폰 뒤로가기가 사이트를 떠나지 않고 안내로 돌아온다.
  const pushedFeedback = useRef(false);

  useEffect(() => {
    function handlePopState() {
      pushedFeedback.current = false;
      setView('notice');
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function openFeedback() {
    // 미리보기는 라우터 위에서 그린다 — 라우터가 둔 state 를 그대로 옮겨 쌓는다.
    window.history.pushState(window.history.state, '');
    pushedFeedback.current = true;
    setView('feedback');
  }

  // 실패하면 피드백 화면에 남아 적은 글을 그대로 다시 보낼 수 있다.
  async function sendFeedback(content: string) {
    setIsSending(true);
    const outcome = await submitFeedback(content);
    setIsSending(false);
    if (!outcome.ok) {
      console.error('피드백을 보내지 못했다', outcome.error);
      setToast('피드백 실을 보내지 못했어요\n잠시 뒤 다시 전달해 주세요');
      return;
    }
    setToast('피드백 실이 잘 전달됐어요');
    leaveFeedback();
  }

  // 쌓은 칸이 있으면 뒤로 가서 popstate 가 안내로 돌린다. 미리보기처럼 바로 연 피드백은 칸이 없다.
  function leaveFeedback() {
    if (pushedFeedback.current) window.history.back();
    else setView('notice');
  }

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(COFFEE_ACCOUNT);
      setToast(`계좌번호를 복사했어요\n${COFFEE_BANK} ${COFFEE_ACCOUNT}`);
    } catch {
      // 클립보드를 못 쓰는 브라우저 — 번호를 보여 주기만 한다.
      setToast(`${COFFEE_BANK} ${COFFEE_ACCOUNT}`);
    }
  }

  return (
    <>
      {view === 'feedback' ? (
        <ClosingFeedback isSending={isSending} onSubmit={(text) => void sendFeedback(text)} />
      ) : (
        <ClosingNotice onConnected={() => setView('coffee')} onFeedback={openFeedback} />
      )}
      <CoffeeModal onClose={closeCoffee} onCopy={copyAccount} open={view === 'coffee'} />
      <Toast
        className="text-center whitespace-pre-line"
        message={toast}
        onClose={closeToast}
        open={toast !== null}
      />
    </>
  );
}

type NoticeProps = { onFeedback: () => void; onConnected: () => void };

// 610:2717 — 제목 top 259 · 부제 top 337 · 버튼 top 497 · 밑줄 글 bottom 585.
function ClosingNotice({ onFeedback, onConnected }: NoticeProps) {
  return (
    <section
      aria-labelledby="site-closed-title"
      className="flex flex-col items-center pt-[243px] text-center"
    >
      <header className="flex flex-col items-center gap-40">
        <h1 className="font-display text-display-28 text-primary" id="site-closed-title">
          운명도 꿰어야 사랑이다
        </h1>
        <p className="text-ui-16 font-medium whitespace-pre-line text-primary-900">
          {
            '동국대학교 대동제 기간\n많은 관심 가져주셔서 감사합니다.\n\n운명의 실, 잠시 정비하고 다음 축제에\n더 좋은 인연으로 다시 돌아올게요.'
          }
        </p>
      </header>
      <Button className="mt-40 w-full" onClick={onFeedback} variant="apricot">
        다음을 위한 피드백 남기기
      </Button>
      <button
        className="mt-[14px] text-ui-12 text-secondary underline"
        onClick={onConnected}
        type="button"
      >
        혹시 운명과 이어지셨나요?
      </button>
    </section>
  );
}

// 610:2777 — 제목 top 81 · 부제 top 131 · 입력 카드 top 202(343 × 251) · 버튼 top 476.
type FeedbackProps = { isSending: boolean; onSubmit: (text: string) => void };

function ClosingFeedback({ isSending, onSubmit }: FeedbackProps) {
  const [text, setText] = useState('');
  const trimmed = text.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (trimmed && !isSending) onSubmit(trimmed);
  }

  return (
    <form aria-labelledby="site-feedback-title" className="pt-[65px]" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-12">
        <h1 className="font-display text-display-28 text-primary" id="site-feedback-title">
          운명도 꿰어야 사랑이다
        </h1>
        <p className="text-ui-16 font-medium whitespace-pre-line text-primary-900">
          {'자유롭게 피드백 부탁드립니다.\n잘 반영하여 다음 축제에 돌아오겠습니다.'}
        </p>
      </header>
      {/* 디자인시스템 TextArea(테두리·16px·카운터)와 달라 카드 모양을 직접 그린다. */}
      <textarea
        aria-label="피드백"
        className="mt-[23px] block h-[251px] w-full resize-none rounded-16 bg-surface-default px-12 py-16 text-ui-14 font-medium text-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)] outline-none placeholder:text-primary focus-visible:outline-2 focus-visible:outline-focus"
        maxLength={FEEDBACK_MAX_LENGTH}
        onChange={(event) => setText(event.target.value)}
        placeholder="피드백을 입력해주세요."
        value={text}
      />
      <Button
        className="mt-[23px] w-full"
        disabled={!trimmed}
        loading={isSending}
        loadingLabel="피드백 실 전달 중"
        type="submit"
        variant="apricot"
      >
        피드백 실 전달하기
      </Button>
    </form>
  );
}

type CoffeeProps = { open: boolean; onClose: () => void; onCopy: () => void };

// 610:2752 — 검은 막 위 가운데 카드. 닫기 버튼은 디자인에 없어 배경을 누르거나 ESC 로 닫는다.
function CoffeeModal({ open, onClose, onCopy }: CoffeeProps) {
  const { panelRef, titleId } = useOverlayBehavior(open, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-16">
      <OverlayBackdrop onClose={onClose} />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="relative flex w-full max-w-[343px] flex-col items-center gap-[27px] rounded-16 bg-surface-default px-16 py-32 text-center shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <h2 className="font-display text-display-20 text-apricot-900" id={titleId}>
          연결을 진심으로 축하드립니다.
        </h2>
        <p className="text-ui-14 font-medium text-primary">
          개발자에게 커피 한 잔 사주시면 감사드리겠습니다.
        </p>
        <img alt="" className="h-[125px] w-[127px] object-cover" draggable={false} src={coffee} />
        <button
          className="w-[152px] rounded-8 bg-action-primary-default px-16 py-8 text-ui-12 font-medium text-inverse hover:bg-action-primary-hover active:bg-action-primary-pressed"
          onClick={onCopy}
          type="button"
        >
          커피 사주기
        </button>
      </div>
    </div>,
    document.body,
  );
}
