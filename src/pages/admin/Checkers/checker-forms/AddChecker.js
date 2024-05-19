import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Link api url
import * as adminRequest from '_api/adminRequest';

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
  Backdrop,
  CircularProgress,
  Alert
} from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddChecker() {
  const pageId = 18;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  const [open, setOpen] = useState(false);
  const lastDate = moment().endOf('year').format('YYYY-MM-DD');
  const navigate = useNavigate();

  const initialValue = {
    checker_name: '',
    contact_info: '',
    department: '',
    start_date: '',
    end_date: lastDate,
    status: 'A'
  };

  const validations = Yup.object().shape({
    checker_name: Yup.string().max(255).required('กรุณาระบุชื่อพนักงานจ่ายสินค้า')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    setOpen(true);
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    try {
      values.start_date = currentDate;

      adminRequest
        .addChecker(values)
        .then(() => {
          navigate('/admin/checkers/');
          setOpen(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);
  return (
    <Grid alignItems="center" justifyContent="space-between">
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Grid container>
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
            <Grid item xs={8}>
              <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
                <Formik initialValues={initialValue} validationSchema={validations} enableReinitialize={true} onSubmit={handleSubmits}>
                  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="h5">เพิ่มข้อมูลพนักงานจ่ายสินค้า</Typography>
                          <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="checker_name-car">ชื่อ-นามสกุล*</InputLabel>
                            <OutlinedInput
                              id="checker_name"
                              type="text"
                              value={values.checker_name}
                              name="checker_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="ชื่อ-นามสกุล"
                              fullWidth
                              error={Boolean(touched.checker_name && errors.checker_name)}
                            />
                            {touched.checker_name && errors.checker_name && (
                              <FormHelperText error id="helper-text-name-company">
                                {errors.checker_name}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="contact_info">ข้อมูลติดต่อ</InputLabel>
                            <OutlinedInput
                              id="contact_info"
                              type="contact_info"
                              value={values.contact_info}
                              name="contact_info"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="ข้อมูลติดต่อ"
                              fullWidth
                              error={Boolean(touched.contact_info && errors.contact_info)}
                            />
                            {touched.contact_info && errors.contact_info && (
                              <FormHelperText error id="helper-text-contact_info">
                                {errors.contact_info}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="departmentr">แผนก</InputLabel>
                            <OutlinedInput
                              id="department"
                              type="department"
                              value={values.department}
                              name="department"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="แผนก"
                              fullWidth
                              error={Boolean(touched.department && errors.department)}
                            />
                            {touched.department && errors.department && (
                              <FormHelperText error id="helper-text-department">
                                {errors.department}
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
                            เพิ่มข้อมูล
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

export default AddChecker;
