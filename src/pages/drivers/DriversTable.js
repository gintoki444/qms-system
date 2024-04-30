import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, ButtonGroup, Button, Tooltip, Typography, Backdrop, CircularProgress } from '@mui/material';

import axios from '../../../node_modules/axios/index';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as driverRequest from '_api/driverRequest';
import MUIDataTable from 'mui-datatables';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
// const headCells = [
//   {
//     id: 'driver_No',
//     align: 'center',
//     width: '5%',
//     disablePadding: false,
//     label: 'ลำดับ'
//   },
//   {
//     id: 'fullName',
//     align: 'left',
//     disablePadding: true,
//     label: 'ชื่อ-นามสกุล'
//   },
//   {
//     id: 'mobile_no',
//     align: 'left',
//     disablePadding: false,
//     label: 'เบอร์โทร'
//   },
//   {
//     id: 'id_no',
//     align: 'left',
//     disablePadding: false,
//     label: 'เลขที่บัตรประชาชน'
//   },
//   // {
//   //   id: 'license_no',
//   //   align: 'left',
//   //   disablePadding: false,
//   //   label: 'เลขที่ใบขับขี่'
//   // },
//   {
//     id: 'action',
//     align: 'center',
//     width: '10%',
//     disablePadding: false,
//     label: 'Actions'
//   }
// ];

// function CompantTableHead() {
//   return (
//     <TableHead>
//       <TableRow>
//         {headCells.map((headCell) => (
//           <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'} width={headCell.width}>
//             {headCell.label}
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

function DriverTable() {
  const [open, setOpen] = useState(false);
  const [driver, setDriver] = useState([]);

  const userId = localStorage.getItem('user_id');
  const userRole = useSelector((state) => state.auth?.roles);

  useEffect(() => {
    getDrivers();
  }, []);

  const getDrivers = () => {
    setOpen(true);
    try {
      driverRequest.getAllDriver(userId).then((response) => {
        setOpen(false);
        const newData = response.map((item, index) => {
          return {
            ...item,
            No: index + 1,
            fullName: item.firstname + ' ' + item.lastname
          };
        });
        setDriver(newData);
      });
    } catch (error) {
      console.log(error);
    }
  };
  // =============== Get Company DataTable ===============//
  const options = {
    viewColumns: false,
    print: false,
    download: false,
    selectableRows: 'none',
    elevation: 0,
    rowsPerPage: 25,
    responsive: 'standard',
    sort: false,
    rowsPerPageOptions: [25, 50, 75, 100],
    customToolbar: () => {
      return (
        <>
          {userRole && userRole !== 5 && (
            <Button size="mediam" color="success" variant="outlined" onClick={() => addDrivers()} startIcon={<PlusCircleOutlined />}>
              เพิ่มข้อมูล
            </Button>
          )}
        </>
      );
    }
  };

  const columns = [
    {
      name: 'No',
      label: 'ลำดับ',
      options: {
        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    },
    {
      // + 'lastname'
      name: 'fullName',
      label: 'ชื่อ-นามสกุล'
    },
    {
      name: 'mobile_no',
      label: 'เบอร์โทร',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
        // setCellProps: () => ({ style: { color: 'red', textAlign: 'center' } }),
        // setCellHeaderProps: () => ({ style: { color: 'red', textAlign: 'center' } })
      }
    },
    {
      name: 'id_card_no',
      label: 'เลขที่บัตรประชาชน',
      options: {
        customBodyRender: (value) => <Typography variant="body">{value ? value : '-'}</Typography>
      }
    },
    {
      name: 'driver_id',
      label: 'Actions',
      options: {
        customBodyRender: (value) => (
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Tooltip title="แก้ไข">
              <Button
                variant="contained"
                size="medium"
                color="primary"
                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                onClick={() => updateDrivers(value)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="ลบ">
              <Button
                variant="contained"
                size="medium"
                color="error"
                sx={{ minWidth: '33px!important', p: '6px 0px' }}
                onClick={() => deleteDrivers(value)}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </ButtonGroup>
        ),

        setCellHeaderProps: () => ({
          style: { textAlign: 'center' }
        }),
        setCellProps: () => ({
          style: { textAlign: 'center' }
        })
      }
    }
  ];

  const navigate = useNavigate();
  const addDrivers = () => {
    navigate('/drivers/add');
  };

  const updateDrivers = (id) => {
    navigate('/drivers/update/' + id);
  };

  const deleteDrivers = (id) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: apiUrl + '/deletedriver/' + id,
      headers: {}
    };

    console.log(config.url);

    axios
      .request(config)
      .then((result) => {
        console.log(result);
        if (result.data.status === 'ok') {
          alert(result.data.message);
          getDrivers();
        } else {
          alert(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Box>
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <MUIDataTable title={<Typography variant="h5">ข้อมูลคนขับรถ</Typography>} data={driver} columns={columns} options={options} />
    </Box>
  );
}

export default DriverTable;
