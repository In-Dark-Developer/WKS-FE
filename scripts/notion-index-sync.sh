#!/usr/bin/env bash
# notion-index-sync.sh — 저장소 문서를 Notion 색인 DB 에 복사한다 (git → Notion 단방향, dev push 마다 CI 가 돌린다).
#
#   scripts/notion-index-sync.sh [--prd] [--adr] [--phases] [--check-owners] [--dry-run]
#     --prd      docs/prd/*.md 의 FR·NFR 표 → ⚔️ PRD DB   (ID 로 upsert, 추적 열은 건드리지 않는다)
#     --adr      docs/decisions/ADR-*.md → 🏛️ ADR 색인               (번호 로 upsert)
#     --phases   docs/phases/README.md 표 → 📅 Phase 색인             (번호 로 upsert)
#     --check-owners  ⚔️ PRD DB 의 `담당자`(원본)와 저장소 `담당` 열(사본)을 대조한다 — 읽기만 하고
#                아무것도 쓰지 않는다. 어긋나면 실패하고 사람이 보드에서 고친 뒤 저장소를 맞춘다.
#     --check-owners 만 주면 대조만 하고, 넷을 전부 생략하면 동기화 셋을 돈다.
#     --dry-run 은 Notion 을 부르지 않고 보낼 속성만 출력한다 (토큰 불필요).
#
# env: NOTION_TOKEN(필수, Actions secret) · NOTION_PRD_DB · NOTION_ADR_DB · NOTION_PHASE_DB · NOTION_TASK_DB(Task 보드 — Phase 행의 `Task 보드` 관계용, 없으면 관계 생략) (database id) · REPO_URL(GitHub 링크, 기본 origin)
# 색인은 사본이다 — 원본은 docs/ 이고 여기서 고친 값은 다음 push 에 덮어써진다. 사람이 채우는 열(ADR 색인의 `영역`)만 건드리지 않는다.
# Phase 열은 docs/phases/*/PLAN.md 에서 그 ID 를 언급하는 Phase 번호, 상태 열은 그 Phase 들의 Status(docs/phases/README.md)에서 이끌어낸다.
# ADR: docs/decisions/ADR-20260913-notion-index-sync.md

set -eo pipefail
. "$(cd "$(dirname "$0")" && pwd)/lib/common.sh"
. "$(cd "$(dirname "$0")" && pwd)/lib/notion.sh"

do_prd=0; do_adr=0; do_ph=0; do_owners=0; dry=0
while [ $# -gt 0 ]; do
  case "$1" in
    --prd) do_prd=1;; --adr) do_adr=1;; --phases) do_ph=1;; --check-owners) do_owners=1;; --dry-run) dry=1;;
    -h|--help) sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'; exit 0;;
    *) die "알 수 없는 옵션 $1";;
  esac; shift
done
[ "$do_prd" -eq 0 ] && [ "$do_adr" -eq 0 ] && [ "$do_ph" -eq 0 ] && [ "$do_owners" -eq 0 ] && do_prd=1 && do_adr=1 && do_ph=1
command -v jq >/dev/null || die "jq 가 필요하다"
if [ "$dry" -eq 0 ]; then
  [ -n "${NOTION_TOKEN:-}" ] || { warn "NOTION_TOKEN 이 없다 — 동기화 생략"; exit 0; }
  { [ "$do_prd" -eq 0 ] && [ "$do_owners" -eq 0 ]; } || [ -n "${NOTION_PRD_DB:-}" ] || die "NOTION_PRD_DB 를 지정한다"
  [ "$do_adr" -eq 0 ] || [ -n "${NOTION_ADR_DB:-}" ] || die "NOTION_ADR_DB 를 지정한다"
  [ "$do_ph" -eq 0 ] || [ -n "${NOTION_PHASE_DB:-}" ] || die "NOTION_PHASE_DB 를 지정한다"
fi

