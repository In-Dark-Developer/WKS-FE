#!/usr/bin/env bash
# notion-index-sync.sh — 저장소 문서를 Notion 색인 DB 에 복사한다 (git → Notion 단방향, main push 마다 CI 가 돌린다).
#
#   scripts/notion-index-sync.sh [--prd] [--adr] [--dry-run]
#     --prd      docs/PRD.md 의 FR·NFR 표 → 🙋 요구사항 색인 (PRD)   (ID 로 upsert)
#     --adr      docs/decisions/ADR-*.md → 🏛️ ADR 색인               (번호 로 upsert)
#     둘 다 생략하면 둘 다. --dry-run 은 Notion 을 부르지 않고 보낼 속성만 출력한다 (토큰 불필요).
#
# env: NOTION_TOKEN(필수, Actions secret) · NOTION_PRD_DB · NOTION_ADR_DB (database id) · REPO_URL(ADR GitHub 링크, 기본 origin)
# 색인은 사본이다 — 원본은 docs/ 이고 여기서 고친 값은 다음 push 에 덮어써진다. 사람이 채우는 열(ADR 색인의 `영역`)만 건드리지 않는다.
# Phase 열은 docs/phases/*/PLAN.md 에서 그 ID 를 언급하는 Phase 번호, 상태 열은 그 Phase 들의 Status(docs/phases/README.md)에서 이끌어낸다.
# ADR: docs/decisions/ADR-20260913-notion-index-sync.md

set -eo pipefail
. "$(cd "$(dirname "$0")" && pwd)/lib/common.sh"
. "$(cd "$(dirname "$0")" && pwd)/lib/notion.sh"

do_prd=0; do_adr=0; dry=0
while [ $# -gt 0 ]; do
  case "$1" in
    --prd) do_prd=1;; --adr) do_adr=1;; --dry-run) dry=1;;
    -h|--help) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0;;
    *) die "알 수 없는 옵션 $1";;
  esac; shift
done
[ "$do_prd" -eq 0 ] && [ "$do_adr" -eq 0 ] && do_prd=1 && do_adr=1
command -v jq >/dev/null || die "jq 가 필요하다"
if [ "$dry" -eq 0 ]; then
  [ -n "${NOTION_TOKEN:-}" ] || { warn "NOTION_TOKEN 이 없다 — 동기화 생략"; exit 0; }
  [ "$do_prd" -eq 0 ] || [ -n "${NOTION_PRD_DB:-}" ] || die "NOTION_PRD_DB 를 지정한다"
  [ "$do_adr" -eq 0 ] || [ -n "${NOTION_ADR_DB:-}" ] || die "NOTION_ADR_DB 를 지정한다"
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
$(grep -E '^\| N?FR-[0-9]+ ' docs/PRD.md)
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

[ "$do_prd" -eq 1 ] && sync_prd
[ "$do_adr" -eq 1 ] && sync_adr
exit 0
