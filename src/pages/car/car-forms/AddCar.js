import React, { useState, useEffect } from 'react';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';
// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as carRequest from '_api/carRequest';

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
  MenuItem
} from '@mui/material';
import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddCar() {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    window.location.href = '/login';
  }

  const [carTypeList, setCarTypeList] = useState([]);
  const getCarType = () => {
    carRequest.getAllCarType().then((response) => {
      setCarTypeList(response);
    });
  };

  const [provincesList, setProvincesList] = useState([]);
  const getProvinces = () => {
    carRequest.getAllProvinces().then((response) => {
      setProvincesList(response);
    });
  };

  useEffect(() => {
    getCarType();
    getProvinces();
  }, []);

  const initialValue = {
    registration_no: '',
    brand: '',
    color: '',
    province_id: '',
    car_type_id: ''
  };

  const valiDationSchema = Yup.object().shape({
    registration_no: Yup.string().max(255).required('กรุณาระบุทะเบียนรถ'),
    province_id: Yup.string().max(255).required('กรุณาระบุจังหวัด'),
    car_type_id: Yup.string().required('กรุณาระบุประเภทรถ')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData();
    console.log(values);

    try {
      values.user_id = userId;
      values.created_at = currentDate;
      values.updated_at = currentDate;

      formData.append('user_id', values.user_id);
      formData.append('registration_no', values.registration_no);
      formData.append('brand', values.brand);
      formData.append('car_type_id', values.car_type_id);
      formData.append('province_id', values.province_id);
      formData.append('color', values.color);
      formData.append('created_at', values.created_at);
      formData.append('updated_at', values.updated_at);

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/addcar',
        headers: {
          'Content-Type': 'application/json'
        },
        data: formData
      };

      axios
        .request(config)
        .then((result) => {
          console.log('result :', result);
          if (result.data.status === 'ok') {
            window.location.href = '/car';
          } else {
            alert(result['message']['sqlMessage']);
          }

          setStatus({ success: false });
          setSubmitting(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
        <Formik initialValues={initialValue} validationSchema={valiDationSchema} onSubmit={handleSubmits}>
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">เพิ่มข้อมูลรถ</Typography>
                  <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="registration_no-car">ทะเบียนรถ*</InputLabel>
                    <OutlinedInput
                      id="registration_no-car"
                      type="registration_no"
                      value={values.registration_no}
                      name="registration_no"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="ทะเบียนรถ"
                      fullWidth
                      error={Boolean(touched.registration_no && errors.registration_no)}
                    />
                    {touched.registration_no && errors.registration_no && (
                      <FormHelperText error id="helper-text-name-company">
                        {errors.registration_no}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>จังหวัด *</InputLabel>
                    <FormControl>
                      <Select
                        displayEmpty
                        variant="outlined"
                        name="province_id"
                        value={values.province_id}
                        onChange={handleChange}
                        placeholder="เลือกจังหวัด"
                        fullWidth
                        error={Boolean(touched.province_id && errors.province_id)}
                      >
                        <MenuItem disabled value="">
                          เลือกจังหวัด
                        </MenuItem>
                        {provincesList &&
                          provincesList.map((province) => (
                            <MenuItem key={province.province_id} value={province.province_id}>
                              {province.name_th}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    {touched.car_type_id && errors.car_type_id && (
                      <FormHelperText error id="helper-car_type_id">
                        {errors.car_type_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>ประเภทรถ *</InputLabel>
                    <FormControl>
                      <Select
                        displayEmpty
                        variant="outlined"
                        name="car_type_id"
                        value={values.car_type_id}
                        onChange={handleChange}
                        placeholder="เลือกประเภทรถ"
                        fullWidth
                        error={Boolean(touched.car_type_id && errors.car_type_id)}
                      >
                        <MenuItem disabled value="">
                          เลือกประเภทรถ
                        </MenuItem>
                        {carTypeList &&
                          carTypeList.map((carType) => (
                            <MenuItem key={carType.car_type_id} value={carType.car_type_id}>
                              {carType.car_type_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    {touched.car_type_id && errors.car_type_id && (
                      <FormHelperText error id="helper-car_type_id">
                        {errors.car_type_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="brand-car">ยี้ห้อรถ</InputLabel>
                    <OutlinedInput
                      id="brand-car"
                      type="brand"
                      value={values.brand}
                      name="brand"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="ยี้ห้อรถ"
                      fullWidth
                      error={Boolean(touched.brand && errors.brand)}
                    />
                    {touched.brand && errors.brand && (
                      <FormHelperText error id="helper-text-brand-car">
                        {errors.brand}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="color-car">สีรถ</InputLabel>
                    <OutlinedInput
                      id="color-car"
                      type="text"
                      value={values.color}
                      name="color"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="สีรถ"
                      fullWidth
                      error={Boolean(touched.color && errors.color)}
                    />
                    {touched.color && errors.color && (
                      <FormHelperText error id="helper-text-color-car">
                        {errors.color}
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
                    เพิ่มข้อมูลรถ
                  </Button>
                </Grid>
                {/* )} */}
              </Grid>
            </form>
          )}
        </Formik>
      </MainCard>
    </Grid>
  );
}

export default AddCar;
