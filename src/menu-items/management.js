// assets
import { ContainerOutlined, BookOutlined, ShopOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  BookOutlined,
  ContainerOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const management = {
  id: 'management',
  title: 'การจัดการข้อมูล',
  type: 'group',
  roles: '3',
  children: [
    {
      id: 'company',
      title: 'ข้อมูลร้านค้า/บริษัท',
      type: 'item',
      url: '/company',
      icon: ShopOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'car',
      title: 'ข้อมูลรถ',
      type: 'item',
      url: '/car',
      icon: CarOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'drivers',
      title: 'ข้อมูลคนขับรถ',
      type: 'item',
      url: '/drivers',
      icon: UserOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'userReserves',
      title: 'ข้อมูลการจองคิว',
      type: 'item',
      url: '/reserve',
      icon: icons.BookOutlined
    },
    {
      id: 'userQueue',
      title: 'ข้อมูลคิว',
      type: 'item',
      url: '/queues',
      icon: icons.ContainerOutlined
    }
  ]
};

export default management;
