import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

const Reserve = Loadable(lazy(() => import('pages/reserve/Reserve')));
const ReserveDetail = Loadable(lazy(() => import('pages/reserve/ReserveDetail')));
const AddReserve = Loadable(lazy(() => import('pages/reserve/reserve-forms/AddReserve')));
const UpdateReserve = Loadable(lazy(() => import('pages/reserve/reserve-forms/UpdateReserve')));
const AddOrder = Loadable(lazy(() => import('pages/order/order-forms/AddOrder')));

// Queues List
const Queues = Loadable(lazy(() => import('pages/queues/Queues')));
const QueuesDetail = Loadable(lazy(() => import('pages/queues/QueueDetail')));
const QueuesPrint = Loadable(lazy(() => import('pages/queues/QueuesPrint')));

// render - management
const Company = Loadable(lazy(() => import('pages/company/Company')));
const AddCompany = Loadable(lazy(() => import('pages/company/company-forms/AddCompany')));
const UpdateCompany = Loadable(lazy(() => import('pages/company/company-forms/UpdateCompany')));

const Car = Loadable(lazy(() => import('pages/car/Car')));
const AddCar = Loadable(lazy(() => import('pages/car/car-forms/AddCar')));
const UpdateCar = Loadable(lazy(() => import('pages/car/car-forms/UpdateCar')));

const Drivers = Loadable(lazy(() => import('pages/drivers/Drivers')));
const AddDrivers = Loadable(lazy(() => import('pages/drivers/driver-forms/AddDrivers')));
const UpdateDrivers = Loadable(lazy(() => import('pages/drivers/driver-forms/UpdateDrivers')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/reserve',
      children: [
        {
          path: '',
          element: <Reserve />
        },
        {
          path: 'detail/:id',
          element: <ReserveDetail />
        },
        {
          path: 'add',
          element: <AddReserve />
        },
        {
          path: 'update/:id',
          element: <UpdateReserve />
        }
      ]
    },
    {
      path: '/queues',
      children: [
        {
          path: '',
          element: <Queues />
        },
        {
          path: 'detail/:id',
          element: <QueuesDetail />
        },
        {
          path: 'prints',
          element: <QueuesPrint />
        }
      ]
    },
    {
      path: '/order',
      children: [
        {
          path: 'add/:id',
          element: <AddOrder />
        }
      ]
    },
    {
      path: '/company',
      children: [
        {
          path: '',
          element: <Company />
        },
        {
          path: 'add',
          element: <AddCompany />
        },
        {
          path: 'update/:id',
          element: <UpdateCompany />
        }
      ]
    },
    {
      path: '/car',
      children: [
        {
          path: '',
          element: <Car />
        },
        {
          path: 'add',
          element: <AddCar />
        },
        {
          path: 'update/:id',
          element: <UpdateCar />
        }
      ]
    },
    {
      path: '/drivers',
      children: [
        {
          path: '',
          element: <Drivers />
        },
        {
          path: 'add',
          element: <AddDrivers />
        },
        {
          path: 'update/:id',
          element: <UpdateDrivers />
        }
      ]
    }
  ]
};

export default MainRoutes;
