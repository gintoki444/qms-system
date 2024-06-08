import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
  Stack,
  Backdrop,
  CircularProgress
} from '@mui/material';
import MainCard from 'components/MainCard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import './style.css'; // สำหรับการจัดสไตล์เพิ่มเติม

const apiUrl = process.env.REACT_APP_API_URL;

const iconMap = {
  manage_everything: <ManageAccountsIcon />,
  add_edit_delete_data: <EditIcon />,
  view_data: <VisibilityIcon />,
  no_access_to_view_data: <BlockIcon />
};

function RolesData() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissionOptions, setPermissionOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
    getPermissionList();
  }, []);

  const getPermissionList = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const fetchPageGroups = fetch(apiUrl + '/pagegroups', requestOptions).then((response) => response.json());
    const fetchPages = fetch(apiUrl + '/pages', requestOptions).then((response) => response.json());
    const fetchPagePermissions = fetch(apiUrl + '/page_permissions', requestOptions).then((response) => response.json());
    const fetchPermissions = fetch(apiUrl + '/permissions', requestOptions).then((response) => response.json());
    const fetchRoles = fetch(apiUrl + '/roles', requestOptions).then((response) => response.json());

    Promise.all([fetchPageGroups, fetchPages, fetchPagePermissions, fetchPermissions, fetchRoles])
      .then(([pageGroups, pages, pagePermissions, permissions, roles]) => {
        // Filter roles to include only those starting with "ICP-"
        const filteredRoles = roles.filter((role) => role.role_name.startsWith('ICP-'));
        setRoles(filteredRoles);

        // Filter permissions to include only those whose description starts with "ICP-"
        const filteredPermissions = permissions.filter(
          (permission) => permission.permission_description && permission.permission_description.startsWith('ICP-')
        );
        console.log('filteredPermissions :', filteredPermissions);

        // Create permission options
        setPermissionOptions(
          filteredPermissions.map((permission) => ({
            value: permission.permission_name,
            label: (
              <Stack direction="row" alignItems="center" spacing={1}>
                {iconMap[permission.permission_name] || <BlockIcon />}
                <span>{replaceText(permission.permission_description) || replaceText(permission.permission_name)}</span>
              </Stack>
            ),
            id: permission.permission_id
          }))
        );

        // Transform data
        const transformedData = pageGroups.map((group) => ({
          category: group.group_name,
          permissions: pages
            .filter((page) => page.group_id === group.group_id)
            .map((page) => ({
              page_id: page.page_id,
              name: page.page_title,
              permissions: filteredRoles.map((role) => {
                const pagePermission = pagePermissions.find((p) => p.page_id === page.page_id && p.role_id === role.role_id);
                return pagePermission ? pagePermission.permission_name : 'none';
              })
            }))
        }));

        setData(transformedData);
        setOpen(false);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const handlePermissionChange = (categoryIndex, pageIndex, roleIndex, event) => {
    setOpen(true);
    const newData = [...data];
    newData[categoryIndex].permissions[pageIndex].permissions[roleIndex] = event.target.value;
    setData(newData);

    // Find the page_id, role_id, and permission_id
    const page = newData[categoryIndex].permissions[pageIndex];
    const role = roles[roleIndex];
    const permission = permissionOptions.find((option) => option.value === event.target.value);

    // Log the values
    console.log('page_id:', page.page_id, 'role_id:', role.role_id, 'permission_id:', permission.id);
    //alert(`page_id: ${page.page_id}, role_id: ${role.role_id}, permission_id: ${permission.id}`);

    // Prepare and send the POST request to save the updated permission
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      page_id: page.page_id,
      role_id: role.role_id,
      permission_id: permission.id
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/save_page_permission', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result) {
          enqueueSnackbar('บันทึกข้อมูลสิทธิ์สำเร็จ!', { variant: 'success' });
          setOpen(false);
        } else {
          setOpen(false);
          enqueueSnackbar('บันทึกข้อมูลสิทธิ์ไม่สำเร็จ', { variant: 'error' });
        }
        // alert(`page_id: ${page.page_id}, role_id: ${role.role_id}, permission_id: ${permission.id} ${result}`);
      })
      .catch((error) => console.error(error));
  };

  const replaceText = (text) => {
    let spacedString = text;
    if (text) {
      spacedString = text
        .replace('ICP-สามารถ', '')
        .replace('ICP-ไม่สามารถดูข้อมูลได้', 'ดูข้อมูลไม่ได้')
        .replace('เพิ่ม แก้ไข ลบ', 'เพิ่ม,ลบ,แก้ไข');
    }
    // console.log(text);
    return spacedString;
  };

  const getColor = (id) => {
    let main;
    switch (id) {
      case 'manage_everything':
        main = '#a1d0be!important';
        break;
      case 'add_edit_delete_data':
        main = '#ffc77a!important';
        break;
      case 'view_data':
        main = '#aad8e5!important';
        break;
      case 'no_access_to_view_data':
        main = '#f68b71!important';
        break;
      case 0:
        main = '#86a5c46e!important';
        break;
      case 1:
        main = '#c6e0e06e!important';
        break;
      case 2:
        main = '#dfefd06e!important';
        break;
      case 3:
        main = '#f8d7c16e!important';
        break;
      case 4:
        main = '#4f80c038!important';
        break;
      case 5:
        main = '#f2fac06e!important';
        break;
      case 6:
        main = '#d9debb6e!important';
        break;
      case 7:
        main = '#a1d0be!important';
        break;
      case 8:
        main = '#ffc77a!important';
        break;
      case 9:
        main = '#aad8e5!important';
        break;
      case 10:
        main = '#f68b71!important';
        break;
      default:
        main = '#f68b71!important';
    }
    return main;
  };

  return (
    <div className="App">
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <MainCard content={false} sx={{ mt: 1.5, p: 3, minWidth: '100%', width: 'fit-content' }}>
        <Typography variant="h3">การกำหนดสิทธิ์การใช้งานระบบ</Typography>
        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
            position: 'relative',
            display: 'block',
            maxWidth: '100%',
            '& td, & th': { whiteSpace: 'nowrap' }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>หมวดหมู่</TableCell>
                <TableCell>หน้า</TableCell>
                {roles.map((role, index) => (
                  <TableCell key={index}>{role.role_name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <TableRow sx={{ background: getColor(categoryIndex) }}>
                    <TableCell rowSpan={category.permissions.length + 1}>{category.category}</TableCell>
                  </TableRow>
                  {category.permissions.map((page, pageIndex) => (
                    <TableRow key={pageIndex} sx={{ background: getColor(categoryIndex) }}>
                      <TableCell>{page.name}</TableCell>
                      {page.permissions.map((value, roleIndex) => (
                        <TableCell key={roleIndex}>
                          <InputLabel sx={{ background: 'transparent!important' }}>{roles[roleIndex].role_name}</InputLabel>
                          <FormControl variant="outlined" fullWidth>
                            <Select
                              value={value}
                              onChange={(event) => handlePermissionChange(categoryIndex, pageIndex, roleIndex, event)}
                              // label={roles[roleIndex].role_name && replaceText(roles[roleIndex].role_name)}
                              sx={{ background: getColor(value) }}
                            >
                              {permissionOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value} sx={{ background: getColor(option.id) }}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </div>
  );
}

export default RolesData;
