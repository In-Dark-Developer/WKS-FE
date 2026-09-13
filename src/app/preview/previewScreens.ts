import type { PreviewScreen } from './previewScreen';

export type PreviewEntry = { slug: string; screen: PreviewScreen };

// 화면 파일을 추가하면 목록에 저절로 뜬다 — 공유 목록 파일을 고치지 않는다 (03/T6).
const modules = import.meta.glob<{ preview: PreviewScreen }>(
  ['./screens/*.tsx', '!./screens/*.test.tsx'],
  { eager: true },
);

export const previewScreens: readonly PreviewEntry[] = Object.entries(modules)
  .map(([path, module]) => ({
    slug: path.slice('./screens/'.length, -'.tsx'.length),
    screen: module.preview,
  }))
  .sort((a, b) => a.screen.order - b.screen.order || a.slug.localeCompare(b.slug));

export function findPreviewScreen(slug: string | undefined): PreviewEntry | undefined {
  return previewScreens.find((entry) => entry.slug === slug);
}
