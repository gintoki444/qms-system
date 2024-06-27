import { useState, useEffect } from 'react';
// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
// import menuItem from 'menu-items';

// types
import { useSelector } from 'react-redux';

import * as permissionsRequest from '_api/permissionsRequest';

import {
  DashboardOutlined,
  BookOutlined,
  ShopOutlined,
  CarOutlined,
  UserOutlined,
  SafetyOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InboxOutlined,
  ContainerOutlined,
  QrcodeOutlined,
  PartitionOutlined,
  TeamOutlined,
  FileDoneOutlined,
  GoldOutlined,
  FundViewOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { ReactComponent as ForkliftIcon } from 'assets/icon/icon-forklift.svg';
import { ReactComponent as WarehouseIcon } from 'assets/icon/icon-warehouse.svg';
import { ReactComponent as LaberIcon } from 'assets/icon/icon-labor.svg';
import { ReactComponent as ScreenIcon } from 'assets/icon/icon-screen.svg';
import { ReactComponent as CompanyContra } from 'assets/icon/icon-company-contrac.svg';

const icons = {
  dashboard: DashboardOutlined,
  company: ShopOutlined,
  car: CarOutlined,
  drivers: UserOutlined,
  reserve: BookOutlined,
  queues: ContainerOutlined,
  searchQueues: QrcodeOutlined,
  step0: PartitionOutlined,
  weighEmpty: MenuUnfoldOutlined,
  getIn: InboxOutlined,
  weighProduct: MenuFoldOutlined,
  done: SafetyOutlined,
  screenDisploy: ScreenIcon,
  users: UserOutlined,
  warehouse: WarehouseIcon,
  checkers: FileDoneOutlined,
  forklifts: ForkliftIcon,
  companyContrac: CompanyContra,
  laborLines: LaberIcon,
  manageTeamloading: TeamOutlined,
  productsManagement: GoldOutlined,
  products: GoldOutlined,
  report: FundViewOutlined,
  permission: KeyOutlined
};

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  // let newMenuItem = menuItem;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermissions = useSelector((state) => state.auth?.user_permissions);
  const [pagesList, setPageList] = useState([]);

  useEffect(() => {
    if (userRole && Object.keys(userPermissions).length > 0 && pagesList.length === 0) {
      getGroupPagePermission();
    }
  }, [userRole, userPermissions, pagesList]);

  const getGroupPagePermission = () => {
    try {
      permissionsRequest.getAllGroupPagesPermission().then((response) => {
        setPageList((prevList) => {
          const updateData = [...prevList];

          if (updateData.length === 0) {
            response.length > 0 && response.map((x) => {
              let data = {
                id: x.group_name + x.group_id,
                title: x.group_id === 1 ? '' : x.group_name,
                type: x.group_type,
                children: []
              };

              const listPage = userPermissions.permission.filter(
                (option) => option.group_id === x.group_id && option.page_id !== 1 && option.page_id !== 2
              );

              listPage.map((result) => {
                let dataListPage = {
                  id: result.page_name + result.page_id,
                  title: result.page_title,
                  type: result.page_type,
                  url: result.page_url,
                  icon: icons[result.page_icon],
                  target: result.page_target === 0 ? false : true
                };
                data.children.push(dataListPage);
              });
              // data.children = response.filter((option) => option.group_id === x.group_id);

              if (data.children.length > 0) {
                updateData.push(data);
              }
            });
          }

          return updateData;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (userRole !== null && pagesList.length > 0) {
    // let filteredMenuItems = menuItem.items.filter((item) => {
    //   return userRole == item.roles.filter((x) => x == userRole);
    // });
    // console.log('filteredMenuItems :', filteredMenuItems);

    let filteredMenuItemsNew = pagesList;
    // console.log('filteredMenuItemsNew :', filteredMenuItemsNew);

    const navGroups = filteredMenuItemsNew.map((item) => {
      // if (userRole && item.roles === userRole) {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Fix - Navigation Group
            </Typography>
          );
      }
      // }
    });

    return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
  } else {
    // Render a loading state or handle the case where userRoles or menuItems are not available yet
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }
};

export default Navigation;
