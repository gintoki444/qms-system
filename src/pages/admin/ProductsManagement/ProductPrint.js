import React, { useState, useEffect } from 'react';

// import './style/PrintStyles.css';
import logo from '../../../assets/images/logo.png';

import { useNavigate,useLocation } from 'react-router-dom';

import { Grid, Paper, Typography, Button, Divider, Backdrop, CircularProgress } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import MainCard from 'components/MainCard';

// DateTime
import moment from 'moment';

const printPageStyle = {
  width: '210mm',
  minHeight: '297mm',
  padding: '24px 42px',
  margin: 'auto'
};

// import * as stepRequest from '_api/StepRequest';
import * as adminRequest from '_api/adminRequest';
// import * as reserveRequest from '_api/reserveRequest';

function ProductPrint() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const id = location.state?.productId;
  const backLink = location.state?.link;
  
  useEffect(() => {
    setLoading(true);
    getProductRegister();
    // getProductCompany();
    // getProducts();
    // getWarehouses();
    if (id) {
      getProductReceives();
      getOrderProducts();
      getCutOffProduct();
    }
  }, [id]);

  const [productRegis, setProductRegis] = useState({});
  const getProductRegister = () => {
    try {
      adminRequest.getProductRegisterById(id).then((response) => {
        if (response.length > 0) {
          response.map((data) => {
            setProductRegis(data);
            // getProductBrand(data.product_company_id);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ========= [ Click print ]  ========= //
  const [isPrinting, setIsPrinting] = useState(false);
  const handlePrint = () => {
    setIsPrinting(true);

    setTimeout(() => {
      window.print();
    }, 500);

    setTimeout(() => {
      setIsPrinting(false);
    }, 1000);
  };

  const navigate = useNavigate();
  const backTo = () => {
    navigate(backLink);
  };
  // =============== Get Product Receives ===============//
  const [productReceiveList, setProductReceiveList] = useState([]);
  const getProductReceives = () => {
    try {
      adminRequest.getProductReceiveById(id).then((response) => {
        if (response.length > 0) {
          setProductReceiveList(response);
          setLoading(false);
        } else {
          setProductReceiveList([]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get CutOff Product ===============//
  const [orderProductList, setOrderProductList] = useState([]);
  const getOrderProducts = () => {
    try {
      adminRequest.getOrdersProductsByIdRegister(id).then((response) => {
        if (response.length > 0) {
          setOrderProductList(response);
          setLoading(false);
        } else {
          setOrderProductList([]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get CutOff Product ===============//
  const [cutOffProductList, setCutOffProductList] = useState([]);
  const getCutOffProduct = () => {
    try {
      adminRequest.getCutOffProductById(id).then((response) => {
        if (response.length > 0) {
          setCutOffProductList(response);
          setLoading(false);
        } else {
          setCutOffProductList([]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Paper style={{ ...printPageStyle }} elevation={0}>
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <Grid alignItems="center" justifyContent="space-between">
        <Grid container rowSpacing={1} columnSpacing={2.75} sx={{ pt: 2 }}>
          <Grid item xs={12} align="center" sx={{ mb: 2 }}>
            <img src={logo} alt="Company Logo" className="logo" style={{ width: '80px', textAlign: 'center' }} />
            <Typography variant="h4" gutterBottom sx={{ pt: 2 }}>
              ข้อมูลกองสินค้า
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              <strong>บริษัท (สินค้า) : </strong>
              {productRegis.product_company_name_th}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              <strong>เบรนสินค้า (ตรา) : </strong>
              {productRegis.product_brand_name}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              <strong>สินค้า (ตรา) : </strong> {productRegis.product_brand_name}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              <strong>คลังสินค้า : </strong>
              {productRegis.warehouse_name}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              <strong>ทะเบียน : </strong>
              {productRegis.product_register_name}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              <strong>วันที่ตั้งกอง : </strong>
              {moment(productRegis.product_register_date).format('DD/MM/YYYY')}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              <strong>ยอดยกมา :</strong> {productRegis.register_beginning_balance}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              <strong>หมายเหตุ :</strong> {productRegis.product_register_remark}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              {productReceiveList.length > 0 && (
                <>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h5">ข้อมูลรับสินค้า</Typography>
                    <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    <TableContainer>
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
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ p: '12px', width: '5% ' }} align="center">
                              ลำดับ
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '15% ' }} align="center">
                              วันที่รับ
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '15%' }} align="right">
                              จำนวนรับ (ตัน)
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '35%' }}>หมายเหตุ</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productReceiveList.length > 0 &&
                            productReceiveList.map((productReceive, index) => (
                              <TableRow key={index}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{moment(productReceive.receive_date.slice(0, 10)).format('DD/MM/YYYY')}</TableCell>
                                <TableCell align="right">{productReceive.receive_amount}</TableCell>
                                <TableCell align="left">{productReceive.receive_remark}</TableCell>
                              </TableRow>
                            ))}
                          {/* {order.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell width={'50%'}>{item.name}</TableCell>
                                  <TableCell align="right">{item.quantity} ตัน</TableCell>
                                </TableRow>
                              ))} */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </>
              )}

              {orderProductList.length > 0 && (
                <>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h5">ข้อมูลสั่งซื้อสินค้า</Typography>
                    <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    <TableContainer>
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
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ p: '12px', width: '5% ' }} align="center">
                              ลำดับ
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '15% ' }} align="center">
                              วันที่สั่งซื้อ
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '15%' }} align="right">
                              จำนวน (ตัน)
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '35%' }}>หมายเหตุ</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderProductList.length > 0 &&
                            orderProductList.map((orderProduct, index) => (
                              <TableRow key={index}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{moment(orderProduct.order_date.slice(0, 10)).format('DD/MM/YYYY')}</TableCell>
                                <TableCell align="right">{orderProduct.total_sold}</TableCell>
                                <TableCell align="left">{orderProduct.description}</TableCell>
                              </TableRow>
                            ))}
                          {/* {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell width={'50%'}>{item.name}</TableCell>
                                      <TableCell align="right">{item.quantity} ตัน</TableCell>
                                    </TableRow>
                                  ))} */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </>
              )}

              {cutOffProductList.length > 0 && (
                <>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h5">ข้อมูลตัดเบิกสินค้า</Typography>
                    <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    <TableContainer>
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
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ p: '12px', width: '5% ' }} align="center">
                              ลำดับ
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '15% ' }} align="center">
                              วันที่เบิก
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '15%' }} align="right">
                              จำนวนเบิก (ตัน)
                            </TableCell>
                            <TableCell sx={{ p: '12px', width: '35%' }}>หมายเหตุ</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cutOffProductList.length > 0 &&
                            cutOffProductList.map((cutOffProduct, index) => (
                              <TableRow key={index}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{moment(cutOffProduct.cutoff_date.slice(0, 10)).format('DD/MM/YYYY')}</TableCell>
                                <TableCell align="right">{cutOffProduct.cutoff_amount}</TableCell>
                                <TableCell align="left">{cutOffProduct.cutoff_remark}</TableCell>
                              </TableRow>
                            ))}
                          {/* {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell width={'50%'}>{item.name}</TableCell>
                                      <TableCell align="right">{item.quantity} ตัน</TableCell>
                                    </TableRow>
                                  ))} */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ '& button': { m: 1 }, mt: 3 }} align="center">
            <Button variant="contained" color="primary" onClick={handlePrint} style={{ display: isPrinting ? 'none' : 'inline-flex' }}>
              พิมพ์
            </Button>

            <Button variant="contained" color="error" onClick={backTo} style={{ display: isPrinting ? 'none' : 'inline-flex' }}>
              ย้อนกลับ
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProductPrint;
