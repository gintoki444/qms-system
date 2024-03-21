// import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// import * as stepRequest from '_api/StepRequest';
import * as adminRequest from '_api/adminRequest';
// import * as reserveRequest from '_api/reserveRequest';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Divider
  //   FormControl,
  //   Select,
  //   MenuItem,
  //   TextField
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

  //   useEffect(() => {
  //     getProductCompany();
  //     getProducts();
  //     getWarehouses();
  //   }, []);

  // =============== Get Product Company ===============//
  //   const [companyList, setCompanyList] = useState([]);
  //   const getProductCompany = () => {
  //     stepRequest.getAllProductCompany().then((response) => {
  //       setCompanyList(response);
  //     });
  //   };

  //   const handleChangeProductCom = (e) => {
  //     getProductBrand(e);
  //   };

  //   // =============== Get Product Brand ===============//
  //   const [productBrand, setProductBrand] = useState([]);
  //   const getProductBrand = (id) => {
  //     try {
  //       console.log(id);
  //       reserveRequest.getProductBrandById(id).then((response) => {
  //         setProductBrand(response);
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   // =============== Get Product ===============//
  //   const [productList, setProductList] = useState([]);
  //   const getProducts = () => {
  //     try {
  //       adminRequest.getAllProducts().then((response) => {
  //         console.log('getProducts :', response);
  //         setProductList(response);
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   // =============== Get Product ===============//
  //   const [warehouseList, setWarehouseList] = useState([]);
  //   const getWarehouses = () => {
  //     try {
  //       adminRequest.getAllWareHouse().then((response) => {
  //         setWarehouseList(response);
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  const initialValue = {
    name: '',
    product_category_id: 1,
    unit_price: 100,
    stock_quantity: '',
    register: '',
    setup_pile_date: currentDate,
    product_status: 'A',
    created_at: currentDate,
    updated_at: currentDate
  };

  const valiDationSchema = Yup.object().shape({
    name: Yup.string().required('กรุณาระบุชื่อสินค้า'),
    stock_quantity: Yup.string().max(255).required('กรุณาจำนวนสินค้า')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      adminRequest.AddProducts(values).then((response) => {
        console.log(response);
        backToPage();
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
    navigate('/admin/products/');
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={valiDationSchema} onSubmit={handleSubmits}>
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">เพิ่มข้อมูลสินค้า (สูตร)</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>

                    {/* <Grid item xs={12} md={6}>
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
                    </Grid> */}

                    {/* <Grid item xs={12} md={6}>
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
                    </Grid> */}

                    {/* <Grid item xs={12} md={6}>
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
                    </Grid> */}

                    {/* <Grid item xs={12} md={6}>
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
                    </Grid> */}

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">ชื่อสินค้า *</InputLabel>
                        <OutlinedInput
                          id="name"
                          type="name"
                          value={values.name}
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ทะเบียน"
                          fullWidth
                          error={Boolean(touched.name && errors.name)}
                        />
                        {touched.name && errors.name && (
                          <FormHelperText error id="helper-text-name">
                            {errors.name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    {/* <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>วันที่เข้ารับสินค้า *</InputLabel>
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
                    </Grid> */}

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="stock_quantity">สินค้างเหลือ *</InputLabel>
                        <OutlinedInput
                          id="stock_quantity"
                          type="number"
                          value={values.stock_quantity}
                          name="stock_quantity"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ยอดยกมา"
                          fullWidth
                          error={Boolean(touched.stock_quantity && errors.stock_quantity)}
                        />
                        {touched.stock_quantity && errors.stock_quantity && (
                          <FormHelperText error id="helper-text-stock_quantity">
                            {errors.stock_quantity}
                          </FormHelperText>
                        )}
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
                        เพิ่มข้อมูลสินค้า
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
