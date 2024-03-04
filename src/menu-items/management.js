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
  title: 'ข้อมูลลูกค้า',
  type: 'group',
  roles: [1, 5, 8],
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
  ]
};

export default management;
