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
const ConTractorSum = Loadable(lazy(() => import('pages/report/admin/contractor-sum/ConTractorSum')));

const Step1Completed = Loadable(lazy(() => import('pages/report/admin/Step1Completed')));
const Step2Completed = Loadable(lazy(() => import('pages/report/admin/Step2Completed')));
const Step3Completed = Loadable(lazy(() => import('pages/report/admin/Step3Completed')));
const Step4Completed = Loadable(lazy(() => import('pages/report/admin/Step4Completed')));

const StepsRecall = Loadable(lazy(() => import('pages/report/admin/steps-recall/StepRecalls')));

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
    },
    {
      path: 'contractorsum',
      element: <ConTractorSum />
    },
    {
      path: 'step1-completed',
      element: <Step1Completed />
    },
    {
      path: 'step2-completed',
      element: <Step2Completed />
    },
    {
      path: 'step3-completed',
      element: <Step3Completed />
    },
    {
      path: 'step4-completed',
      element: <Step4Completed />
    },
    {
      path: 'steps-recall',
      element: <StepsRecall />
    }
  ]
};

export default ReportRoutes;
