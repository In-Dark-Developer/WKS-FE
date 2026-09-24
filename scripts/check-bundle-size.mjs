// 초기 JS 전송량 검사 (NFR-2 — 초기 JS < 250KB gzip, Phase 08 T5).
// `pnpm build` 산출물의 index.html 이 첫 화면에서 받는 JS(모듈 entry·modulepreload)만 gzip 으로 재서 합한다.
// 동적 import 로 나중에 받는 청크와 외부 스크립트(gtag 등)는 세지 않는다. 넘으면 exit 1 — CI 가 실패한다.
// 사용: node scripts/check-bundle-size.mjs [dist 경로=dist]
// process·console 을 import 한다 — ESLint 설정이 Node 전역을 모른다(이 파일만을 위해 설정을 바꾸지 않는다).
import console from 'node:console';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 250;
const dist = process.argv[2] ?? 'dist';

let html;
try {
  html = readFileSync(join(dist, 'index.html'), 'utf8');
} catch {
  console.error(`check-bundle-size: ${dist}/index.html 이 없다 — pnpm build 를 먼저 돌린다`);
  process.exit(1);
}

// 같은 origin 의 /assets/*.js 만 — 절대 URL(https://…)은 우리 번들이 아니다.
const tags = html.match(/<(?:script|link)\b[^>]*>/g) ?? [];
const files = new Set();
for (const tag of tags) {
  const isEntry = /^<script\b/.test(tag) && /\btype="module"/.test(tag);
  const isPreload = /^<link\b/.test(tag) && /\brel="modulepreload"/.test(tag);
  if (!isEntry && !isPreload) continue;
  const url = /\b(?:src|href)="([^"]+\.js)"/.exec(tag)?.[1];
  if (url && !/^[a-z]+:\/\//i.test(url)) files.add(url.replace(/^\//, ''));
}

if (files.size === 0) {
  console.error(
    'check-bundle-size: index.html 에서 초기 JS 를 찾지 못했다 — 빌드 산출물 모양이 바뀌었는지 확인한다',
  );
  process.exit(1);
}

let total = 0;
for (const file of files) {
  const size = gzipSync(readFileSync(join(dist, file)), { level: 9 }).length;
  total += size;
  console.log(`  ${(size / 1024).toFixed(1).padStart(7)} KB  ${file}`);
}

const totalKb = total / 1024;
const verdict = totalKb <= BUDGET_KB ? 'ok' : 'FAIL';
console.log(`[${verdict}] 초기 JS ${totalKb.toFixed(1)} KB gzip / 예산 ${BUDGET_KB} KB (NFR-2)`);
if (verdict === 'FAIL') process.exit(1);
