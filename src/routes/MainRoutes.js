import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

const Reserve = Loadable(lazy(() => import('pages/reserve/Reserve')));
const AddReserve = Loadable(lazy(() => import('pages/reserve/reserve-forms/AddReserve')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
// const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
// const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
// const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
// const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

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
          path: 'add',
          element: <AddReserve />
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
