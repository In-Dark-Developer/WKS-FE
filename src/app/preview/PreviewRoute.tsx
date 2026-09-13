import { Link, useParams, useSearchParams, type ActionFunctionArgs } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';

import { findPreviewScreen, previewScreens, type PreviewEntry } from './previewScreens';

// `/preview/*` — 개발 서버에서만 붙는다(App.tsx). 화면은 가짜 데이터로만 그리고 백엔드를 부르지 않는다.
export function PreviewRoute() {
  const slug = useParams()['*'];
  if (!slug) return <PreviewList />;

  const entry = findPreviewScreen(slug);
  if (!entry) {
    return (
      <AppShell>
        <p className="text-ui-14 text-primary">등록되지 않은 화면이에요: {slug}</p>
        <Link className="text-ui-14 text-brand underline" to="/preview">
          목록으로
        </Link>
      </AppShell>
    );
  }
  return <PreviewScreenView entry={entry} />;
}

export async function previewAction(args: ActionFunctionArgs): Promise<unknown> {
  const action = findPreviewScreen(args.params['*'])?.screen.action;
  return action ? action(args) : null;
}

function PreviewList() {
  return (
    <AppShell>
      <h1 className="font-display text-display-24 text-primary">퍼블리싱 확인</h1>
      <ol className="mt-16 flex flex-col gap-8">
        {previewScreens.map(({ slug, screen }) => (
          <li key={slug}>
            <Link
              className="flex flex-col rounded-12 bg-opacity-card-neutral-0-70 px-16 py-12"
              to={slug}
            >
              <span className="text-ui-16 font-semibold text-primary">{screen.title}</span>
              <span className="text-ui-12 text-secondary">/preview/{slug}</span>
            </Link>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}

function PreviewScreenView({ entry }: { entry: PreviewEntry }) {
  const [searchParams] = useSearchParams();
  const stateNames = Object.keys(entry.screen.states);
  const requested = searchParams.get('state');
  const stateName = requested && stateNames.includes(requested) ? requested : stateNames[0];
  const State = stateName === undefined ? undefined : entry.screen.states[stateName];

  return (
    <AppShell backdrop={entry.screen.backdrop}>
      <nav
        aria-label="퍼블리싱 확인"
        className="flex flex-wrap items-center gap-8 rounded-12 bg-opacity-overlay-neutral-900-80 px-12 py-8 text-ui-12 text-neutral-0"
      >
        <Link className="underline" to="/preview">
          목록
        </Link>
        <span className="font-semibold">{entry.screen.title}</span>
        {stateNames.length > 1
          ? stateNames.map((name) => (
              <Link
                aria-current={name === stateName ? 'page' : undefined}
                className="rounded-999 px-8 aria-[current=page]:bg-neutral-0 aria-[current=page]:text-primary"
                key={name}
                to={{ search: `?state=${encodeURIComponent(name)}` }}
              >
                {name}
              </Link>
            ))
          : null}
      </nav>
      {State ? <State key={stateName} /> : null}
    </AppShell>
  );
}
