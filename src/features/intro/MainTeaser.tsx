import orbs from '@/ui/assets/teaser/orbs.webp';
import { Button } from '@/ui/Button';

type Props = {
  onViewSaju: () => void;
  onFindMatch: () => void;
  onHaveAccount: () => void;
};

// SCR-01 메인 티저 — Figma v1.0 「0. 메인 진입 티저」(축사 연결 228:4738 과 같은 화면). 배경은 AppShell 의 dawn 이다.
// 하단 네비는 없다(라우트 handle 에 nav 를 적지 않는다). 간격은 375 × 812 프레임 기준 — 제목 top 81 = 콘텐츠 여백 16 + 65,
// 버튼 묶음은 구슬 그림 아래 6px 과 겹친다(508 < 216 + 298).
export function MainTeaser({ onViewSaju, onFindMatch, onHaveAccount }: Props) {
  return (
    <section aria-labelledby="main-teaser-title" className="flex flex-col items-center pt-[65px]">
      {/* Display/28 제목 · UI/16/500 부제 세 줄 (228:4740·4741). */}
      <header className="flex flex-col items-center gap-24 text-center">
        <h1 className="font-display text-display-28 text-primary" id="main-teaser-title">
          운명도 꿰어야 사랑이다
        </h1>
        <p className="text-ui-16 font-medium text-primary-900">
          사주로 나를 알아보고,
          <br />
          친구와의 궁합부터
          <br />
          아직 만나지 않은 새로운 인연까지 확인해보세요.
        </p>
      </header>

      {/* 구슬 세 개 일러스트 199 × 298 (228:4749). */}
      <img alt="" className="h-[298px] w-[199px] object-cover" draggable={false} src={orbs} />

      {/* UI/14/500 안내 → Button/Primary M 240px, 두 묶음 사이 32 (228:4742). */}
      <div className="-mt-[6px] flex w-[270px] flex-col items-center gap-32">
        <div className="flex w-[240px] flex-col items-center gap-12">
          <p className="text-center text-ui-14 font-medium text-primary">
            나의 오행과 연애·인연의 흐름을 확인해요.
          </p>
          <Button className="w-full" onClick={onViewSaju} size="m">
            내 사주 보기
          </Button>
        </div>
        <div className="flex w-full flex-col items-center gap-12">
          <p className="text-center text-ui-14 font-medium text-primary">
            나와 사주 궁합이 잘 맞는 새로운 사람을 찾아봐요.
          </p>
          <Button className="w-[240px]" onClick={onFindMatch} size="m">
            새로운 인연 찾기
          </Button>
        </div>
      </div>

      {/* UI/12/400 Text/Secondary 밑줄 (228:4750). */}
      <button
        className="mt-12 text-ui-12 text-secondary underline"
        onClick={onHaveAccount}
        type="button"
      >
        이미 아이디가 있어요
      </button>
    </section>
  );
}
