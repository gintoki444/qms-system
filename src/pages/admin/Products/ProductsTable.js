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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getPermission();
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      adminRequest.getAllProducts().then((response) => {
        setProducts(response);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const updateProducts = (id) => {
    navigate('/admin/products/update/' + id);
  };

  // ลบข้อมูล Manager
  const [product_id, setProductId] = useState(false);
  const [textnotify, setText] = useState('');

  const handleClickOpen = (id) => {
    setProductId(id);
    setText('ลบข้อมูลสินค้า (สูตร)');
    setOpen(true);
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      deteteProducts(product_id);
    }
    setOpen(false);
  };

  const deteteProducts = (id) => {
    try {
      adminRequest.deleteProducts(id).then(() => {
        getProducts();
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" align="center">
          <Typography variant="h5">{'แจ้งเตือน'}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>ต้องการ {textnotify} หรือไม่?</DialogContentText>
        </DialogContent>
        <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
          <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
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
          {!loading ? (
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
                            onClick={() => handleClickOpen(row.product_id)}
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
