import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - Admins
const Users = Loadable(lazy(() => import('pages/User/Users')));
const AddUser = Loadable(lazy(() => import('pages/User/user-forms/AddUser')));
const UpdateUser = Loadable(lazy(() => import('pages/User/user-forms/UpdateUser')));

// render -  Manage Team Loading
const ManageTeamLoading = Loadable(lazy(() => import('pages/admin/manageTeam/ManageTeamLoading')));
const AddManageTeam = Loadable(lazy(() => import('pages/admin/manageTeam/manage-team-form/AddManageTeam')));

// render -  WareHouse Manage Team Loading
const WareHouse = Loadable(lazy(() => import('pages/admin/WareHouse/WareHouseManager')));
const AddWareHouse = Loadable(lazy(() => import('pages/admin/WareHouse/warehouse-forms/AddWareHouse')));
const UpdateWareHouse = Loadable(lazy(() => import('pages/admin/WareHouse/warehouse-forms/UpdateWarehouseManager')));

// render -  Checkers
const Checkers = Loadable(lazy(() => import('pages/admin/Checkers/Checkers')));
const AddChecker = Loadable(lazy(() => import('pages/admin/Checkers/checker-forms/AddChecker')));
const UpdateChecker = Loadable(lazy(() => import('pages/admin/Checkers/checker-forms/UpdateChecker')));

// render -  Forklifts
const Forklifts = Loadable(lazy(() => import('pages/admin/Forklifts/Forklifts')));
const AddForklift = Loadable(lazy(() => import('pages/admin/Forklifts/forklift-forms/AddForklift')));
const UpdateForklift = Loadable(lazy(() => import('pages/admin/Forklifts/forklift-forms/UpdateForklift')));

const Step0 = Loadable(lazy(() => import('pages/management/step0/Step0')));
const AddQueue = Loadable(lazy(() => import('pages/management/step0/step0-forms/AddQueue')));

// render -  Forklifts
const Products = Loadable(lazy(() => import('pages/admin/ProductsManagement/Product')));
const AddProducts = Loadable(lazy(() => import('pages/admin/ProductsManagement/product-forms/AddProducts')));
// const UpdateForklift = Loadable(lazy(() => import('pages/admin/Forklifts/forklift-forms/UpdateForklift')));

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
      path: 'manage-team-loading',
      children: [
        {
          path: '',
          element: <ManageTeamLoading />
        },
        {
          path: 'add',
          element: <AddManageTeam />
        }
        // {
        //   path: 'update/:id',
        //   element: <UpdateUser />
        // }
      ]
    },
    {
      path: 'warehouse',
      children: [
        {
          path: '',
          element: <WareHouse />
        },
        {
          path: 'add',
          element: <AddWareHouse />
        },
        {
          path: 'update/:id',
          element: <UpdateWareHouse />
        }
      ]
    },
    {
      path: 'checkers',
      children: [
        {
          path: '',
          element: <Checkers />
        },
        {
          path: 'add',
          element: <AddChecker />
        },
        {
          path: 'update/:id',
          element: <UpdateChecker />
        }
      ]
    },
    {
      path: 'forklifts',
      children: [
        {
          path: '',
          element: <Forklifts />
        },
        {
          path: 'add',
          element: <AddForklift />
        },
        {
          path: 'update/:id',
          element: <UpdateForklift />
        }
      ]
    },
    {
      path: 'product-register',
      children: [
        {
          path: '',
          element: <Products />
        },
        {
          path: 'add',
          element: <AddProducts />
        },
        // {
        //   path: 'update/:id',
        //   element: <UpdateForklift />
        // }
      ]
    },
    {
      path: 'step0',
      children: [
        {
          path: '',
          element: <Step0 />
        },
        {
          path: 'add-queues/:id',
          element: <AddQueue />
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
      children: [
        {
          path: '',
          element: <Step4 />
        }
      ]
    }
  ]
};

export default AdminsRoutes;
