// assets
import { UserOutlined, TeamOutlined, FileDoneOutlined, GoldOutlined } from '@ant-design/icons';
import { ReactComponent as ForkliftIcon } from 'assets/icon/icon-forklift.svg';
import { ReactComponent as WarehouseIcon } from 'assets/icon/icon-warehouse.svg';
import { ReactComponent as LaberIcon } from 'assets/icon/icon-labor.svg';
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const admins = {
  id: 'admins',
  title: 'ผู้ดูแลระบบ',
  type: 'group',
  roles: [1],
  children: [
    {
      id: 'users',
      title: 'ข้อมูลผู้ใช้งาน',
      type: 'item',
      url: '/admin/users',
      icon: UserOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'warehouse',
      title: 'ข้อมูลหัวหน้าโกดัง',
      type: 'item',
      url: '/admin/warehouse',
      icon: WarehouseIcon,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'checkers',
      title: 'ข้อมูลพนักงานจ่ายสินค้า',
      type: 'item',
      url: '/admin/checkers',
      icon: FileDoneOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'forklifts',
      title: 'ข้อมูลโฟล์คลิฟท์',
      type: 'item',
      url: '/admin/forklifts',
      icon: ForkliftIcon,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'laborLines',
      title: 'ข้อมูลสายแรงงานขึ้นสินค้า',
      type: 'item',
      url: '/admin/contractors',
      icon: LaberIcon,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'manageTeamloading',
      title: 'ข้อมูลทีมจ่ายสินค้า',
      type: 'item',
      url: '/admin/manage-team-loading',
      icon: TeamOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'productsManagement',
      title: 'ข้อมูลกองสินค้า',
      type: 'item',
      url: '/admin/product-register',
      icon: GoldOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'products',
      title: 'ข้อมูลสินค้า (สูตร)',
      type: 'item',
      url: '/admin/products',
      icon: GoldOutlined,
      target: false
      // breadcrumbs: false
    }
  ]
};

export default admins;
