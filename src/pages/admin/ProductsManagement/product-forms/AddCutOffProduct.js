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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
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
import { SaveOutlined, RollbackOutlined, DeleteOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddCutOffProduct() {
  const userId = localStorage.getItem('user_id');
  const [open, setOpen] = useState(false);
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
    getProductReceives();
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

  const [cutOffProductList, setCutOffProductList] = useState([]);
  const getProductReceives = () => {
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

  const [receive_id, setReceiveId] = useState(0);
  const [notifytext, setNotifyText] = useState('');
  const handleClickOpen = (id) => {
    try {
      setOpen(true);
      setReceiveId(id);
      setNotifyText('ต้องการลบข้อมูลการเบิกสินค้า');
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = (flag) => {
    if (flag === 1) {
      setLoading(true);
      deleteCutOffProduct(receive_id);
      console.log('receive_id :', receive_id);
    } else if (flag === 0) {
      setOpen(false);
    }
  };

  const deleteCutOffProduct = (id) => {
    try {
      adminRequest.deleteCutOffProduct(id).then((response) => {
        if (response.status == 'ok') {
          getProductReceives();
        } else {
          alert(response.message);
        }
      });
    } catch (error) {
      console.log(error);
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
        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title" align="center">
            <Typography variant="h5">{'แจ้งเตือน'}</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{notifytext}</DialogContentText>
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
        <Grid item xs={12} lg={12} md={10}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={valiDationSchema} enableReinitialize={true} onSubmit={handleSubmits}>
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
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

                    <Grid item xs={12}>
                      <Typography variant="h5">ข้อมูลตัดเบิกสินค้า</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>วันที่เบิก *</InputLabel>
                        <TextField
                          required
                          fullWidth
                          type="date"
                          id="cutoff_date"
                          name="cutoff_date"
                          onBlur={handleBlur}
                          value={values.cutoff_date}
                          onChange={handleChange}
                        />
                        {touched.cutoff_date && errors.cutoff_date && (
                          <FormHelperText error id="helper-text-cutoff_date">
                            {errors.cutoff_date}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="cutoff_amount">ยอดเบิกสินค้า *</InputLabel>
                        <OutlinedInput
                          id="cutoff_amount"
                          type="number"
                          value={values.cutoff_amount}
                          name="cutoff_amount"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ยอดเบิก"
                          fullWidth
                          error={Boolean(touched.cutoff_amount && errors.cutoff_amount)}
                        />
                        {touched.cutoff_amount && errors.cutoff_amount && (
                          <FormHelperText error id="helper-text-cutoff_amount">
                            {errors.cutoff_amount}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="cutoff_remark">หมายเหตุ*</InputLabel>
                        <OutlinedInput
                          id="cutoff_remark"
                          type="text"
                          value={values.cutoff_remark}
                          name="cutoff_remark"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="หมายเหตุ"
                          fullWidth
                          error={Boolean(touched.cutoff_remark && errors.cutoff_remark)}
                        />
                        {touched.cutoff_remark && errors.cutoff_remark && (
                          <FormHelperText error id="helper-text-cutoff_remark">
                            {errors.cutoff_remark}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    {cutOffProductList.length > 0 && (
                      <Grid item xs={12} md={12}>
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
                                <TableCell sx={{ p: '12px' }} align="center">
                                  ลำดับ
                                </TableCell>
                                <TableCell sx={{ p: '12px' }}>วันที่เบิก</TableCell>
                                <TableCell sx={{ p: '12px' }} align="right">
                                  จำนวนเบิก
                                </TableCell>
                                <TableCell sx={{ p: '12px' }}>หมายเหตุ</TableCell>
                                <TableCell sx={{ p: '12px' }} align="right">
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {cutOffProductList.length > 0 &&
                                cutOffProductList.map((cutOffProduct, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="left">{moment(cutOffProduct.cutoff_date).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell align="right">{cutOffProduct.cutoff_amount}</TableCell>
                                    <TableCell align="left">{cutOffProduct.cutoff_remark}</TableCell>
                                    <TableCell align="right">
                                      <Tooltip title="ลบข้อมูลเบิก">
                                        <span>
                                          <Button
                                            variant="contained"
                                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                            size="medium"
                                            color="error"
                                            // onClick={() => deleteDrivers(row.reserve_id)}
                                            onClick={() => handleClickOpen(cutOffProduct.product_cutoff_id)}
                                          >
                                            <DeleteOutlined />
                                          </Button>
                                        </span>
                                      </Tooltip>
                                    </TableCell>
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
                    )}
                    {/* {permission.length > 0 && permission.add_data && ( */}
                    <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        size="mediam"
                        type="submit"
                        variant="contained"
                        color="success"
                        startIcon={<SaveOutlined />}
                      >
                        เพิ่มข้อมูลตัดเบิกสินค้า
                      </Button>

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
                    {/* )} */}
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

export default AddCutOffProduct;
