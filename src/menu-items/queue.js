// assets
import {
  SafetyOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InboxOutlined,
  ContainerOutlined,
  QrcodeOutlined,
  PartitionOutlined
} from '@ant-design/icons';

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const queues = {
  id: 'queues',
  title: 'ข้อมูลคิวรับสินค้า',
  type: 'group',
  roles: [1, 9,11],
  children: [
    {
      id: 'userQueue',
      title: 'ข้อมูลคิว',
      type: 'item',
      url: '/queues',
      icon: ContainerOutlined
    },
    {
      id: 'searchCheck',
      title: 'ตรวจสอบข้อมูลคิว',
      type: 'item',
      url: '/queues/search',
      icon: QrcodeOutlined
    },
    {
      id: 'step0',
      title: 'Step0-ทีมจ่ายสินค้า',
      type: 'item',
      url: '/admin/step0',
      icon: PartitionOutlined
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
      title: 'Step4-รถออกจากโรงงาน',
      type: 'item',
      url: '/admin/step4',
      icon: SafetyOutlined,
      target: false
      // breadcrumbs: false
    }
  ]
};

export default queues;
