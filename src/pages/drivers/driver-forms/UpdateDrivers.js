import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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

function UpdateDrivers() {
  let [initialValue, setInitialValue] = useState({
    firstname: '',
    lastname: '',
    license_no: '',
    mobile_no: ''
  });
  // =============== Get ข้อมูล Driver ===============//
  const { id } = useParams();
  const getDriver = async (id) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/driver/' + id,
      headers: {}
    };

    await axios
      .request(config)
      .then((response) => {
        response.data.driver.map((result) => {
          if (result) {
            setInitialValue({
              firstname: result.firstname,
              lastname: result.lastname,
              license_no: result.license_no,
              mobile_no: result.mobile_no
            });
          }
        });
      })

      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDriver(id);
  }, [id]);

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData();
    console.log(values);

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
        method: 'put',
        maxBodyLength: Infinity,
        url: apiUrl + '/updatedriver/' + id,
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
            window.location.href = '/drivers';
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

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
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

  const navigate = useNavigate();

  const backToDrivers = () => {
    navigate('/drivers');
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits} enableReinitialize={true}>
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">เพิ่มข้อมูลคนขับรถ</Typography>
                  <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="firstname-drivers">ชื่อ*</InputLabel>
                    <OutlinedInput
                      id="firstname-driver"
                      type="firstname"
                      value={values.firstname}
                      name="firstname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="ชื่อ"
                      fullWidth
                      error={Boolean(touched.firstname && errors.firstname)}
                    />
                    {touched.firstname && errors.firstname && (
                      <FormHelperText error id="helper-text-firstname-driver">
                        {errors.firstname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-driver">นามสกุล*</InputLabel>
                    <OutlinedInput
                      id="lastname-driver"
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
                      <FormHelperText error id="helper-text-lastname-driver">
                        {errors.lastname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="license_no-driver">เลขที่ใบขับขี่*</InputLabel>
                    <OutlinedInput
                      id="license_no-driver"
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
                      <FormHelperText error id="helper-text-license_no-driver">
                        {errors.license_no}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="mobile_no-driver">เบอร์โทรศัพท์*</InputLabel>
                    <OutlinedInput
                      id="mobile_no-driver"
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
                      <FormHelperText error id="helper-text-mobile_no-driver">
                        {errors.mobile_no}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                  <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="primary">
                    บันทึกข้อมูล
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      backToDrivers();
                    }}
                  >
                    ย้อนกลับ
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

export default UpdateDrivers;
