import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - printing
const ReservePrint = Loadable(lazy(() => import('pages/reserve/ReservePrint')));

// render - Queues printing
const QueuesPrint = Loadable(lazy(() => import('pages/queues/QueuesPrint')));

// render - Queues printing
const ProductPrint = Loadable(lazy(() => import('pages/admin/ProductsManagement/ProductPrint')));

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
    },
    {
      path: 'product-manager',
      element: <ProductPrint />
    }
  ]
};

export default PrintRoutes;
