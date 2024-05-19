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
  roles: [99],
  children: [
    {
      id: 'userReserves',
      title: 'ข้อมูลการจองคิว',
      type: 'item',
      url: '/reserve',
      icon: icons.BookOutlined
    }
  ]
};

export default adminSale;
