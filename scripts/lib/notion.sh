# notion.sh — Notion REST 호출 공통 (notion-sync.sh · notion-index-sync.sh 가 source 한다). bash 3.2+, curl, jq.
# env: NOTION_TOKEN. 호출 결과 본문은 전역 $body 에 남는다.

notion_api() { # notion_api <METHOD> <path> [json]
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

notion_find() { # notion_find <db_id> <rich_text 속성> <값> → page_id ("" 이면 없음)
  notion_api POST "databases/$1/query" "$(jq -n --arg p "$2" --arg v "$3" '{ filter: { property: $p, rich_text: { equals: $v } }, page_size: 1 }')" || return 1
  printf '%s' "$body" | jq -r '.results[0].id // empty'
}

notion_query_page() { # notion_query_page <db_id> [start_cursor] → 결과는 $body
  notion_api POST "databases/$1/query" \
    "$(jq -n --arg c "${2:-}" '{ page_size: 100 } + (if $c == "" then {} else { start_cursor: $c } end)')"
}

notion_upsert() { # notion_upsert <db_id> <find 속성> <find 값> <properties_json> → "created"|"updated"
  local id; id=$(notion_find "$1" "$2" "$3") || return 1
  if [ -n "$id" ]; then
    notion_api PATCH "pages/$id" "$(jq -n --argjson p "$4" '{ properties: $p }')" && echo updated
  else
    notion_api POST "pages" "$(jq -n --arg db "$1" --argjson p "$4" '{ parent: { database_id: $db }, properties: $p }')" && echo created
  fi
}
