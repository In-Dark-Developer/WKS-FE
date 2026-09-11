import type { RouteObject } from 'react-router-dom';

import { Placeholder } from '@/app/Placeholder';

// 이 파일은 Phase 03 T3 이 단독으로 소유한다 — 각 화면은 컴포넌트만 export 하고 등록은 여기서 한다.
export const routes: RouteObject[] = [{ path: '/', element: <Placeholder /> }];
