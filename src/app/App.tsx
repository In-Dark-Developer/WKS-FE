import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { routes } from '@/app/routes';

const router = createBrowserRouter(routes);

export function App() {
  return (
    <AppShell>
      <RouterProvider router={router} />
    </AppShell>
  );
}
