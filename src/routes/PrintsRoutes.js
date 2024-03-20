import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - printing
const ReservePrint = Loadable(lazy(() => import('pages/reserve/ReservePrint')));

// render - Queues printing
const QueuesPrint = Loadable(lazy(() => import('pages/queues/QueuesPrint')))

// ==============================|| AUTH ROUTING ||============================== //

const PrintRoutes = {
  path: '/prints',
  element: <MinimalLayout />,
  children: [
    {
      path: 'reserve',
      element: <ReservePrint />
    },
    {
      path: 'queues',
      element: <QueuesPrint />
    }
  ]
};

export default PrintRoutes;
