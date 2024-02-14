// assets
import { ShopOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const management = {
  id: 'management',
  title: 'การจัดการข้อมูล',
  type: 'group',
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
      title: 'ข้อมูลรถบรรทุก/พ่วง',
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
    }
  ]
};

export default management;
