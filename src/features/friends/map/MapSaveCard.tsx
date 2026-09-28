import saveElephant from '@/ui/assets/friends/save-elephant.webp';
import { Button } from '@/ui/Button';

type Props = {
  // '로그인하고 저장하기' — 로그인 시트를 여는 것은 app 이 정한다.
  onLogin: () => void;
};

// 비로그인 내 궁합지도 맨 아래 저장 유도 카드 — Figma v1.0 23:4901(3.1 궁합 지도 - 로그인 x). FR-20.
export function MapSaveCard({ onLogin }: Props) {
  return (
    <section
      aria-labelledby="map-save-title"
      className="flex flex-col items-center gap-4 rounded-16 border border-neutral bg-opacity-card-neutral-100-50 px-8 pt-20 pb-8"
    >
      <img alt="" className="size-[61px] object-cover" draggable={false} src={saveElephant} />
      <div className="flex flex-col items-center text-center text-primary">
        <h2 className="text-ui-16 font-semibold" id="map-save-title">
          이 인연들을 계속 간직할까요?
        </h2>
        <p className="text-ui-12">
          로그인하면 궁합지도와 기록을 안전하게 저장할 수 있어요.
          <br />
          기기나 브라우저가 바뀌면 다시 찾기 어려울 수 있어요.
        </p>
      </div>
      <Button
        className="w-[240px] text-ui-14"
        onClick={onLogin}
        size="m"
        type="button"
        variant="ghost"
      >
        로그인하고 저장하기 →
      </Button>
    </section>
  );
}
