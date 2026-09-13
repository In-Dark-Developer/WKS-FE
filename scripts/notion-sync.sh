#!/usr/bin/env bash
# notion-sync.sh — 스트림 상태를 Notion Task 보드에 반영한다 (git → Notion 단방향).
#
#   scripts/notion-sync.sh           현재 브랜치의 스트림을 보드에 반영
#   scripts/notion-sync.sh --check   토큰·DB 접근·쓰기 권한만 확인 (한 행에 같은 값을 다시 써 본다)
#   scripts/notion-sync.sh --stream <id>   브랜치 대신 이 스트림을 반영 (보드를 손으로 고친 뒤 되돌릴 때)
#
# env: NOTION_TOKEN(필수, Actions secret) · NOTION_DB(필수) · STREAM_REF · PR_URL · PR_MERGED
# 보드가 기억이 아니다 — CURRENT.md 가 기억이고 보드는 그 사본이다 (AGENTS.md Rule 1).
# Task 스트림은 사람이 만든 Phase+Task 행을 갱신하고, 그 밖의 스트림(spec·chore·plan·phase-close)은
# Stream 열로 찾아 없으면 만든다 (ADR-20260912-notion-board-rows-for-streams).

set -eo pipefail
. "$(cd "$(dirname "$0")" && pwd)/lib/common.sh"

mode=sync; want_stream=""
while [ $# -gt 0 ]; do
  case "$1" in
    --stream) want_stream=${2:-}; shift;;
    --check) mode=check;;
    -h|--help) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0;;
    *) die "알 수 없는 옵션 $1";;
  esac; shift
done

[ -n "${NOTION_TOKEN:-}" ] || { warn "NOTION_TOKEN 이 없다 — 동기화 생략 (fork PR 에서는 정상)"; exit 0; }
[ -n "${NOTION_DB:-}" ] || die "NOTION_DB 를 지정한다"
command -v jq >/dev/null || die "jq 가 필요하다"

api() { # api <METHOD> <path> [body]
  local out code
  out=$(curl -sS -w '\n%{http_code}' -X "$1" "https://api.notion.com/v1/$2" \
    -H "Authorization: Bearer $NOTION_TOKEN" \
    -H "Notion-Version: 2022-06-28" \
    -H "Content-Type: application/json" \
    ${3:+-d "$3"})
  code=$(printf '%s' "$out" | tail -n1)
  body=$(printf '%s' "$out" | sed '$d')
  [ "$code" = "200" ] || { fail "Notion $1 /$2 → HTTP $code: $(printf '%s' "$body" | jq -r '.message // .' | head -n1)"; return 1; }
  return 0
}

# CURRENT.md 의 Status → 보드의 상태
notion_status() {
  case "$1" in
    TODO)        echo 대기;;
    IN_PROGRESS) echo 진행중;;
    BLOCKED)     echo 보류;;
    REVIEW)      echo 리뷰;;
    *) echo "";;
  esac
}

# Owner 는 Person 속성이다 — GitHub 핸들을 Notion 사용자 id 로 옮긴다 (2026-09-13). 새 팀원은 여기에 한 줄 추가한다.
owner_uid() { # owner_uid <@handle> → notion user id ("" 이면 Owner 를 쓰지 않는다)
  case "$1" in
    @jjjung0921) echo 3d353a58-3865-4b5c-9056-7224c69903b9;;
    @nicerjs23)  echo 61d3c246-985b-40bb-9c1c-fa79e557051b;;
    @gn00py48)   echo 5ed06c87-5666-4f97-a529-6d8dd555ccad;;
    *) echo "";;
  esac
}

props_json() { # props_json <상태> <owner_uid> <pr> <stream> [title] [touches]
  jq -n --arg st "$1" --arg owner "$2" --arg pr "$3" --arg stream "$4" --arg title "${5:-}" --arg touches "${6:-}" '
    def text($v): { rich_text: [ { text: { content: $v } } ] };
      { "상태": { select: { name: $st } } }
    + (if $owner   == "" then {} else { "Owner":  { people: [ { object: "user", id: $owner } ] } } end)
    + (if $pr      == "" then {} else { "PR": { url: $pr } }       end)
    + (if $stream  == "" then {} else { "Stream": text($stream) }  end)
    + (if $title   == "" then {} else { "작업": { title: [ { text: { content: $title } } ] } } end)
    + (if $touches == "" then {} else { "Touches": text($touches) } end)'
}

patch_page() { # patch_page <page_id> <props_json>
  api PATCH "pages/$1" "$(jq -n --argjson p "$2" '{ properties: $p }')"
}

create_page() { # create_page <props_json>
  api POST "pages" "$(jq -n --arg db "$NOTION_DB" --argjson p "$1" '{ parent: { database_id: $db }, properties: $p }')"
}

