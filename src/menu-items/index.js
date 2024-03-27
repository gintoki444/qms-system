// project import
import dashboard from './dashboard';
// import dashboardUser from './dashboardUser';
import management from './management';
import admins from './admins';
import queues from './queue';
import adminSale from './adminSale';
// import adminManagement from './adminManagement';
import report from './report';
import queuesUser from './queueUser';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  // items: [dashboard, pages, utilities, support]
  items: [
    dashboard,
    // dashboardUser,
    management,
    queues,
    queuesUser,
    admins,
    adminSale,
    // adminManagement,
    report
  ]
};

export default menuItems;
