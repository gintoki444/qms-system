import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import AdminsRoutes from './AdminRoutes';
import OperationRoutes from './OperationRoutes';
import PrintRoutes from './PrintsRoutes';
import ReportRoutes from './ReportRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, LoginRoutes, AdminsRoutes, OperationRoutes, PrintRoutes, ReportRoutes]);
}
