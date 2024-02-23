import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - Admins
const Users = Loadable(lazy(() => import('pages/User/Users')));
const AddUser = Loadable(lazy(() => import('pages/User/user-forms/AddUser')));
const UpdateUser = Loadable(lazy(() => import('pages/User/user-forms/UpdateUser')));

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
    }
  ]
};

export default AdminsRoutes;
