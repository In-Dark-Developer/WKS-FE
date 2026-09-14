// 인연카드를 인스타 스토리에 올릴 PNG 로 만든다 (FR-5 의 재료).
// 방식과 기각한 대안은 docs/decisions/ADR-20260914-card-image-rendering.md 에 있다.

// 인스타 스토리 규격.
const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;
// 스토리 안에서 카드가 차지할 폭 — 좌우 여백이 남도록 80%.
const CARD_WIDTH = Math.round(STORY_WIDTH * 0.8);
// 배경은 결과 화면 밤하늘과 같은 계열로 둔다 — 색은 토큰에서 읽는다 (CONVENTIONS 4장).
const BACKGROUND =
  'linear-gradient(180deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%)';

export type StoryFrame = {
  frame: HTMLElement;
  remove: () => void;
};

// 화면 밖에 스토리 규격 프레임을 만들고 카드 **사본**을 가운데 놓는다.
// 원본 카드는 건드리지 않는다 — 사용자가 보고 있는 화면이 흔들리면 안 된다.
export function buildStoryFrame(card: HTMLElement): StoryFrame {
  const frame = document.createElement('div');
  frame.dataset.storyFrame = '';
  Object.assign(frame.style, {
    position: 'fixed',
    top: '0',
    // 화면 밖에 두되 display:none 은 쓰지 않는다 — 레이아웃이 잡혀야 찍을 수 있다.
    left: `${-STORY_WIDTH * 2}px`,
    width: `${STORY_WIDTH}px`,
    height: `${STORY_HEIGHT}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: BACKGROUND,
    pointerEvents: 'none',
  });

  const clone = card.cloneNode(true);
  if (clone instanceof HTMLElement) {
    clone.style.width = `${CARD_WIDTH}px`;
    // 카드 CSS 의 aspect-ratio 가 높이를 잡는다.
    clone.style.height = 'auto';
  }
  frame.append(clone);
  document.body.append(frame);

  return {
    frame,
    remove: () => frame.remove(),
  };
}

// html-to-image 는 프레임의 계산된 스타일을 사본에 그대로 옮긴다. 화면 밖 위치(left 음수)까지 옮기면
// SVG 안에서 내용이 캔버스 밖에 그려져 투명한 PNG 가 나온다 — 찍는 사본에서만 제자리로 되돌린다.
const CAPTURE_STYLE: Partial<CSSStyleDeclaration> = { position: 'static', left: '0', top: '0' };

// 방금 붙인 사본의 이미지(십이간지 캐릭터·등급 스탬프)는 아직 디코딩 전이라 그대로 찍으면 빠진다.
// 깨진 이미지 하나 때문에 공유 전체가 막히지 않도록 디코딩 실패는 넘긴다.
async function waitForImages(frame: HTMLElement): Promise<void> {
  const images = [...frame.querySelectorAll('img')];
  await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
}

export async function renderCardImage(card: HTMLElement): Promise<Blob> {
  const { frame, remove } = buildStoryFrame(card);
  try {
    await waitForImages(frame);
    // 초기 번들에 넣지 않는다 — 공유를 누른 사람만 받는다 (NFR-2 250KB gzip).
    const { toBlob } = await import('html-to-image');
    // backgroundColor 는 넘기지 않는다 — 프레임 자신이 불투명한 토큰 그라데이션을 갖고 있어
    // 그대로 찍히고, 여기에 색을 적으면 토큰과 따로 노는 값이 하나 더 생긴다.
    const options = {
      width: STORY_WIDTH,
      height: STORY_HEIGHT,
      pixelRatio: 1,
      style: CAPTURE_STYLE,
    };
    // WebKit(iOS Safari·카카오톡 인앱)은 SVG 안에 넣은 이미지(배경·캐릭터)를 첫 그리기에 싣지 못해
    // 처음 한 장은 카드 틀과 글자만 나온다. 한 번 버리고 두 번째를 쓴다.
    await toBlob(frame, options);
    const blob = await toBlob(frame, options);
    if (!blob) throw new Error('카드 이미지를 만들지 못했다');
    return blob;
  } finally {
    remove();
  }
}

export function cardImageFileName(nickname: string): string {
  // 파일 이름에 쓸 수 없는 문자를 지운다 — 저장 폴백(FR-16)이 그대로 쓴다.
  const safe = nickname.replace(/[\\/:*?"<>|]/g, '').trim();
  return `${safe || '인연카드'}-인연카드.png`;
}
