#!/usr/bin/env bash
# notion-sync.sh — 스트림 상태를 Notion Task 보드에 반영한다 (git → Notion 단방향).
#
#   scripts/notion-sync.sh           현재 브랜치의 스트림을 보드에 반영 (Task 스트림이 아니면 --check 와 같다)
#   scripts/notion-sync.sh --check   토큰·DB 접근·쓰기 권한만 확인 (한 행에 같은 값을 다시 써 본다)
#
# env: NOTION_TOKEN(필수, Actions secret) · NOTION_DB(필수) · STREAM_REF · PR_URL · PR_MERGED
# 보드가 기억이 아니다 — CURRENT.md 가 기억이고 보드는 그 사본이다 (AGENTS.md Rule 1).

set -eo pipefail
. "$(cd "$(dirname "$0")" && pwd)/lib/common.sh"

mode=sync
for a in "$@"; do
  case "$a" in
    --check) mode=check;;
    -h|--help) sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0;;
    *) die "알 수 없는 옵션 $a";;
  esac
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

patch_page() { # patch_page <page_id> <상태> [owner] [pr_url]
  local props
  props=$(jq -n --arg st "$2" --arg owner "${3:-}" --arg pr "${4:-}" '
    { "상태": { "select": { "name": $st } } }
    + (if $owner == "" then {} else { "Owner": { "rich_text": [ { "text": { "content": $owner } } ] } } end)
    + (if $pr    == "" then {} else { "PR": { "url": $pr } } end)
    | { properties: . }')
  api PATCH "pages/$1" "$props"
}

# Task 로 행을 찾고 Phase 번호로 좁힌다 (보드의 Task 는 "T3", Phase 는 "01 project-setup")
find_row() { # find_row <NN> <Tk> → page_id
  local q
  q=$(jq -n --arg t "$2" '{ filter: { property: "Task", rich_text: { equals: $t } }, page_size: 20 }')
  api POST "databases/$NOTION_DB/query" "$q" || return 1
  printf '%s' "$body" | jq -r --arg p "$1 " '.results[] | select(.properties.Phase.select.name // "" | startswith($p)) | .id' | head -n1
}

run_check() {
  local q id st
  q='{"page_size":1}'
  api POST "databases/$NOTION_DB/query" "$q" || return 1
  id=$(printf '%s' "$body" | jq -r '.results[0].id // empty')
  [ -n "$id" ] || { warn "보드에 행이 없다 — 읽기는 통과, 쓰기는 확인 못 했다"; return 0; }
  st=$(printf '%s' "$body" | jq -r '.results[0].properties."상태".select.name // empty')
  ok "읽기 통과 (DB 접근 · 행 ${id})"
  [ -n "$st" ] || { warn "첫 행에 상태 값이 없다 — 쓰기 확인 생략"; return 0; }
  patch_page "$id" "$st" || return 1
  ok "쓰기 통과 (같은 값 '$st' 로 다시 씀 — 보드 내용은 그대로)"
}

branch=$(current_branch); [ -z "$branch" ] && branch=${STREAM_REF:-}   # GITHUB_* 는 러너 예약 접두라 스텝 env 로 못 넘긴다
id=$(stream_from_branch "$branch")
CURRENT="$WORK/$id/CURRENT.md"

if [ "$mode" = "check" ] || [ -z "$id" ] || [ ! -f "$CURRENT" ]; then
  say "notion-sync: check (branch ${branch:-?})"
  run_check; exit $FAILED
fi

task=$(field "$CURRENT" Task)           # "01/T3" 또는 "-/-"
phase=${task%%/*}; tk=${task#*/}
status=$(status_of "$CURRENT")
owner=$(field "$CURRENT" Owner)
case "$owner" in *@users.noreply.github.com) owner="@${owner%@users.noreply.github.com}"; owner="@${owner#*+}";; *) owner="";; esac

if [ "$phase" = "-" ] || [ "$tk" = "-" ]; then
  say "notion-sync: $id 는 Task 스트림이 아니다 (Task: $task) — 보드 행 없음, 접근 확인만 한다"
  run_check; exit $FAILED
fi

want=$(notion_status "$status")
[ "${PR_MERGED:-}" = "true" ] && want=완료
[ -n "$want" ] || { warn "Status '$status' 를 보드 값으로 옮길 수 없다 — 생략"; exit 0; }

page=$(find_row "$phase" "$tk") || exit 1
[ -n "$page" ] || { warn "보드에 Phase $phase · Task $tk 행이 없다 — 생략"; exit 0; }

patch_page "$page" "$want" "$owner" "${PR_URL:-}" || exit 1
ok "$task → 상태 '$want'${owner:+ · Owner $owner}${PR_URL:+ · PR}"
exit $FAILED
