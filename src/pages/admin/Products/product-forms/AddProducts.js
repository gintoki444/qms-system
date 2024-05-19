import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// import * as stepRequest from '_api/StepRequest';
import * as adminRequest from '_api/adminRequest';
// import * as reserveRequest from '_api/reserveRequest';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Divider, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddProducts() {
  const pageId = 24;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);

  const userId = localStorage.getItem('user_id');
  if (!userId) {
    window.location.href = '/login';
  }
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
        if (response.status == 'ok') {
          backToPage();
        } else {
          alert('ไม่สามารถสร้าง "ชื่อ" สินค้าซ้ำกันได้');
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
    navigate('/admin/products/');
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container spacing={3}>
        {(Object.keys(userPermission).length > 0 && pageDetail.length === 0) ||
          (pageDetail.length !== 0 &&
            pageDetail[0].permission_name !== 'manage_everything' &&
            pageDetail[0].permission_name !== 'add_edit_delete_data' && (
              <Grid item xs={12}>
                <MainCard content={false}>
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
                  </Stack>
                </MainCard>
              </Grid>
            ))}
        {pageDetail.length > 0 &&
          (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') && (
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
          )}
      </Grid>
    </Grid>
  );
}

export default AddProducts;
