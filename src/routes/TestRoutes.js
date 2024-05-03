import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - printing
const ProductManage = Loadable(lazy(() => import('pages/demo/Productmanage')));

const TestsRoutes = {
  path: '/test',
  element: <MinimalLayout />,
  children: [
    {
      path: 'product-manage',
      element: <ProductManage />
    }
    //   {
    //     path: 'queues',
    //     element: <QueuesPrint />
    //   },
    //   {
    //     path: 'product-manager',
    //     element: <ProductPrint />
    //   }
  ]
};

export default TestsRoutes;
