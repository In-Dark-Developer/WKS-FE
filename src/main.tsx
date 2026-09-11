import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';

// index.html 이 항상 #root 를 갖는다 — 없으면 앱이 뜰 수 없으므로 여기서 단언한다.
const container = document.getElementById('root')!;

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
