import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as adminRequest from '_api/adminRequest';

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

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'carNo',
    align: 'center',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อสินค้า'
  },
  {
    id: 'total',
    align: 'right',
    disablePadding: false,
    label: 'คงเหลือ'
  },
  {
    id: 'action',
    align: 'right',
    disablePadding: false,
    label: 'Actions'
  }
];

function CompantTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'} width={headCell.width}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function ProductsTable() {
  const [product, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // getPermission();
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setOpen(true);
      adminRequest.getAllProducts().then((response) => {
        setProducts(response);
        setOpen(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const updateProducts = (id) => {
    navigate('/products/update/' + id);
  };

  //   const deleteCar = (id) => {
  //     let config = {
  //       method: 'delete',
  //       maxBodyLength: Infinity,
  //       url: apiUrl + '/deletecar/' + id,
  //       headers: {}
  //     };

  //     axios
  //       .request(config)
  //       .then((result) => {
  //         if (result.data.status === 'ok') {
  //           alert(result.data.message);
  //           getCar();
  //         } else {
  //           alert(result.data['message']['sqlMessage']);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
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
          <CompantTableHead />
          {!open ? (
            <TableBody>
              {product.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="right">{row.stock_quantity}</TableCell>
                    {/* {permission.length > 0 &&  */}
                    <TableCell align="right">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateProducts(row.product_id)}
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
                            // onClick={() => deleteCar(row.car_id)}
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
              {product.length == 0 && (
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

export default ProductsTable;