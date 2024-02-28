// assets
import { UserOutlined } from '@ant-design/icons';

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const admins = {
  id: 'admins',
  title: 'ผู้ดูแลระบบ',
  type: 'group',
  roles: 1,
  children: [
    {
      id: 'users',
      title: 'ข้อมูลผู้ใช้งาน',
      type: 'item',
      url: '/admin/users',
      icon: UserOutlined,
      target: false
      // breadcrumbs: false
    }
  ]
};

export default admins;
