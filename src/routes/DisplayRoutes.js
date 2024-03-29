import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - Queues printing
const QueuesDisplay = Loadable(lazy(() => import('pages/displays/QueuesDisplay')));

// ==============================|| AUTH ROUTING ||============================== //

const DisplayRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'queues-screen',
      element: <QueuesDisplay />
    }
  ]
};

export default DisplayRoutes;
