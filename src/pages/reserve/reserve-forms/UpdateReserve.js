import React from 'react';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Divider } from '@mui/material';
import MainCard from 'components/MainCard';

// DateTime
import moment from 'moment';

function AddReserve() {
  const initialValue = {
    user_id: '',
    description: '',
    company_id: null,
    car_id: '',
    driver_id: '',
    status: 'waiting',
    total_quantity: 0,
    pickup_date: '',
    brand_group_id: '',
    warehouse_id: ''
  };

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.object().required('กรุณาเลือกบริษัท/ร้านค้า'),
    firstname: Yup.string().max(255).required('กรุณาระบุชื่อ'),
    lastname: Yup.string().max(255).required('กรุณาระบุนามสกุล'),
    license_no: Yup.string()
      .matches(/^[0-9]*$/, 'กรุณาระบุเลขใบขับขี่เป็นตัวเลขเท่านั้น')
      .min(13, 'กรุณาระบุเลขใบขับขี่ 13 หลัก')
      .max(13, 'กรุณาระบุเลขใบขับขี่ 13 หลัก')
      .required('กรุณาระบุเลขใบขับขี่'),
    mobile_no: Yup.string()
      .matches(/^[0-9]*$/, 'กรุณาระบุเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น')
      .min(10, 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก')
      .max(10, 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก')
      .required('กรุณาระบุเบอร์โทรศัพท์')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData();

    try {
      values.user_id = '91';
      values.created_at = currentDate;
      values.updated_at = currentDate;

      formData.append('user_id', values.user_id);
      formData.append('firstname', values.firstname);
      formData.append('lastname', values.lastname);
      formData.append('license_no', values.license_no);
      formData.append('mobile_no', values.mobile_no);
      formData.append('created_at', values.created_at);
      formData.append('updated_at', values.updated_at);

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/addreserve',
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
            window.location.href = '/reserve';
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
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits}>
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">จองคิวรับสินค้า</Typography>
                  <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="firstname-reserve">บริษัท/ร้านค้า*</InputLabel>
                    <FormControl fullWidth>
                      <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Age
                      </InputLabel>
                      <NativeSelect
                        defaultValue={30}
                        inputProps={{
                          name: 'age',
                          id: 'uncontrolled-native'
                        }}
                      >
                        <option value={10}>Ten</option>
                        <option value={20}>Twenty</option>
                        <option value={30}>Thirty</option>
                      </NativeSelect>
                    </FormControl>
                    {touched.company_id && errors.company_id && (
                      <FormHelperText error id="helper-text-firstname-reserve">
                        {errors.company_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-reserve">นามสกุล*</InputLabel>
                    <OutlinedInput
                      id="lastname-reserve"
                      type="lastname"
                      value={values.lastname}
                      name="lastname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="นามสกุล"
                      fullWidth
                      error={Boolean(touched.lastname && errors.lastname)}
                    />
                    {touched.lastname && errors.lastname && (
                      <FormHelperText error id="helper-text-lastname-reserve">
                        {errors.lastname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="license_no-reserve">เลขที่ใบขับขี่*</InputLabel>
                    <OutlinedInput
                      id="license_no-reserve"
                      type="text"
                      value={values.license_no}
                      name="license_no"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="เลขที่ใบขับขี่"
                      fullWidth
                      error={Boolean(touched.license_no && errors.license_no)}
                    />
                    {touched.license_no && errors.license_no && (
                      <FormHelperText error id="helper-text-license_no-reserve">
                        {errors.license_no}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="mobile_no-reserve">เบอร์โทรศัพท์*</InputLabel>
                    <OutlinedInput
                      id="mobile_no-reserve"
                      type="text"
                      value={values.mobile_no}
                      name="mobile_no"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="เบอร์โทรศัพท์"
                      fullWidth
                      error={Boolean(touched.mobile_no && errors.mobile_no)}
                    />
                    {touched.mobile_no && errors.mobile_no && (
                      <FormHelperText error id="helper-text-mobile_no-reserve">
                        {errors.mobile_no}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="primary">
                    เพิ่มข้อมูลรถ
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </MainCard>
    </Grid>
  );
}

export default AddReserve;
