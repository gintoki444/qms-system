// assets
import { SafetyOutlined, MenuUnfoldOutlined, MenuFoldOutlined, InboxOutlined } from '@ant-design/icons';

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const queues = {
  id: 'queues',
  title: 'จัดการคิวรับสินค้า',
  type: 'group',
  roles: 9,
  children: [
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
    }
  ]
};

export default queues;
