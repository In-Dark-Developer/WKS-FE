type Props = {
  // 백엔드가 준 지금 비용 — 차감되는 값이다.
  cost: number;
  // 정가. 지금 비용이 이보다 싸면(할인) 정가에 취소선을 긋고 옆에 지금 비용을 적는다.
  listed: number;
};

// 실 개수 표기 — 할인 여부는 백엔드 비용이 정가보다 싼지로만 판단한다. 할인 기간(마지막 날 10시~자정, 2026-10-01)은
// 백엔드가 정하므로 화면은 시각을 따로 보지 않는다 — 서버가 정가를 주면 취소선도 사라진다.
// 무료(0)는 할인이 아니라 무료 점지·다시 열기라서 긋지 않는다. 취소선 숫자는 화면 낭독에서 뺀다.
export function CostText({ cost, listed }: Props) {
  if (cost === 0 || cost >= listed) return <>{cost}</>;
  return (
    <>
      <s aria-hidden="true" className="opacity-60">
        {listed}
      </s>{' '}
      {cost}
    </>
  );
}
