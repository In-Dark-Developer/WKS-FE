import unlockDepartment from '@/ui/assets/dating/unlock-department.webp';
import unlockName from '@/ui/assets/dating/unlock-name.webp';
import unlockPhoto from '@/ui/assets/dating/unlock-photo.webp';
import unlockReason from '@/ui/assets/dating/unlock-reason.webp';

// 해금할 수 있는 항목 — FR-28 의 네 가지.
export type UnlockItem = 'photo' | 'name' | 'department' | 'reason';

// 해금 모달의 한 칸. 비용은 백엔드가 준 값 그대로이고, 이미 연 항목도 비용을 보인 채 비활성으로 남는다(Figma 112:3342).
export type UnlockOptionView = { item: UnlockItem; cost: number; isUnlocked: boolean };

// 항목별 정가 — 응답은 연 항목의 비용을 주지 않아(§10.4) 모달의 연 칸에 적고(Figma 112:3342), 할인 중이면
// 잠긴 칸의 취소선 숫자로 쓴다. 차감 판단에는 쓰지 않는다 — 차감은 백엔드가 한다.
export const listedCost: Record<UnlockItem, number> = {
  photo: 10,
  name: 7,
  department: 5,
  reason: 3,
};

export const unlockItemLooks: Record<UnlockItem, { label: string; image: string }> = {
  photo: { label: '사진', image: unlockPhoto },
  name: { label: '이름', image: unlockName },
  department: { label: '학과', image: unlockDepartment },
  reason: { label: '궁합 이유', image: unlockReason },
};
