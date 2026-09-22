#!/usr/bin/env bash
# 일회용 — ⚔️ PRD 보드에서 옛 수기 번호 행을 보관 처리하고, 담당자를 저장소 번호 체계로 다시 깐다.
# 실행 뒤 삭제한다. env: NOTION_TOKEN · NOTION_PRD_DB
set -euo pipefail

api() { # api <METHOD> <path> [json]
  curl -sS -X "$1" "https://api.notion.com/v1/$2" \
    -H "Authorization: Bearer $NOTION_TOKEN" \
    -H "Notion-Version: 2022-06-28" \
    -H "Content-Type: application/json" ${3:+-d "$3"}
}

LEGACY=" FR-32 FR-33 FR-34 FR-35 FR-36 FR-37 FR-41 FR-42 FR-43 FR-44 FR-45 FR-46 FR-51 FR-52 FR-53 FR-54 FR-55 FR-56 FR-57 FR-58 FR-59 FR-61 FR-62 FR-63 OPEN-1 OPEN-2 OPEN-3 DOC "

JJ=3d353a58-3865-4b5c-9056-7224c69903b9   # 이정진
DG=61d3c246-985b-40bb-9c1c-fa79e557051b   # 이동건
GW=5ed06c87-5666-4f97-a529-6d8dd555ccad   # 강근우
DY=2d1d872b-594c-815c-bc71-0002acbb8aa2   # 곽도윤

assignee() { # assignee <ID> → user id ("" 이면 담당자 없음)
  case "$1" in
    FR-18|FR-19|FR-21|FR-22|NFR-1|NFR-3|NFR-8) echo "$JJ";;
    FR-20|NFR-7)                               echo "$DY";;
    FR-12|FR-24|FR-25|FR-26|FR-27)             echo "$DG";;
    FR-13|FR-23|FR-28|FR-29|FR-30)             echo "$GW";;
    *)                                         echo "";;
  esac
}

# 행을 모두 받아 ID·page id·현재 담당자 수를 뽑는다.
rows=$(mktemp); cursor=""
while :; do
  body=$(api POST "databases/$NOTION_PRD_DB/query" "$(jq -n --arg c "$cursor" '{page_size:100} + (if $c=="" then {} else {start_cursor:$c} end)')")
  printf '%s' "$body" | jq -r '.results[] | [ (.properties.ID.rich_text[0].plain_text // ""), .id, ((.properties."담당자".people // []) | length | tostring) ] | @tsv' >> "$rows"
  [ "$(printf '%s' "$body" | jq -r .has_more)" = true ] || break
  cursor=$(printf '%s' "$body" | jq -r .next_cursor)
done
echo "행 $(wc -l < "$rows")개 읽음"

archived=0; assigned=0; cleared=0
while IFS=$'\t' read -r id page has; do
  [ -n "$id" ] || continue
  case "$LEGACY" in
    *" $id "*)
      api PATCH "pages/$page" '{"archived":true}' > /dev/null
      archived=$((archived + 1)); echo "  보관  $id"
      continue;;
  esac
  want=$(assignee "$id")
  if [ -n "$want" ]; then
    api PATCH "pages/$page" "$(jq -n --arg u "$want" '{properties:{"담당자":{people:[{object:"user",id:$u}]}}}')" > /dev/null
    assigned=$((assigned + 1)); echo "  배정  $id"
  elif [ "$has" != "0" ]; then
    api PATCH "pages/$page" '{"properties":{"담당자":{"people":[]}}}' > /dev/null
    cleared=$((cleared + 1)); echo "  해제  $id"
  fi
done < "$rows"
echo "보관 ${archived} · 배정 ${assigned} · 해제 ${cleared}"