query() { # query <filter_json 또는 null>
  api POST "databases/$NOTION_DB/query" "$(jq -n --argjson f "$1" 'if $f == null then { page_size: 20 } else { filter: $f, page_size: 20 } end')"
}

# Task 행: 사람이 만든다. Task 로 찾고 Phase 번호로 좁힌다 (보드의 Task 는 "T3", Phase 는 "01 project-setup")
find_task_row() { # find_task_row <NN> <Tk> → page_id
  query "$(jq -n --arg t "$2" '{ property: "Task", rich_text: { equals: $t } }')" || return 1
  printf '%s' "$body" | jq -r --arg p "$1 " '.results[] | select(.properties.Phase.select.name // "" | startswith($p)) | .id' | head -n1
}

# 그 밖의 스트림: Stream 열로 찾는다 (없으면 호출자가 만든다)
find_stream_row() { # find_stream_row <id> → page_id
  query "$(jq -n --arg s "$1" '{ property: "Stream", rich_text: { equals: $s } }')" || return 1
  printf '%s' "$body" | jq -r '.results[0].id // empty'
}

run_check() {
  local id st
  query null || return 1
  id=$(printf '%s' "$body" | jq -r '.results[0].id // empty')
  [ -n "$id" ] || { warn "보드에 행이 없다 — 읽기는 통과, 쓰기는 확인 못 했다"; return 0; }
  st=$(printf '%s' "$body" | jq -r '.results[0].properties."상태".select.name // empty')
  ok "읽기 통과 (DB 접근 · 행 ${id})"
  [ -n "$st" ] || { warn "첫 행에 상태 값이 없다 — 쓰기 확인 생략"; return 0; }
  patch_page "$id" "$(props_json "$st" "" "" "")" || return 1
  ok "쓰기 통과 (같은 값 '$st' 로 다시 씀 — 보드 내용은 그대로)"
}

branch=$(current_branch); [ -z "$branch" ] && branch=${STREAM_REF:-}   # GITHUB_* 는 러너 예약 접두라 스텝 env 로 못 넘긴다
id=$(stream_from_branch "$branch")
[ -n "$want_stream" ] && { id=$want_stream; branch="ws/$id"; }
CURRENT="$WORK/$id/CURRENT.md"

if [ "$mode" = "check" ] || [ -z "$id" ] || [ ! -f "$CURRENT" ]; then
  say "notion-sync: check (branch ${branch:-?})"
  run_check; exit $FAILED
fi

task=$(field "$CURRENT" Task)           # "01/T3" 또는 "-/-"
phase=${task%%/*}; tk=${task#*/}
status=$(status_of "$CURRENT")
want=$(notion_status "$status")
[ "${PR_MERGED:-}" = "true" ] && want=완료
[ -n "$want" ] || { warn "Status '$status' 를 보드 값으로 옮길 수 없다 — 생략"; exit 0; }

owner=$(field "$CURRENT" Owner)
case "$owner" in *@users.noreply.github.com) owner="@${owner%@users.noreply.github.com}"; owner="@${owner#*+}";; *) owner="";; esac
owner_id=$(owner_uid "$owner"); [ -n "$owner_id" ] || { [ -z "$owner" ] || warn "Owner $owner 의 Notion 사용자 id 가 owner_uid 에 없다 — Owner 생략"; owner=""; }

if [ "$phase" != "-" ] && [ "$tk" != "-" ]; then
  page=$(find_task_row "$phase" "$tk") || exit 1
  [ -n "$page" ] || { warn "보드에 Phase $phase · Task $tk 행이 없다 — 생략 (Task 행은 사람이 만든다)"; exit 0; }
  patch_page "$page" "$(props_json "$want" "$owner_id" "${PR_URL:-}" "$id")" || exit 1
  ok "$task ($id) → 상태 '$want'${owner:+ · Owner $owner}${PR_URL:+ · PR}"
  exit $FAILED
fi

# spec · chore · plan · phase-close — 보드 행을 Stream 으로 찾고, 없으면 만든다
title=$(section "$CURRENT" "Current Task" | head -n1)
[ -n "$title" ] || title="$id"
touches=$(field "$CURRENT" Touches)
page=$(find_stream_row "$id") || exit 1
if [ -n "$page" ]; then
  patch_page "$page" "$(props_json "$want" "$owner_id" "${PR_URL:-}" "$id" "$title" "$touches")" || exit 1
  ok "$id → 상태 '$want'${owner:+ · Owner $owner}${PR_URL:+ · PR}"
else
  create_page "$(props_json "$want" "$owner_id" "${PR_URL:-}" "$id" "$title" "$touches")" || exit 1
  ok "$id → 행 생성 · 상태 '$want'${owner:+ · Owner $owner}"
fi
exit $FAILED
