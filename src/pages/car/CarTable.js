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
    id: 'carNo',
    align: 'left',
    disablePadding: false,
    label: 'ID.'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'taxpayer',
    align: 'left',
    disablePadding: false,
    label: 'ยี้ห้อรถ'
  },
  {
    id: 'tel',
    align: 'left',
    disablePadding: false,
    label: 'สีรถ'
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: false,
    label: 'Actions'
  }
];

function CompantTableHead({ car, carBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={carBy === headCell.id ? car : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function CarTable() {
  const [car, setCar] = useState([]);

  const userId = localStorage.getItem('user_id');

  // const [permission, setPermisstion] = useState([]);
  // const getPermission = () => {
  //   const userId = localStorage.getItem('user_id');
  //   const urlapi = apiUrl + `/user_permissions/` + userId;

  //   axios
  //     .get(urlapi)
  //     .then((res) => {
  //       if (res.permissions) {
  //         setPermisstion(res.permissions);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };
  
  useEffect(() => {
    // getPermission();
    getCar();
  }, []);

  const getCar = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/allcars/' + userId,
      headers: {}
    };

    await axios
      .request(config)
      .then((response) => {
        setCar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const navigate = useNavigate();
  const updateCar = (id) => {
    navigate('/car/update/' + id);
  };

  const deleteCar = (id) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: apiUrl + '/deletecar/' + id,
      headers: {}
    };

    axios
      .request(config)
      .then((result) => {
        if (result.data.status === 'ok') {
          alert(result.data.message);
          getCar();
        } else {
          alert(result.data['message']['sqlMessage']);
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
                  <TableCell align="left">{row.car_id}</TableCell>
                  <TableCell align="left">{row.registration_no}</TableCell>
                  <TableCell align="left">{row.brand}</TableCell>
                  <TableCell align="left">{row.color}</TableCell>
                  {/* {permission.length > 0 &&  */}
                    <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                      <Button variant="contained" size="medium" color="primary" onClick={() => updateCar(row.car_id)}>
                        <EditOutlined />
                      </Button>
                      <Button variant="contained" size="medium" color="error" onClick={() => deleteCar(row.car_id)}>
                        <DeleteOutlined />
                      </Button>
                    </TableCell>
                  {/* } */}
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

export default CarTable;
