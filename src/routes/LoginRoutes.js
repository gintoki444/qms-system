import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

const QueueNonLogin = Loadable(lazy(() => import('pages/queues/QueueNonLogin')));
// ==============================|| AUTH ROUTING ||============================== //
// const QueuesDisplayTest = Loadable(lazy(() => import('pages/displays/QueuesDisplayTest')));
const QueuesDisplayTest2 = Loadable(lazy(() => import('pages/displays/QueuesDisplayTest2')));

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: 'queues-detail/:id',
      element: <QueueNonLogin />
    },
    {
      path: 'test-tv',
      // element: <QueuesDisplayTest />
      element: <QueuesDisplayTest2 />
    },
    {
      path: 'test-tv2',
      element: <QueuesDisplayTest2 />
    }
  ]
};

export default LoginRoutes;
