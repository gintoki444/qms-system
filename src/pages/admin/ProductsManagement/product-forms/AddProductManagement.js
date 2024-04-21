import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddProducts() {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    window.location.href = '/login';
  }

  useEffect(() => {
    getProductCompany();
    getProducts();
    getWarehouses();
  }, []);

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
        setProductBrand(response);
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
    product_company_id: '',
    product_id: '',
    product_brand_id: '',
    warehouse_id: '',
    product_register_name: '',
    product_register_date: moment(new Date()).format('YYYY-MM-DD'),
    register_beginning_balance: '',
    product_register_remark: '',
    checkbox1: '',
    checkbox2: '',
    other: ''
  };

  const valiDationSchema = Yup.object().shape({
    product_company_id: Yup.string().required('กรุณาเลือกบริษัท(สินค้า)'),
    product_id: Yup.string().max(255).required('กรุณาเลือกเบรนสินค้า'),
    product_brand_id: Yup.string().max(255).required('กรุณาเลือกสินค้า'),
    warehouse_id: Yup.string().max(255).required('กรุณาเลือกคลังสินค้า'),
    product_register_name: Yup.string().max(255).required('กรุณาระบุทำเบียน'),
    product_register_date: Yup.string().max(255).required('กรุณาระบุวันที่ตั้งกอง'),
    register_beginning_balance: Yup.string().required('กรุณาระบุยอดที่ยกมา')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    let setRemarkTxt = '';

    if (values.checkbox1.length > 0) setRemarkTxt = values.checkbox1[0];
    if (values.checkbox2.length > 0) setRemarkTxt = (setRemarkTxt ? setRemarkTxt + ',' : setRemarkTxt) + values.checkbox2[0];
    if (values.other) setRemarkTxt = (setRemarkTxt ? setRemarkTxt + ',' : setRemarkTxt) + values.other;

    values.product_register_remark = setRemarkTxt;
    values.product_register_staus = 'A';
    console.log(values);
    try {
      adminRequest.AddProductRegister(values).then((response) => {
        if (response.status === 'ok') {
          backToPage();
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
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12} md={10}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={valiDationSchema} onSubmit={handleSubmits}>
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">เพิ่มข้อมูลกองสินค้า</Typography>
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
                            error={Boolean(touched.product_brand_id && errors.product_brand_id)}
                          >
                            <MenuItem disabled value="">
                              เลือกเบรนสินค้า (ตรา)
                            </MenuItem>
                            {productBrand.map((brands) => (
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
                              onChange={handleChange}
                              // onChange={() => {
                              //   if (values.checkbox1) {
                              //     setFieldValue('checkbox1', '');
                              //   } else {
                              //     setFieldValue('checkbox1', 'ทุบก่อนจ่าย');
                              //   }
                              // }}
                              name="checkbox1"
                              value="*ทุบก่อนจ่าย"
                            />
                          }
                          label="ทุบก่อนจ่าย"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              // checked={typeSelect[orderItem.item_id]?.checked1 || false}
                              // onChange={() => {
                              //   if (values.checked2) {
                              //     setFieldValue('checked2', '');
                              //   } else {
                              //     setFieldValue('checked2', 'ระงับจ่าย');
                              //   }
                              // }}
                              onChange={handleChange}
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
                          // onChange={(e) => {
                          //   setFieldValue('other', e.target.value);
                          // }}
                          placeholder="อื่นๆ"
                          sx={{ width: { xs: '100%', md: '33.333%' }, ml: '12px!important' }}
                          error={Boolean(touched.other && errors.other)}
                        />
                      </Stack>
                    </Grid>

                    {/* {permission.length > 0 && permission.add_data && ( */}
                    <Grid item xs={12}>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        size="mediam"
                        type="submit"
                        variant="contained"
                        color="success"
                        startIcon={<SaveOutlined />}
                      >
                        เพิ่มข้อมูลกองสินค้า
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

export default AddProducts;
