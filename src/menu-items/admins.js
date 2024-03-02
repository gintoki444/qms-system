// assets
import {
  ContainerOutlined,
  BookOutlined,
  ShopOutlined,
  CarOutlined,
  UserOutlined,
  InboxOutlined,
  SafetyOutlined,
  MenuFoldOutlined,MenuUnfoldOutlined
} from '@ant-design/icons';

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const admins = {
  id: 'admins',
  title: 'ผู้ดูแลระบบ',
  type: 'group',
  roles: 1,
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
      icon: BookOutlined
    },
    {
      id: 'userQueue',
      title: 'ข้อมูลคิว',
      type: 'item',
      url: '/queues',
      icon: ContainerOutlined
    },
    {
      id: 'weighEmpty',
      title: 'Step1-ชั่งเบา',
      type: 'item',
      url: '/admin/step1',
      icon: MenuUnfoldOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'getIn',
      title: 'Step2-รับสินค้า',
      type: 'item',
      url: '/admin/step2',
      icon: InboxOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'weighProduct',
      title: 'Step3-ชั่งหนัก',
      type: 'item',
      url: '/admin/step3',
      icon: MenuFoldOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'done',
      title: 'Step4-สำเร็จ',
      type: 'item',
      url: '/admin/step4',
      icon: SafetyOutlined,
      target: false
      // breadcrumbs: false
    },
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
