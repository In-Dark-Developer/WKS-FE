import elephant from '@/ui/assets/elephant-loading.png';

import './ShareJoinLoading.css';

const message = '이전 정보로 궁합지도를 만들고 있어요';

// 공유 링크로 들어온 사람이 궁합 지도를 받기 전까지 보는 대기 화면 (Figma 1044:4150).
// 배경은 라우트 handle 의 'result' 배경을 그대로 쓴다 — 디자인의 그라데이션과 같은 값이다.
// 문구·코끼리 묶음은 화면 세로 가운데다(디자인 375×812 에서 306~507, 가운데 406 = 812 의 절반).
// 점 세 개는 늘어나는 애니메이션이라 읽어 줄 필요가 없다(문구만 aria-live 로 알린다).
export function ShareJoinLoading() {
  return (
    <section
      aria-busy
      aria-live="polite"
      className="fixed inset-0 flex flex-col items-center justify-center gap-48"
      data-share-join-loading=""
      role="status"
    >
      {/* Display/20/400 · 글자 아래 47px 에 코끼리 130px (1044:4240·1044:4403). */}
      <p className="text-center font-display text-display-20 text-primary">
        {message}
        <span aria-hidden="true">
          <span data-share-join-dot="">.</span>
          <span data-share-join-dot="">.</span>
          <span data-share-join-dot="">.</span>
        </span>
      </p>
      <img alt="" className="size-[130px] object-cover" src={elephant} />
    </section>
  );
}
