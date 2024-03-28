// assets
import { FundViewOutlined } from '@ant-design/icons';

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const report = {
  id: 'report',
  title: 'รายงาน',
  type: 'group',
  roles: [1],
  children: [
    {
      id: 'dailyproductout',
      title: 'รายการจ่ายสินค้าประจำวัน',
      type: 'item',
      url: '/report/dailyproductout',
      icon: FundViewOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'ordersproductssum',
      title: 'สรุปยอดจ่ายประจำวันที่',
      type: 'item',
      url: '/report/ordersproductssum',
      icon: FundViewOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'carstimeinout',
      title: 'รายงานรถเข้า-ออกโรงงาน',
      type: 'item',
      url: '/report/carstimeinout',
      icon: FundViewOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'step1',
      title: 'รายงาน Step1-ชั่งเบา',
      type: 'item',
      url: '/report/step1-completed',
      icon: FundViewOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'step2',
      title: 'รายงาน Step2-ขึ้นสินค้า',
      type: 'item',
      url: '/report/step2-completed',
      icon: FundViewOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'step3',
      title: 'รายงาน Step3-ชั่งหนัก',
      type: 'item',
      url: '/report/step3-completed',
      icon: FundViewOutlined,
      target: false
      // breadcrumbs: false
    },
    {
      id: 'step4',
      title: 'รายงาน Step4-เสร็จสิ้น',
      type: 'item',
      url: '/report/step4-completed',
      icon: FundViewOutlined,
      target: false
      // breadcrumbs: false
    }
  ]
};

export default report;