trim() { printf '%s' "$1" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//'; }
send() { # send <db> <find_prop> <find_value> <props_json>
  if [ "$dry" -eq 1 ]; then printf '%s %s → %s\n' "$2" "$3" "$(printf '%s' "$4" | jq -c .)"; return 0; fi
  local r; r=$(notion_upsert "$1" "$2" "$3" "$4") || { fail "$3 동기화 실패"; return 1; }
  ok "$3 $r"
}

# ---------------------------------------------------------------- PRD
# ⚔️ PRD DB 로 보내는 속성. 저장소가 원천인 열만 쓴다 — 추적 열(상태·담당자·FE·BE·비고·수용 기준)은
# 사람이 Notion 에서 관리하므로 여기서 보내지 않는다 (ADR-20260923-prd-single-notion-db).
# 우선순위는 저장소 표기(Must/Should/Could)를 보드 표기(P0/P1/P2)로 옮긴다.
prd_props() { # prd_props <ID> <구분> <요구사항> <우선순위|"">
  jq -n --arg id "$1" --arg kind "$2" --arg req "$3" --arg pri "$4" '
    def text($v): { rich_text: [ { text: { content: $v } } ] };
    def board($p): if $p == "Must" then "P0" elif $p == "Should" then "P1" elif $p == "Could" then "P2" else "" end;
      { "이름": { title: [ { text: { content: $req } } ] }, "ID": text($id), "구분": { select: { name: $kind } } }
    + (if board($pri) == "" then {} else { "우선순위": { select: { name: board($pri) } } } end)'
}
# FR 표: | ID | Requirement | Area | Priority | Related |   NFR 표: | ID | Requirement | Target | 확인 방법 |
# 구분(Area)은 FR 표가 갖고, NFR 은 모두 '비기능' 이다.
sync_prd() {
  local n=0 line id req pri target kind
  while IFS= read -r line; do
    id=$(trim "$(printf '%s' "$line" | cut -d'|' -f2)")
    req=$(trim "$(printf '%s' "$line" | cut -d'|' -f3)")
    case "$id" in
      FR-*)  kind=$(trim "$(printf '%s' "$line" | cut -d'|' -f4)"); pri=$(trim "$(printf '%s' "$line" | cut -d'|' -f5)");;
      NFR-*) kind=비기능; pri=""; target=$(trim "$(printf '%s' "$line" | cut -d'|' -f4)"); [ -n "$target" ] && req="$req — $target";;
      *) continue;;
    esac
    send "${NOTION_PRD_DB:-}" ID "$id" "$(prd_props "$id" "$kind" "$req" "$pri")" && n=$((n + 1))
  done <<EOF
