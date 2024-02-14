// assets
import { DashboardOutlined, BookOutlined, PrinterOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  BookOutlined,
  PrinterOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'แดชบอร์ด',
      type: 'item',
      url: '/',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'reserves',
      title: 'จองคิวรับสินค้า',
      type: 'item',
      url: '/reserve',
      icon: icons.BookOutlined
    },
    {
      id: 'queue',
      title: 'ออกบัตรคิว',
      type: 'item',
      url: '#',
      icon: icons.PrinterOutlined
    },
    {
      id: 'low-weight',
      title: 'ชั่งเบา',
      type: 'item',
      url: '#',
      icon: ''
      // ,breadcrumbs: false
    }
  ]
};

export default dashboard;
