import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import * as stepRequest from '_api/StepRequest';
import * as adminRequest from '_api/adminRequest';
import * as reserveRequest from '_api/reserveRequest';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Divider,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MainCard from 'components/MainCard';
import { RollbackOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function ProductDetails() {
  const userId = localStorage.getItem('user_id');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  if (!userId) {
    window.location.href = '/login';
  }

  useEffect(() => {
    setLoading(true);
    getProductRegister();
    getProductCompany();
    getProducts();
    getWarehouses();
    getOrderProducts();
    getProductReceives();
    getCutOffProduct();
  }, [id]);

  // =============== Get Product Register ===============//
  const [productRegis, setProductRegis] = useState({
    product_company_id: '',
    product_id: '',
    product_brand_id: '',
    warehouse_id: '',
    product_register_name: '',
    product_register_date: '',
    register_beginning_balance: '',
    product_register_remark: ''
  });

  const getProductRegister = () => {
    try {
      adminRequest.getProductRegisterById(id).then((response) => {
        if (response.length > 0) {
          response.map((data) => {
            setProductRegis(data);
            getProductBrand(data.product_company_id);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
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

  // =============== Get Product Company ===============//
  const [companyList, setCompanyList] = useState([]);
  const getProductCompany = () => {
    stepRequest.getAllProductCompany().then((response) => {
      setCompanyList(response);
    });
  };

  const handleChangeProductCom = (e) => {
    getProductBrand(e);
  };

  // =============== Get Product Brand ===============//
  const [productBrand, setProductBrand] = useState([]);
  const getProductBrand = (id) => {
    try {
      reserveRequest.getProductBrandById(id).then((response) => {
        if (response) {
          setProductBrand(response);

          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get Product ===============//
  const [productList, setProductList] = useState([]);
  const getProducts = () => {
    try {
      adminRequest.getAllProducts().then((response) => {
        setProductList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get Product ===============//
  const [warehouseList, setWarehouseList] = useState([]);
  const getWarehouses = () => {
    try {
      adminRequest.getAllWareHouse().then((response) => {
        setWarehouseList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const initialValue = {
    product_company_id: productRegis.product_company_id,
    product_id: productRegis.product_id,
    product_brand_id: productRegis.product_brand_id,
    warehouse_id: productRegis.warehouse_id,
    product_register_name: productRegis.product_register_name,
    product_register_date: moment(productRegis.product_register_date).format('YYYY-MM-DD'),
    register_beginning_balance: productRegis.register_beginning_balance,
    product_register_remark: productRegis.product_register_remark,
    product_register_id: id,
    cutoff_date: moment(new Date()).format('YYYY-MM-DD'),
    cutoff_amount: '',
    cutoff_remark: '',
    checkbox1: '',
    checkbox2: '',
    other: ''
  };

  const text = productRegis.product_register_remark;
  if (text) {
    const partsText1 = text.split(',');
    const partsText2 = text.split('/');
    let remarkTxtList = [];
    if (partsText1.length > 1) {
      remarkTxtList = partsText1;
    }

    if (partsText2.length > 1) {
      remarkTxtList = partsText2;
    }

    if (remarkTxtList.length > 0) {
      remarkTxtList.map((x) => {
        if (x == '*ทุบก่อนจ่าย') {
          initialValue.checkbox1 = x;
        } else if (x == '*ระงับจ่าย') {
          initialValue.checkbox2 = x;
        } else {
          if (!initialValue.checkbox1 && !initialValue.checkbox2) {
            initialValue.other = initialValue.product_register_remark;
          } else {
            const removedText = text.replace(/[*]ทุบก่อนจ่า|ย,|[*]ระงับจ่า|ย,/g, '');
            initialValue.other = removedText;
          }
        }
      });
    } else {
      if (text == '*ทุบก่อนจ่าย') {
        initialValue.checkbox1 = text;
      } else if (text == '*ระงับจ่าย') {
        initialValue.checkbox2 = text;
      } else {
        initialValue.other = text;
      }
    }
  }
  const valiDationSchema = Yup.object().shape({
    product_company_id: Yup.string().required('กรุณาเลือกบริษัท(สินค้า)'),
    product_id: Yup.string().max(255).required('กรุณาเลือกเบรนสินค้า'),
    product_brand_id: Yup.string().max(255).required('กรุณาเลือกสินค้า'),
    warehouse_id: Yup.string().max(255).required('กรุณาเลือกคลังสินค้า'),
    product_register_name: Yup.string().max(255).required('กรุณาระบุทำเบียน'),
    product_register_date: Yup.string().max(255).required('กรุณาระบุวันที่ตั้งกอง'),
    register_beginning_balance: Yup.string().required('กรุณาระบุยอดที่ยกมา'),
    cutoff_date: Yup.string().required('กรุณาระบุวันที่เบิกสินค้า'),
    cutoff_amount: Yup.string().required('กรุณาระบุจำนวนยอดเบิกสินค้า'),
    cutoff_remark: Yup.string().required('กรุณาระบุหมายเหตุ')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    setLoading(true);
    try {
      adminRequest.AddCutOffProduct(values).then((response) => {
        if (response.status === 'ok') {
          values.cutoff_date = moment(new Date()).format('YYYY-MM-DD');
          values.cutoff_amount = '';
          values.cutoff_remark = '';
          getProductReceives();
        } else {
          alert(result['message']['sqlMessage']);
        }
      });
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();
  const backToPage = () => {
    navigate('/admin/product-register/');
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12} md={10}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={valiDationSchema} enableReinitialize={true} onSubmit={handleSubmits}>
              {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">เพิ่มข้อมูลตัดเบิกสินค้า</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>บริษัท (สินค้า) *</InputLabel>
                        <FormControl>
                          <Select
                            displayEmpty
                            variant="outlined"
                            name="product_company_id"
                            value={values.product_company_id || ''}
                            onChange={(e) => {
                              setFieldValue('product_company_id', e.target.value);
                              setFieldValue('product_brand_id', '');
                              handleChangeProductCom(e.target.value);
                            }}
                            disabled
                            placeholder="เลือกประเภทรถ"
                            fullWidth
                            error={Boolean(touched.product_company_id && errors.product_company_id)}
                          >
                            <MenuItem disabled value="">
                              เลือกบริษัท (สินค้า)
                            </MenuItem>
                            {companyList.length > 0 &&
                              companyList.map((companias) => (
                                <MenuItem key={companias.product_company_id} value={companias.product_company_id}>
                                  {companias.product_company_name_th}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        {touched.product_company_id && errors.product_company_id && (
                          <FormHelperText error id="helper-product_company_id">
                            {errors.product_company_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>เบรนสินค้า (ตรา) *</InputLabel>
                        <FormControl>
                          <Select
                            displayEmpty
                            variant="outlined"
                            name="product_brand_id"
                            value={values.product_brand_id}
                            onChange={handleChange}
                            placeholder="เลือกเบรนสินค้า (ตรา)"
                            fullWidth
                            disabled
                            error={Boolean(touched.product_brand_id && errors.product_brand_id)}
                          >
                            <MenuItem disabled value="">
                              เลือกเบรนสินค้า (ตรา)
                            </MenuItem>
                            {productBrand.length > 0 &&
                              productBrand.map((brands) => (
                                <MenuItem key={brands.product_brand_id} value={brands.product_brand_id}>
                                  {brands.product_brand_name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        {touched.product_brand_id && errors.product_brand_id && (
                          <FormHelperText error id="helper-product_brand_id">
                            {errors.product_brand_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>สินค้า *</InputLabel>
                        <FormControl>
                          <Select
                            displayEmpty
                            variant="outlined"
                            name="product_id"
                            value={values.product_id}
                            onChange={handleChange}
                            placeholder="เลือกสินค้า"
                            fullWidth
                            disabled
                            error={Boolean(touched.product_id && errors.product_id)}
                          >
                            <MenuItem disabled value="">
                              เลือกสินค้า
                            </MenuItem>
                            {productList.length > 0 &&
                              productList.map((product) => (
                                <MenuItem key={product.product_id} value={product.product_id}>
                                  {product.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        {touched.product_brand_id && errors.product_brand_id && (
                          <FormHelperText error id="helper-product_brand_id">
                            {errors.product_brand_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>คลังสินค้า *</InputLabel>
                        <FormControl>
                          <Select
                            displayEmpty
                            variant="outlined"
                            name="warehouse_id"
                            value={values.warehouse_id}
                            onChange={handleChange}
                            placeholder="เลือกคลังสินค้า"
                            fullWidth
                            disabled
                            error={Boolean(touched.warehouse_id && errors.warehouse_id)}
                          >
                            <MenuItem disabled value="">
                              เลือกคลังสินค้า
                            </MenuItem>
                            {warehouseList.length > 0 &&
                              warehouseList.map((warehouses) => (
                                <MenuItem key={warehouses.warehouse_id} value={warehouses.warehouse_id}>
                                  {warehouses.description}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        {touched.product_brand_id && errors.product_brand_id && (
                          <FormHelperText error id="helper-product_brand_id">
                            {errors.product_brand_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="product_register_name">ทะเบียน *</InputLabel>
                        <OutlinedInput
                          id="product_register_name"
                          type="product_register_name"
                          value={values.product_register_name}
                          name="product_register_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ทะเบียน"
                          fullWidth
                          disabled
                          error={Boolean(touched.product_register_name && errors.product_register_name)}
                        />
                        {touched.product_register_name && errors.product_register_name && (
                          <FormHelperText error id="helper-text-product_register_name">
                            {errors.product_register_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>วันที่ตั้งกอง *</InputLabel>
                        <TextField
                          required
                          fullWidth
                          type="date"
                          id="product_register_date"
                          name="product_register_date"
                          onBlur={handleBlur}
                          value={values.product_register_date}
                          disabled
                          onChange={handleChange}
                        />
                        {touched.product_register_date && errors.product_register_date && (
                          <FormHelperText error id="helper-text-product_register_date">
                            {errors.product_register_date}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="register_beginning_balance">ยอดยกมา *</InputLabel>
                        <OutlinedInput
                          id="register_beginning_balance"
                          type="number"
                          value={values.register_beginning_balance}
                          name="register_beginning_balance"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ยอดยกมา"
                          fullWidth
                          disabled
                          error={Boolean(touched.register_beginning_balance && errors.register_beginning_balance)}
                        />
                        {touched.register_beginning_balance && errors.register_beginning_balance && (
                          <FormHelperText error id="helper-text-register_beginning_balance">
                            {errors.register_beginning_balance}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="product_register_remark">หมายเหตุ</InputLabel>
                      </Stack>

                      <Stack spacing={1} direction="flex-direction">
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled
                              checked={values.checkbox1}
                              // onChange={handleChange}
                              onChange={(e) => {
                                if (values.checkbox1) {
                                  setFieldValue('checkbox1', '');
                                } else {
                                  setFieldValue('checkbox1', e.target.value);
                                }
                              }}
                              name="checkbox1"
                              value="*ทุบก่อนจ่าย"
                            />
                          }
                          label="ทุบก่อนจ่าย"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled
                              checked={values.checkbox2}
                              // checked={typeSelect[orderItem.item_id]?.checked1 || false}
                              onChange={(e) => {
                                if (values.checkbox2) {
                                  setFieldValue('checkbox2', '');
                                } else {
                                  setFieldValue('checkbox2', e.target.value);
                                }
                              }}
                              // onChange={handleChange}
                              value="*ระงับจ่าย"
                              name="checkbox2"
                            />
                          }
                          label="ระงับจ่าย"
                        />

                        <OutlinedInput
                          id="other"
                          type="text"
                          value={values.other}
                          name="other"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled
                          // onChange={(e) => {
                          //   setFieldValue('other', e.target.value);
                          // }}
                          placeholder="อื่นๆ"
                          sx={{ width: { xs: '100%', md: '33.333%' }, ml: '12px!important' }}
                          error={Boolean(touched.other && errors.other)}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
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
                                        <TableCell sx={{ p: '12px', width: '10%' }} align="right">
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
                                            <TableCell align="center">{moment(productReceive.receive_date).format('DD/MM/YYYY')}</TableCell>
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
                                        <TableCell sx={{ p: '12px', width: '10%' }} align="right">
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
                                            <TableCell align="center">{moment(orderProduct.order_date).format('DD/MM/YYYY')}</TableCell>
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
                                        <TableCell sx={{ p: '12px', width: '10%' }} align="right">
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
                                            <TableCell align="center">{moment(cutOffProduct.cutoff_date).format('DD/MM/YYYY')}</TableCell>
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
                      </MainCard>
                    </Grid>

                    <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                      <Button
                        size="mediam"
                        variant="contained"
                        color="error"
                        onClick={() => {
                          backToPage();
                        }}
                        startIcon={<RollbackOutlined />}
                      >
                        ยกเลิก
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProductDetails;
