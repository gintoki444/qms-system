// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboardUser = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  roles: 5,
  children: [
    {
      id: 'dashboard',
      title: 'แดชบอร์ด',
      type: 'item',
      url: '/',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboardUser;
