import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - printing
const ReservePrint = Loadable(lazy(() => import('pages/reserve/ReservePrint')));

// ==============================|| AUTH ROUTING ||============================== //

const PrintRoutes = {
  path: '/prints',
  element: <MinimalLayout />,
  children: [
    {
      path: 'reserve',
      element: <ReservePrint />
    }
  ]
};

export default PrintRoutes;