$(grep -hE '^\| N?FR-[0-9]+ ' docs/prd/*.md)
EOF
  say "PRD: ${n}행"
}

# ---------------------------------------------------------------- 담당 대조
# ⚔️ PRD DB 의 `담당자` 가 원본이고 저장소 FR·NFR 표의 `담당` 열은 사본이다
# (ADR-20260923-prd-single-notion-db). 사본만 고치고 보드를 잊는 일을 이 검사가 잡는다.
# 읽기 전용이다 — 어긋나도 고치지 않고 어디가 다른지만 말한다.
# 보드에 없는 SC-* 는 대조하지 않는다.
repo_owners() { # → "<ID>\t<담당>" (미배정은 빈 값)
  local line id owner
  while IFS= read -r line; do
    id=$(trim "$(printf '%s' "$line" | cut -d'|' -f2)")
    owner=$(trim "$(printf '%s' "$line" | sed 's/|[[:space:]]*$//' | awk -F'|' '{ print $NF }')")
    [ "$owner" = "—" ] && owner=""
    printf '%s\t%s\n' "$id" "$owner"
  done <<EOF
$(grep -hE '^\| N?FR-[0-9]+ ' docs/prd/*.md)
EOF
}

board_owners() { # → "<ID>\t<담당자 이름들>\t<사람 수>"
  local cursor=""
  while :; do
    notion_query_page "${NOTION_PRD_DB:-}" "$cursor" || return 1
    printf '%s' "$body" | jq -r '
      .results[]
      | [ (.properties.ID.rich_text[0].plain_text // ""),
          ((.properties."담당자".people // []) | map(.name // empty) | join(", ")),
          ((.properties."담당자".people // []) | length | tostring) ]
      | @tsv'
    cursor=$(printf '%s' "$body" | jq -r '.next_cursor // empty')
    [ -n "$cursor" ] || break
  done
}

# 보드 표시 이름 → 저장소 표기. 표에 없으면 빈 값을 돌려주고 호출부가 실패시킨다.
alias_file() { printf '%s' "$(cd "$(dirname "$0")" && pwd)/lib/notion-owners.tsv"; }
alias_of() { awk -F'\t' -v k="$1" '$0 !~ /^#/ && $1 == k { print $2; exit }' "$(alias_file)"; }
map_owners() { # "표시 이름, 표시 이름" → "저장소 표기, 저장소 표기" (모르면 비우고 $unknown 에 남긴다)
  local raw out="" one mapped
  raw=$1; unknown=""
  [ -n "$raw" ] || { printf ''; return 0; }
  while IFS= read -r one; do
    one=$(trim "$one"); [ -n "$one" ] || continue
    mapped=$(alias_of "$one")
    [ -n "$mapped" ] || { unknown="$one"; printf ''; return 0; }
    out="${out:+$out, }$mapped"
  done <<EOF
$(printf '%s' "$raw" | tr ',' '\n')
EOF
  printf '%s' "$out"
}

check_owners() {
  local tmp_board tmp_repo id board repo count mapped n=0 bad=0 nameless=0
  tmp_board=$(mktemp); tmp_repo=$(mktemp)
  trap 'rm -f "$tmp_board" "$tmp_repo"' RETURN
  board_owners > "$tmp_board" || { rm -f "$tmp_board" "$tmp_repo"; return 1; }
  repo_owners > "$tmp_repo"
  while IFS="$(printf '\t')" read -r id repo; do
    [ -n "$id" ] || continue
    n=$((n + 1))
    board=$(awk -F'\t' -v k="$id" '$1 == k { print $2 }' "$tmp_board")
    count=$(awk -F'\t' -v k="$id" '$1 == k { print $3 }' "$tmp_board")
    if [ -z "$count" ]; then
      fail "$id — 보드에 행이 없다 (동기화가 아직 안 돌았나)"; bad=$((bad + 1)); continue
    fi
    if [ "$count" != "0" ] && [ -z "$board" ]; then
      nameless=$((nameless + 1)); continue
    fi
    mapped=$(map_owners "$board")
    if [ -n "$unknown" ]; then
      fail "$id — 보드 표시 이름 '$unknown' 의 저장소 표기를 모른다 (scripts/lib/notion-owners.tsv 에 한 줄 추가한다)"
      bad=$((bad + 1)); continue
    fi
    [ "$mapped" = "$repo" ] && continue
    fail "$id — 보드 '${mapped:-—}' ≠ 저장소 '${repo:-—}'"; bad=$((bad + 1))
  done < "$tmp_repo"
  if [ "$nameless" -gt 0 ]; then
    die "담당자 이름을 읽지 못했다 (${nameless}행) — Notion 통합에 '사용자 정보 읽기' 권한을 켜야 대조할 수 있다"
  fi
  [ "$bad" -eq 0 ] || die "담당 ${bad}건이 어긋난다 (${n}행 대조) — 보드에서 고친 뒤 저장소 표를 맞춘다"
  ok "담당 대조: ${n}행 일치"
}

# ---------------------------------------------------------------- ADR
repo_url() {
  if [ -n "${REPO_URL:-}" ]; then printf '%s' "${REPO_URL%/}"; return; fi
  if [ -n "${GITHUB_SERVER_URL:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ]; then printf '%s/%s' "$GITHUB_SERVER_URL" "$GITHUB_REPOSITORY"; return; fi
  git remote get-url origin 2>/dev/null | sed -E 's#^git@github\.com:#https://github.com/#; s#\.git$##'
}
adr_props() { # adr_props <번호> <결정> <상태> <url> <요약>
  jq -n --arg no "$1" --arg title "$2" --arg st "$3" --arg url "$4" --arg sum "$5" '
    def text($v): { rich_text: [ { text: { content: $v } } ] };
    { "결정": { title: [ { text: { content: $title } } ] }, "번호": text($no), "상태": { select: { name: $st } }, "GitHub": { url: $url }, "한 줄 요약": text($sum) }'
}
sync_adr() {
  local n=0 f no title st sum base; base=$(repo_url)
  for f in docs/decisions/ADR-*.md; do
    no=$(basename "$f" .md)
    title=$(sed -n '1s/^# ADR-[^:]*: *//p' "$f")
    st=$(sed -n 's/^- Status: *//p' "$f" | head -n1)
    case "$st" in Superseded*) st=Superseded;; Accepted*) st=Accepted;; Deprecated*) st=Deprecated;; *) st=Proposed;; esac
    sum=$(section "$f" Decision | head -n2 | sed 's/^- //; s/\*\*//g' | paste -sd' ' - | cut -c1-200)
    send "${NOTION_ADR_DB:-}" 번호 "$no" "$(adr_props "$no" "$title" "$st" "$base/blob/main/$f" "$sum")" && n=$((n + 1))
  done
  say "ADR: ${n}행"
}

