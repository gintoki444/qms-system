import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Box, Button } from '@mui/material';

import axios from '../../../node_modules/axios/index';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'driver_No',
    align: 'left',
    disablePadding: false,
    label: 'ID.'
  },
  {
    id: 'fullName',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อ-นามสกุล'
  },
  {
    id: 'mobile_no',
    align: 'left',
    disablePadding: false,
    label: 'เบอร์โทร'
  },
  {
    id: 'license_no',
    align: 'left',
    disablePadding: false,
    label: 'เลขที่ใบขับขี่'
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

function CompantTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function DriverTable() {
  const [car, setCar] = useState([]);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    getDrivers();
  }, []);

  const getDrivers = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/alldrivers/' + userId,
      headers: {}
    };

    axios
      .request(config)
      .then((response) => {
        setCar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const navigate = useNavigate();
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
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <CompantTableHead company={car} companyBy={car} />

          <TableBody>
            {car.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell align="left">{row.driver_id}</TableCell>
                  <TableCell align="left">{row.firstname + ' ' + row.lastname}</TableCell>
                  <TableCell align="left">{row.mobile_no}</TableCell>
                  <TableCell align="left">{row.license_no}</TableCell>
                  <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                    <Button variant="contained" size="medium" color="primary" onClick={() => updateDrivers(row.driver_id)}>
                      <EditOutlined />
                    </Button>
                    <Button variant="contained" size="medium" color="error" onClick={() => deleteDrivers(row.driver_id)}>
                      <DeleteOutlined />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {car.length == 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DriverTable;
