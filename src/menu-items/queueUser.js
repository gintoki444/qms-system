// assets
import {
    ContainerOutlined
  } from '@ant-design/icons';
  
  // ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //
  
  const queuesUser = {
    id: 'queues',
    title: 'ข้อมูลคิวรับสินค้า',
    type: 'group',
    roles: [8],
    children: [
      {
        id: 'userQueue',
        title: 'ข้อมูลคิว',
        type: 'item',
        url: '/queues',
        icon: ContainerOutlined
      },
    ]
  };
  
  export default queuesUser;
  