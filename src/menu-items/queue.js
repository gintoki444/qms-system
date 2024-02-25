// assets
import { SafetyOutlined, MenuUnfoldOutlined, MenuFoldOutlined, InboxOutlined} from '@ant-design/icons';

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const queues = {
  id: 'queues',
  title: 'จัดการคิวรับสินค้า',
  type: 'group',
  roles: '8',
  children: [
    {
      id: 'weighEmpty',
      title: 'ชั่งเบา',
      type: 'item',
      url: '/admin/step1',
      icon: MenuUnfoldOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'getIn',
      title: 'รับสินค้า',
      type: 'item',
      url: '/admin/step2',
      icon: InboxOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'weighProduct',
      title: 'ชั่งหนัก',
      type: 'item',
      url: '/admin/step3',
      icon: MenuFoldOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'done',
      title: 'สำเร็จ (ประตูทางออก)',
      type: 'item',
      url: '/admin/step4',
      icon: SafetyOutlined,
      target: false
      // breadcrumbs: false
    }
  ]
};

export default queues;
