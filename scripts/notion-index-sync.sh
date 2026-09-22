#!/usr/bin/env bash
# notion-index-sync.sh — 저장소 문서를 Notion 색인 DB 에 복사한다 (git → Notion 단방향, dev push 마다 CI 가 돌린다).
#
#   scripts/notion-index-sync.sh [--prd] [--adr] [--phases] [--dry-run]
#     --prd      docs/prd/*.md 의 FR·NFR 표 → 🙋 요구사항 색인 (PRD)   (ID 로 upsert)
#     --adr      docs/decisions/ADR-*.md → 🏛️ ADR 색인               (번호 로 upsert)
#     --phases   docs/phases/README.md 표 → 📅 Phase 색인             (번호 로 upsert)
#     전부 생략하면 셋 다. --dry-run 은 Notion 을 부르지 않고 보낼 속성만 출력한다 (토큰 불필요).
#
# env: NOTION_TOKEN(필수, Actions secret) · NOTION_PRD_DB · NOTION_ADR_DB · NOTION_PHASE_DB · NOTION_TASK_DB(Task 보드 — Phase 행의 `Task 보드` 관계용, 없으면 관계 생략) (database id) · REPO_URL(GitHub 링크, 기본 origin)
# 색인은 사본이다 — 원본은 docs/ 이고 여기서 고친 값은 다음 push 에 덮어써진다. 사람이 채우는 열(ADR 색인의 `영역`)만 건드리지 않는다.
# Phase 열은 docs/phases/*/PLAN.md 에서 그 ID 를 언급하는 Phase 번호, 상태 열은 그 Phase 들의 Status(docs/phases/README.md)에서 이끌어낸다.
# ADR: docs/decisions/ADR-20260913-notion-index-sync.md

set -eo pipefail
. "$(cd "$(dirname "$0")" && pwd)/lib/common.sh"
. "$(cd "$(dirname "$0")" && pwd)/lib/notion.sh"

do_prd=0; do_adr=0; do_ph=0; dry=0
while [ $# -gt 0 ]; do
  case "$1" in
    --prd) do_prd=1;; --adr) do_adr=1;; --phases) do_ph=1;; --dry-run) dry=1;;
    -h|--help) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0;;
    *) die "알 수 없는 옵션 $1";;
  esac; shift
done
[ "$do_prd" -eq 0 ] && [ "$do_adr" -eq 0 ] && [ "$do_ph" -eq 0 ] && do_prd=1 && do_adr=1 && do_ph=1
command -v jq >/dev/null || die "jq 가 필요하다"
if [ "$dry" -eq 0 ]; then
  [ -n "${NOTION_TOKEN:-}" ] || { warn "NOTION_TOKEN 이 없다 — 동기화 생략"; exit 0; }
  [ "$do_prd" -eq 0 ] || [ -n "${NOTION_PRD_DB:-}" ] || die "NOTION_PRD_DB 를 지정한다"
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
phase_status() { # phase_status <NN> → PLANNED|IN_PROGRESS|DONE|…
  sed -n "s/^| $1 | [^|]* | [^|]* | [^|]* | \([A-Z_]*\) |.*/\1/p" docs/phases/README.md | head -n1
}
phases_of() { # phases_of <FR-n> → "03 05" (PLAN.md 본문에서 그 ID 를 언급하는 Phase, 공백 구분 — 멀티바이트 구분자는 sed/tr 이 로케일을 탄다)
  local f nn out=""
  for f in docs/phases/[0-9][0-9]-*/PLAN.md; do
    grep -qE "(^|[^A-Za-z0-9-])$1([^0-9]|$)" "$f" || continue
    nn=${f#docs/phases/}; nn=${nn%%-*}; out="${out:+$out }$nn"
  done
  printf '%s' "$out"
}
status_of() { # status_of "03 05" → 계획|구현중|완료
  [ -n "$1" ] || { echo 계획; return; }
  local nn st all_done=1 any_active=0
  for nn in $1; do
    st=$(phase_status "$nn")
    case "$st" in DONE|CLOSED) ;; IN_PROGRESS|REVIEW) any_active=1; all_done=0;; *) all_done=0;; esac
  done
  if [ "$all_done" -eq 1 ]; then echo 완료; elif [ "$any_active" -eq 1 ]; then echo 구현중; else echo 계획; fi
}
prd_props() { # prd_props <ID> <구분> <요구사항> <우선순위|""> <Phase> <상태>
  jq -n --arg id "$1" --arg kind "$2" --arg req "$3" --arg pri "$4" --arg ph "$5" --arg st "$6" '
    def text($v): { rich_text: [ { text: { content: $v } } ] };
      { "요구사항": { title: [ { text: { content: $req } } ] }, "ID": text($id), "구분": { select: { name: $kind } }, "Phase": text($ph), "상태": { select: { name: $st } } }
    + (if $pri == "" then {} else { "우선순위": { select: { name: $pri } } } end)'
}
sync_prd() {
  local n=0 line id req pri target kind ph st
  while IFS= read -r line; do
    id=$(trim "$(printf '%s' "$line" | cut -d'|' -f2)")
    req=$(trim "$(printf '%s' "$line" | cut -d'|' -f3)")
    case "$id" in
      FR-*)  kind=FR;  pri=$(trim "$(printf '%s' "$line" | cut -d'|' -f4)");;
      NFR-*) kind=NFR; pri=""; target=$(trim "$(printf '%s' "$line" | cut -d'|' -f4)"); [ -n "$target" ] && req="$req — $target";;
      *) continue;;
    esac
    ph=$(phases_of "$id"); st=$(status_of "$ph")
    send "${NOTION_PRD_DB:-}" ID "$id" "$(prd_props "$id" "$kind" "$req" "$pri" "${ph// /·}" "$st")" && n=$((n + 1))
  done <<EOF
$(grep -hE '^\| N?FR-[0-9]+ ' docs/prd/*.md)
EOF
  say "PRD: ${n}행"
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

[ "$do_prd" -eq 1 ] && sync_prd
[ "$do_adr" -eq 1 ] && sync_adr
[ "$do_ph" -eq 1 ] && sync_phases
exit 0
