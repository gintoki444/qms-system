import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - Admins
const Users = Loadable(lazy(() => import('pages/User/Users')));
const AddUser = Loadable(lazy(() => import('pages/User/user-forms/AddUser')));
const UpdateUser = Loadable(lazy(() => import('pages/User/user-forms/UpdateUser')));

const Step1 = Loadable(lazy(() => import('pages/management/step1/Step1')));
const Step2 = Loadable(lazy(() => import('pages/management/step2/Step2')));
const Step3 = Loadable(lazy(() => import('pages/management/step3/Step3')));
const Step4 = Loadable(lazy(() => import('pages/management/step4/Step4')));

// ==============================|| AUTH ROUTING ||============================== //

const AdminsRoutes = {
  path: '/admin',
  element: <MainLayout />,
  children: [
    {
      path: 'users',
      children: [
        {
          path: '',
          element: <Users />
        },
        {
          path: 'add',
          element: <AddUser />
        },
        {
          path: 'update/:id',
          element: <UpdateUser />
        }
      ]
    },
    {
      path: 'step1',
      element: <Step1 />
    },
    {
      path: 'step2',
      element: <Step2 />
    },
    {
      path: 'step3',
      element: <Step3 />
    },
    {
      path: 'step4',
      element: <Step4 />
    }
  ]
};

export default AdminsRoutes;
