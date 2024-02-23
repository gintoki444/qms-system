import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - Admins
const Queue = Loadable(lazy(() => import('pages/queues/Queues')));
// const AddUser = Loadable(lazy(() => import('pages/User/user-forms/AddUser')));
// const UpdateUser = Loadable(lazy(() => import('pages/User/user-forms/UpdateUser')));

// ==============================|| AUTH ROUTING ||============================== //

const OperationRoutes = {
  path: '/admin',
  element: <MainLayout />,
  children: [
    {
      path: 'queues',
      children: [
        {
          path: '',
          element: <Queue />
        }
        // {
        //   path: 'add',
        //   element: <AddUser />
        // },
        // {
        //   path: 'update/:id',
        //   element: <UpdateUser />
        // }
      ]
    }
  ]
};

export default OperationRoutes;
