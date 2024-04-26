import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  ButtonGroup,
  Button,
  Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as carRequest from '_api/carRequest';
import axios from '../../../node_modules/axios/index';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'carNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'ทะเบียนรถ'
  },
  {
    id: 'province',
    align: 'left',
    disablePadding: true,
    label: 'จังหวัด'
  },
  {
    id: 'typeCar',
    align: 'left',
    disablePadding: false,
    label: 'ประเภทรถ'
  },
  // {
  //   id: 'taxpayer',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'ยี้ห้อรถ'
  // },
  // {
  //   id: 'tel',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'สีรถ'
  // },
  {
    id: 'action',
    align: 'center',
    width: '10%',
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
            width={headCell.width}
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
  const [open, setOpen] = useState(false);

  const userId = localStorage.getItem('user_id');

  const [carTypeList, setCarTypeList] = useState([]);
  const getCarType = () => {
    carRequest.getAllCarType().then((response) => {
      setCarTypeList(response);
    });
  };

  const setCarTypeName = (id) => {
    const carType = carTypeList.filter((x) => x.car_type_id == id);
    if (carType.length > 0) return carType[0].car_type_name;
  };

  useEffect(() => {
    // getPermission();
    getCar();
    getCarType();
  }, [userId]);

  const getCar = async () => {
    setOpen(true);
    try {
      carRequest.getAllCars(userId).then((response) => {
        setCar(response);
        setOpen(false);
      });
    } catch (error) {
      console.log(error);
    }
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
          size="small"
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
          {!open ? (
            <TableBody>
              {car.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.registration_no}</TableCell>
                    <TableCell align="left">{row.province_id ? row.name_th : '-'}</TableCell>
                    <TableCell align="left">{row.car_type_id ? setCarTypeName(row.car_type_id) : '-'}</TableCell>
                    {/* <TableCell align="left">{row.brand ? row.brand : '-'}</TableCell>
                    <TableCell align="left">{row.color ? row.color : '-'}</TableCell> */}
                    {/* {permission.length > 0 &&  */}
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateCar(row.car_id)}
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
                            onClick={() => deleteCar(row.car_id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
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
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                  <Typography variant="body1">Loading....</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CarTable;
