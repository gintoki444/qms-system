import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout/index';
// import MinimalLayout from 'layout/MinimalLayout';

// render - login
// const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
// const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const DailyProductOut = Loadable(lazy(() => import('pages/report/admin/DailyProductOut')));
const OrderSumQty = Loadable(lazy(() => import('pages/report/admin/OrderSumQty')));
const CarsTimeInOut = Loadable(lazy(() => import('pages/report/admin/CarsTimeInOut')));

// ==============================|| AUTH ROUTING ||============================== //

const ReportRoutes = {
  path: '/report',
  element: <MainLayout />,
  children: [
    {
      path: 'dailyproductout',
      element: <DailyProductOut />
    },
    {
      path: 'ordersproductssum',
      element: <OrderSumQty />
    },
    {
      path: 'carstimeinout',
      element: <CarsTimeInOut />
    }
  ]
};

export default ReportRoutes;
