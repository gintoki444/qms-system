// assets
import { ContainerOutlined, BookOutlined } from '@ant-design/icons';

// icons
const icons = {
  BookOutlined,
  ContainerOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const adminSale = {
  id: 'management',
  title: 'ข้อมูลคิวรับสินค้า',
  type: 'group',
  roles: [10],
  children: [
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

export default adminSale;
