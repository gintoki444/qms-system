import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - printing
const ProductManage = Loadable(lazy(() => import('pages/demo/Productmanage')));
const TestReportLog = Loadable(lazy(() => import('pages/admin/TestDemo/TestReportLog')));

const TestsRoutes = {
  path: '/test',
  element: <MinimalLayout />,
  children: [
    {
      path: 'product-manage',
      element: <ProductManage />
    },
    {
      path: 'report-log',
      element: <TestReportLog />
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
