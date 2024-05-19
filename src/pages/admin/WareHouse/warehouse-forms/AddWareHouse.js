import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Link api url
import * as adminRequest from '_api/adminRequest';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Divider, Alert } from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddWareHouse() {
  const pageId = 17;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  const lastDate = moment().endOf('year').format('YYYY-MM-DD');
  const navigate = useNavigate();

  const initialValue = {
    manager_name: '',
    contact_info: '',
    department: '',
    warehouse_id: '',
    description: '',
    end_date: lastDate,
    status: 'A'
  };

  const validations = Yup.object().shape({
    manager_name: Yup.string().max(255).required('กรุณาระบุชื่อหัวหน้าโกดัง'),
    end_date: Yup.string().max(255).required('กรุณาระบุวันที่สิ้นสุด')
    // warehouse_id: Yup.string().max(255).required('กรุณาระบุโกดัง')
  });

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
      getWareHouses();
    }
  }, [userRole, userPermission]);

  const [wareHouseList, setWareHouseList] = useState([]);
  const getWareHouses = () => {
    try {
      adminRequest.getAllWareHouse().then((response) => {
        setWareHouseList(response);
        if (wareHouseList) {
          console.log('yes');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    try {
      values.start_date = currentDate;

      adminRequest
        .AddWareHouse(values)
        .then(() => {
          navigate('/admin/warehouse/');
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
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
          <Grid container>
            <Grid item xs={8}>
              <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
                <Formik initialValues={initialValue} validationSchema={validations} onSubmit={handleSubmits}>
                  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="h5">เพิ่มข้อมูลหัวหน้าโกดัง</Typography>
                          <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="manager_name-car">ชื่อ-นามสกุล*</InputLabel>
                            <OutlinedInput
                              id="manager_name-car"
                              type="text"
                              value={values.manager_name}
                              name="manager_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="ชื่อ-นามสกุล"
                              fullWidth
                              error={Boolean(touched.manager_name && errors.manager_name)}
                            />
                            {touched.manager_name && errors.manager_name && (
                              <FormHelperText error id="helper-text-name-company">
                                {errors.manager_name}
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

                        <Grid item xs={12}>
                          <Button
                            disableElevation
                            disabled={
                              isSubmitting ||
                              (pageDetail[0].permission_name !== 'manage_everything' &&
                                pageDetail[0].permission_name !== 'add_edit_delete_data')
                            }
                            size="mediam"
                            type="submit"
                            variant="contained"
                            color="success"
                            startIcon={<SaveOutlined />}
                          >
                            เพิ่มข้อมูลหัวหน้าโกดัง
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
              </MainCard>
            </Grid>
          </Grid>
        )}
    </Grid>
  );
}

export default AddWareHouse;
