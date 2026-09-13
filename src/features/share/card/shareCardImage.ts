import { cardImageFileName, renderCardImage } from '@/lib/cardImage';

// 카드 PNG 를 내보낸 결과. 저장(FR-16)은 실패가 아니라 폴백이다.
export type CardShareOutcome =
  // OS 공유 시트에 파일을 넘겼다
  | 'shared'
  // 사용자가 공유 시트를 직접 닫았다
  | 'cancelled'
  // 파일 공유가 없어 기기에 내려받았다
  | 'saved';

function isAbortError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('name' in error)) return false;
  return error.name === 'AbortError';
}

function saveFile(file: File): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  // Safari 는 문서에 붙지 않은 a 의 click 을 무시한다.
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// FR-5 '인스타 스토리 공유하기' · FR-16 폴백.
// 파일 공유를 지원하면 공유 시트로, 아니면 같은 PNG 를 기기에 저장한다.
export async function shareCardImage(
  card: HTMLElement,
  nickname: string,
): Promise<CardShareOutcome> {
  const blob = await renderCardImage(card);
  const file = new File([blob], cardImageFileName(nickname), { type: 'image/png' });

  const canShareFiles =
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] });

  if (canShareFiles) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (error) {
      if (isAbortError(error)) return 'cancelled';
      // 파일 공유가 막힌 것이니 저장으로 물러난다 (FR-16).
    }
  }

  saveFile(file);
  return 'saved';
}
