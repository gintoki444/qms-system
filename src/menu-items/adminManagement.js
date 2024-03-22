// assets
import { ContainerOutlined, BookOutlined, ShopOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  BookOutlined,
  ContainerOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const adminManagement = {
  id: 'management',
  title: 'การจัดการข้อมูล',
  type: 'group',
  roles: [8,9,10],
  children: [
    {
      id: 'admincompany',
      title: 'ข้อมูลร้านค้า / บริษัท',
      type: 'item',
      url: '/company',
      icon: ShopOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'admincar',
      title: 'ข้อมูลรถ',
      type: 'item',
      url: '/car',
      icon: CarOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'admindrivers',
      title: 'ข้อมูลคนขับรถ',
      type: 'item',
      url: '/drivers',
      icon: UserOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'adminReserves',
      title: 'ข้อมูลการจองคิว',
      type: 'item',
      url: '/reserve',
      icon: icons.BookOutlined
    },
    {
      id: 'adminQueue',
      title: 'ข้อมูลคิว',
      type: 'item',
      url: '/queues',
      icon: icons.ContainerOutlined
    }
  ]
};

export default adminManagement;
