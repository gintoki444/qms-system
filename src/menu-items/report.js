// assets
import { FundViewOutlined} from '@ant-design/icons';

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
    
  ]
};

export default report;
