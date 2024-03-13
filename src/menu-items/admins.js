// assets
import {
  // DashboardOutlined,
  // ContainerOutlined,
  // BookOutlined,
  // ShopOutlined,
  // CarOutlined,
  UserOutlined,
  TeamOutlined
  // InboxOutlined,
  // SafetyOutlined,
  // MenuFoldOutlined,
  // MenuUnfoldOutlined
} from '@ant-design/icons';

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
      title: 'ข้อมูลผู้จัดการโกดัง',
      type: 'item',
      url: '/admin/warehouse',
      icon: UserOutlined,
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
    }
  ]
};

export default admins;
