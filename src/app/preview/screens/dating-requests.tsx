import type { PreviewScreen } from '@/app/preview/previewScreen';
import {
  RequestInbox,
  type RequestInboxView,
  type RequestProfileView,
  type RequestTab,
  type SentRequestView,
} from '@/features/dating';
import photoHorse from '@/ui/assets/zodiac/zodiac-horse.webp';
import photoRabbit from '@/ui/assets/zodiac/zodiac-rabbit.webp';
import photoTiger from '@/ui/assets/zodiac/zodiac-tiger.webp';

const noop = () => {};

const bio =
  '안녕하세요! 처음에는 조금 낯을 가리지만 친해지면 장난도 많고 말도 꽤 많은 편이에요. 평소에는 영화나 전시 보러 가는 걸 좋아하고, 새로운 카페나 맛집 찾아다니는 것도 좋아합니다.';

// 보낸 신청 — 보내기 전에 연 항목만 열려 있다(사람 사진 대신 십이간지 그림).
const sent: readonly SentRequestView[] = [
  {
    id: 's1',
    status: 'PENDING',
    rank: 1,
    score: 98,
    relationLabel: '천생연분',
    mbti: 'ENTP',
    bio,
    photo: { isLocked: true, thumbnailUrl: photoRabbit, cost: 10 },
    name: { isLocked: false, value: '차은호' },
    department: { isLocked: true, cost: 5 },
    reason: { isLocked: true, cost: 3 },
  },
  {
    id: 's2',
    status: 'FAILED',
    rank: 2,
    score: 92,
    relationLabel: '천생연분',
    mbti: 'INFJ',
    bio: '조용한 카페에서 책 읽는 걸 좋아해요.',
    photo: { isLocked: false, url: photoTiger },
    name: { isLocked: false, value: '김채원' },
    department: { isLocked: false, value: '바이오헬스의료기기규제과학과' },
    reason: { isLocked: true, cost: 3 },
  },
  {
    id: 's3',
    status: 'PENDING',
    rank: 3,
    score: 87,
    relationLabel: '찰떡궁합',
    mbti: 'ISFP',
    bio: '운동하고 맛집 다니는 걸 좋아합니다.',
    photo: { isLocked: true, thumbnailUrl: photoHorse, cost: 10 },
    name: { isLocked: true, cost: 7 },
    department: { isLocked: true, cost: 5 },
    reason: { isLocked: true, cost: 3 },
  },
];

// 받은 신청 — 해금 없이 전부 열려 오고, 궁합 점수는 보이지 않는다(Q17 미정).
const received: readonly RequestProfileView[] = [
  {
    id: 'r1',
    rank: null,
    score: null,
    relationLabel: '천생연분',
    mbti: 'ENTP',
    bio,
    photo: { isLocked: false, url: photoRabbit },
    name: { isLocked: false, value: '김채원' },
    department: { isLocked: false, value: '바이오헬스의료기기규제과학과' },
    reason: {
      isLocked: false,
      value: '두 사람 모두 물의 기운이 약해 서로를 채워 주는 사이예요. 대화가 끊이지 않을 거예요.',
    },
  },
  {
    id: 'r2',
    rank: null,
    score: null,
    relationLabel: '찰떡궁합',
    mbti: 'ISTJ',
    bio: '주말마다 등산을 가요.',
    photo: { isLocked: false, url: photoHorse },
    name: { isLocked: false, value: '이도윤' },
    department: { isLocked: false, value: '경영학과' },
    reason: { isLocked: false, value: '불과 흙이 만나 서로를 단단하게 해 줘요.' },
  },
];

const view: RequestInboxView = { sent, received };

function Inbox({
  inbox = view,
  tab,
  openId,
}: {
  inbox?: RequestInboxView;
  tab?: RequestTab;
  openId?: string;
}) {
  return (
    <RequestInbox
      initialOpenId={openId}
      initialTab={tab}
      onAccept={noop}
      onBack={noop}
      onCancel={noop}
      onDecline={noop}
      view={inbox}
    />
  );
}

// SCR-20 요청함 — 11/T3 퍼블리싱. 목록·취소·수락/거절 연결과 연락처 공개는 11/T2.
export const preview: PreviewScreen = {
  title: 'SCR-20 요청함',
  order: 15,
  states: {
    '보낸 신청': () => <Inbox />,
    '받은 신청': () => <Inbox tab="received" />,
    '보낸 신청 상세(대기)': () => <Inbox openId="s1" />,
    '보낸 신청 상세(실패)': () => <Inbox openId="s2" />,
    '받은 신청 상세': () => <Inbox openId="r1" tab="received" />,
    '빈 목록': () => <Inbox inbox={{ sent: [], received: [] }} />,
  },
};