# ---------------------------------------------------------------- Phases
phase_props() { # phase_props <번호> <title> <lead> <depends> <status> <tasks> <result> <url> <goal> <scope> <task_ids(공백 구분)>
  jq -n --arg no "$1" --arg title "$2" --arg lead "$3" --arg dep "$4" --arg st "$5" --arg tasks "$6" --arg res "$7" --arg url "$8" --arg goal "$9" --arg scope "${10}" --arg ids "${11}" '
    def text($v): { rich_text: [ { text: { content: $v } } ] };
    { "Phase": { title: [ { text: { content: $title } } ] }, "번호": text($no), "Lead": text($lead), "Depends on": text($dep),
      "Status": { select: { name: $st } }, "Tasks": text($tasks), "Result": text($res), "GitHub": { url: $url },
      "Goal": text($goal), "Scope": text($scope) }
    + (if $ids == "" then {} else { "Task 보드": { relation: [ ($ids | split(" ")[] | { id: . }) ] } } end)'
}
task_row_ids() { # task_row_ids "NN name" → Task 보드에서 Phase select 가 그 값인 행 id 들 (공백 구분). 보드 id 없거나 dry-run 이면 빈 값
  [ -n "${NOTION_TASK_DB:-}" ] && [ "$dry" -eq 0 ] || return 0
  notion_api POST "databases/$NOTION_TASK_DB/query" "$(jq -n --arg p "$1" '{ filter: { property: "Phase", select: { equals: $p } }, page_size: 100 }')" || return 0
  printf '%s' "$body" | jq -r '[.results[].id] | join(" ")'
}
plan_goal()  { sed -n '/^## Goal/,/^## /p' "$1" | grep -vE '^(## |<!--|-->|$)' | head -n1 | cut -c1-1900; }
plan_scope() { sed -n '/^## Scope/,/^## /p' "$1" | grep '^- ' | sed 's/^- //' | paste -sd'\n' - | sed 's/[[:space:]]*$//' | tr '\n' '\001' | sed 's/\x01/ · /g' | cut -c1-1900; }
task_after_props() { jq -n --arg ids "$1" '{ "선행 Task": { relation: [ ($ids | split(" ") | map(select(. != ""))[] | { id: . }) ] } }'; }
sync_task_after() { # sync_task_after <PLAN.md> "<NN name>" — Task 줄의 After: 를 Task 보드 `선행 Task` 관계로 (보드 행은 Phase select + Task 로 찾는다)
  local plan=$1 ph=$2 line tk after dep ids id rows=""
  if [ "$dry" -eq 0 ] && [ -n "${NOTION_TASK_DB:-}" ]; then
    notion_api POST "databases/$NOTION_TASK_DB/query" "$(jq -n --arg p "$ph" '{ filter: { property: "Phase", select: { equals: $p } }, page_size: 100 }')" || return 0
    rows=$(printf '%s' "$body" | jq -r '.results[] | [.id, (.properties.Task.rich_text[0].plain_text // "")] | @tsv')
  fi
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    tk=$(printf '%s' "$line" | sed -E 's/^- \[[ x]\] (T[0-9]+)\. .*/\1/'); after=$(printf '%s' "$line" | sed -n 's/.*After: *//p' | sed 's/ · Owner:.*//; s/,/ /g')
    [ -n "$after" ] || continue
    if [ "$dry" -eq 1 ] || [ -z "${NOTION_TASK_DB:-}" ]; then printf '%s %s ← After %s\n' "$ph" "$tk" "$after"; continue; fi
    ids=""; for dep in $after; do id=$(printf '%s\n' "$rows" | awk -F'\t' -v t="$dep" '$2 == t { print $1; exit }'); [ -n "$id" ] && ids="${ids:+$ids }$id"; done
    id=$(printf '%s\n' "$rows" | awk -F'\t' -v t="$tk" '$2 == t { print $1; exit }')
    [ -n "$id" ] || { warn "$ph $tk 행이 보드에 없다 — 선행 Task 생략"; continue; }
    notion_api PATCH "pages/$id" "$(jq -n --argjson p "$(task_after_props "$ids")" '{ properties: $p }')" && ok "$ph $tk ← After $after"
  done <<EOF
$(grep -E '^- \[[ x]\] T[0-9]+\. ' "$plan")
EOF
}
sync_phases() { # docs/phases/README.md 의 phases:begin~end 표 (ai-stream.sh phases 가 만든다)
  local n=0 line nn link name lead dep st tasks res plan goal scope ids base; base=$(repo_url)
  while IFS= read -r line; do
    nn=$(trim "$(printf '%s' "$line" | cut -d'|' -f2)"); printf '%s' "$nn" | grep -qE '^[0-9]{2}$' || continue
    link=$(trim "$(printf '%s' "$line" | cut -d'|' -f3)"); name=$(printf '%s' "$link" | sed -E 's/^\[([^]]*)\].*/\1/')
    lead=$(trim "$(printf '%s' "$line" | cut -d'|' -f4)"); dep=$(trim "$(printf '%s' "$line" | cut -d'|' -f5)")
    st=$(trim "$(printf '%s' "$line" | cut -d'|' -f6)"); tasks=$(trim "$(printf '%s' "$line" | cut -d'|' -f7)"); res=$(trim "$(printf '%s' "$line" | cut -d'|' -f8)")
    plan="docs/phases/$nn-$name/PLAN.md"; goal=$(plan_goal "$plan"); scope=$(plan_scope "$plan"); ids=$(task_row_ids "$nn $name")
    send "${NOTION_PHASE_DB:-}" 번호 "$nn" "$(phase_props "$nn" "$nn $name" "$lead" "$dep" "$st" "$tasks" "$res" "$base/blob/main/$plan" "$goal" "$scope" "$ids")" && n=$((n + 1))
    sync_task_after "$plan" "$nn $name"
  done <<EOF
$(sed -n '/<!-- phases:begin -->/,/<!-- phases:end -->/p' docs/phases/README.md)
EOF
  say "Phases: ${n}행"
}

[ "$do_owners" -eq 1 ] && check_owners
[ "$do_prd" -eq 1 ] && sync_prd
[ "$do_adr" -eq 1 ] && sync_adr
[ "$do_ph" -eq 1 ] && sync_phases
exit 0
