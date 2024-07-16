import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import ManageTeamNew from 'pages/admin/manageTeam/ManageTeamNew';

// render - Admins
const Users = Loadable(lazy(() => import('pages/User/Users')));
const AddUser = Loadable(lazy(() => import('pages/User/user-forms/AddUser')));
const UpdateUser = Loadable(lazy(() => import('pages/User/user-forms/UpdateUser')));

// render -  Manage Team Loading
const ManageTeam = Loadable(lazy(() => import('pages/admin/manageTeam/ManageTeam')));
const ManageTeamLoading = Loadable(lazy(() => import('pages/admin/manageTeam/ManageTeamLoading')));
const ManageTeamTable = Loadable(lazy(() => import('pages/admin/manageTeam/ManageTeamLoadingTable')));
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

const TestCashInOut = Loadable(lazy(() => import('pages/admin/TestDemo/TestCashInOut')));

// render -  LayborLine
// const LaborLines = Loadable(lazy(() => import('pages/admin/LaborLines/LaborLines')));
// const AddForklift = Loadable(lazy(() => import('pages/admin/Forklifts/forklift-forms/AddForklift')));
// const UpdateForklift = Loadable(lazy(() => import('pages/admin/Forklifts/forklift-forms/UpdateForklift')));

// render -  Contractors
const CompanyContractors = Loadable(lazy(() => import('pages/admin/CompanyContractors/CompanyContrac')));
const AddCompanyContractors = Loadable(lazy(() => import('pages/admin/CompanyContractors/conpanyCon-forms/AddCompanyCon')));
const UpdateCompanyContractors = Loadable(lazy(() => import('pages/admin/CompanyContractors/conpanyCon-forms/UpdateCompanyCon')));

// render -  Contractors
const Contractors = Loadable(lazy(() => import('pages/admin/Contractors/Contractors')));
const AddContractor = Loadable(lazy(() => import('pages/admin/Contractors/contractor-forms/AddContractor')));
const UpdateContractor = Loadable(lazy(() => import('pages/admin/Contractors/contractor-forms/UpdateContractor')));

const Step0 = Loadable(lazy(() => import('pages/management/step0/Step0')));
const AddQueue = Loadable(lazy(() => import('pages/management/step0/step0-forms/AddQueue')));

// render -  Product management
const ProductsManagement = Loadable(lazy(() => import('pages/admin/ProductsManagement/ProductManagement')));
const AddProductManagement = Loadable(lazy(() => import('pages/admin/ProductsManagement/product-forms/AddProductManagement')));
const UpdateProductManagement = Loadable(lazy(() => import('pages/admin/ProductsManagement/product-forms/UpdateProductManagement')));
const AddProductReceive = Loadable(lazy(() => import('pages/admin/ProductsManagement/product-forms/AddProductReceive')));
const AddCutOffProduct = Loadable(lazy(() => import('pages/admin/ProductsManagement/product-forms/AddCutOffProduct')));
const ProductsDetails = Loadable(lazy(() => import('pages/admin/ProductsManagement/ProductDetails')));
const ProductsHistory = Loadable(lazy(() => import('pages/admin/ProductsManagement/ProductHistory')));

// render -  Product management
const Products = Loadable(lazy(() => import('pages/admin/Products/Products')));
const AddProducts = Loadable(lazy(() => import('pages/admin/Products/product-forms/AddProducts')));
const UpdateProducts = Loadable(lazy(() => import('pages/admin/Products/product-forms/UpdateProducts')));

const Step1 = Loadable(lazy(() => import('pages/management/step1/Step1')));
const Step2 = Loadable(lazy(() => import('pages/management/step2/Step2')));
const Step3 = Loadable(lazy(() => import('pages/management/step3/Step3')));
const Step4 = Loadable(lazy(() => import('pages/management/step4/Step4')));

// render -  Permission management
const Permission = Loadable(lazy(() => import('pages/admin/Permission/Permission')));

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
      path: 'tests',
      children: [
        // {
        //   path: '',
        //   element: <Users />
        // },
        {
          path: 'cash-in-out',
          element: <TestCashInOut />
        }
      ]
    },
    {
      path: 'manage-team-loading',
      children: [
        {
          path: '',
          // element: <ManageTeamLoading />
          element: <ManageTeamNew />
        },
        {
          path: 'manage-page-own',
          element: <ManageTeamLoading />
        },
        {
          path: 'manage-page',
          element: <ManageTeam />
        },
        {
          path: 'manage-page-table',
          element: <ManageTeamTable />
        },
        {
          path: 'add',
          element: <AddManageTeam />
        },
        {
          path: 'add/:id',
          element: <AddManageTeam />
        }
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
      path: 'company-contractors',
      children: [
        {
          path: '',
          element: <CompanyContractors />
        },
        {
          path: 'add',
          element: <AddCompanyContractors />
        },
        {
          path: 'update/:id',
          element: <UpdateCompanyContractors />
        }
      ]
    },
    {
      path: 'contractors',
      children: [
        {
          path: '',
          element: <Contractors />
        },
        {
          path: 'add',
          element: <AddContractor />
        },
        {
          path: 'update/:id',
          element: <UpdateContractor />
        }
      ]
    },
    {
      path: 'product-register',
      children: [
        {
          path: '',
          element: <ProductsManagement />
        },
        {
          path: 'add',
          element: <AddProductManagement />
        },
        {
          path: 'update/:id',
          element: <UpdateProductManagement />
        },
        {
          path: 'add-receive/:id',
          element: <AddProductReceive />
        },
        {
          path: 'add-cutoff/:id',
          element: <AddCutOffProduct />
        },
        {
          path: 'details/:id',
          element: <ProductsDetails />
        },
        {
          path: 'historys',
          element: <ProductsHistory />
        }
      ]
    },
    {
      path: 'products',
      children: [
        {
          path: '',
          element: <Products />
        },
        {
          path: 'add',
          element: <AddProducts />
        },
        {
          path: 'update/:id',
          element: <UpdateProducts />
        }
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
    },
    {
      path: 'permission',
      element: <Permission />
    }
  ]
};

export default AdminsRoutes;
