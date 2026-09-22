#!/usr/bin/env bash
# 일회용 — ⚔️ PRD 보드에 구현 현황(상태 · UI 완료 · 기능 완료)과 v1.0 Figma 프레임 이름을 채운다.
# 실행 뒤 삭제한다. env: NOTION_TOKEN · NOTION_PRD_DB
set -euo pipefail

api() { # api <METHOD> <path> [json]
  curl -sS -X "$1" "https://api.notion.com/v1/$2" \
    -H "Authorization: Bearer $NOTION_TOKEN" \
    -H "Notion-Version: 2022-06-28" \
    -H "Content-Type: application/json" ${3:+-d "$3"}
}

# ID|상태|UI 완료|기능 완료|Figma Frame (v1.0 imSnlOGTqwtPhGyzhA8yc9)
ROWS='
FR-1|진행 중|0|1|0. 사이트 진입(teaser) / 0. 메인 진입 티저
FR-2|완료|1|1|1. 개인정보 입력 / 기본 · 오류 · 연결문제? · 로딩중
FR-3|진행 중|0|1|2. 사주 결과 화면 / 사주 카드 화면
FR-4|진행 중|0|1|2. 사주 결과 화면 / 사주 카드 화면
FR-5|완료|1|1|점지 카드 · 십이간지 카드
FR-6|진행 중|0|1|4. 링크 공유 시 친구가 보는 화면 / 4.1 신규 티저 (링크 진입 화면)
FR-7|진행 중|0|1|3. 친구 궁합 지도 / 3.1 궁합 지도 - 로그인 o
FR-8|진행 중|0|1|3. 친구 궁합 지도 / 3.1 궁합 지도 - 로그인 o
FR-9|완료|1|1|1. 개인정보 입력 / 사전신청 모달
FR-10|완료|1|1|1. 개인정보 입력 / 사전신청 모달
FR-11|시작 전|0|0|디자인 없음 — MVP 제외
FR-12|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-13|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-14|진행 중|0|1|3.1 궁합 지도 - 로그인 o · 4.1.1 궁합 지도 · 4.2.1 궁합지도
FR-15|진행 중|0|1|4.1 신규 티저 (링크 진입 화면)
FR-16|완료|1|1|디자인 없음
FR-17|완료|1|1|1. 개인정보 입력 / 기본
FR-18|완료|1|1|1. 개인정보 입력 / 오류 · 연결문제?
FR-19|시작 전|0|0|nav · 2. 사주 결과 화면 / 사주 카드 화면
FR-20|시작 전|0|0|3. 친구 궁합 지도 / 3.1.1 로그인
FR-21|시작 전|0|0|3.1 궁합 지도 - 로그인 x · 3.1 궁합 지도 - 로그인 o
FR-22|시작 전|0|0|3.2 친구 궁합 리스트 이유 · 4.1.2 궁합 자세히 보기 · 4.2.2 자세히 보기
FR-23|시작 전|0|0|4.2 기존 티저 (링크 진입 화면) · 4.2 새로 작성하기 버튼 누를 시
FR-24|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-25|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-26|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-27|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-28|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-29|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-30|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
FR-31|시작 전|0|0|소개팅 wf — 이름 없는 와이어프레임
NFR-1|완료|1|1|v1.0 전 프레임 375 × 812 기준
NFR-2|완료|0|1|
NFR-3|완료|0|1|
NFR-4|완료|0|1|
NFR-5|완료|1|1|1. 개인정보 입력 / 기본 · 오류
NFR-6|완료|0|1|
NFR-7|시작 전|0|0|
NFR-8|시작 전|0|0|
NFR-9|시작 전|0|0|
NFR-10|시작 전|0|0|
'

# ID → page id 색인을 만든다.
index=$(mktemp); cursor=""
while :; do
  body=$(api POST "databases/$NOTION_PRD_DB/query" "$(jq -n --arg c "$cursor" '{page_size:100} + (if $c=="" then {} else {start_cursor:$c} end)')")
  printf '%s' "$body" | jq -r '.results[] | [ (.properties.ID.rich_text[0].plain_text // ""), .id ] | @tsv' >> "$index"
  [ "$(printf '%s' "$body" | jq -r .has_more)" = true ] || break
  cursor=$(printf '%s' "$body" | jq -r .next_cursor)
done

n=0; miss=0
while IFS='|' read -r id status ui fn figma; do
  [ -n "$id" ] || continue
  page=$(awk -F'\t' -v k="$id" '$1==k {print $2; exit}' "$index")
  if [ -z "$page" ]; then miss=$((miss + 1)); echo "  없음  $id"; continue; fi
  props=$(jq -n --arg s "$status" --argjson u "$ui" --argjson f "$fn" --arg g "$figma" '
    { "상태": { status: { name: $s } },
      "UI 완료": { checkbox: ($u == 1) },
      "기능 완료": { checkbox: ($f == 1) },
      "Figma Frame": { rich_text: (if $g == "" then [] else [ { text: { content: $g } } ] end) } }')
  api PATCH "pages/$page" "$(jq -n --argjson p "$props" '{properties:$p}')" > /dev/null
  n=$((n + 1)); echo "  $id → $status (UI $ui · 기능 $fn)"
done <<EOF
$(printf '%s' "$ROWS" | sed '/^$/d')
EOF
echo "갱신 ${n}행 · 미발견 ${miss}행"
