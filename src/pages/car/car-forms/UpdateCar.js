import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';
// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

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
  CircularProgress
} from '@mui/material';
import MainCard from 'components/MainCard';

// DateTime
import moment from 'moment';

function UpdateCar() {
  const [open, setOpen] = useState(false);
  let [initialValue, setInitialValue] = useState({
    registration_no: '',
    brand: '',
    color: ''
  });

  const userId = localStorage.getItem('user_id');

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    registration_no: Yup.string().max(255).required('กรุณาระบุทะเบียนรถ'),
    brand: Yup.string().max(255).required('กรุณาระบุยี่ห้อรถ'),
    color: Yup.string().max(255).required('กรุณาระบุสีรถ')
  });

  // =============== Get ข้อมูล Car ===============//
  const { id } = useParams();
  const getCar = async (id) => {
    setOpen(true);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/car/' + id,
      headers: {}
    };

    await axios
      .request(config)
      .then((response) => {
        response.data.car.map((result) => {
          if (result) {
            setInitialValue({
              registration_no: result.registration_no,
              brand: result.brand,
              color: result.color
            });
            setOpen(false);
          }
        });
      })

      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCar(id);
  }, [id]);
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
      formData.append('color', values.color);
      formData.append('created_at', values.created_at);
      formData.append('updated_at', values.updated_at);

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: apiUrl + '/updatecar/' + id,
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

  const navigate = useNavigate();
  const backToCar = () => {
    navigate('/car');
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits} enableReinitialize={true}>
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
                    <InputLabel htmlFor="brand-car">ยี้ห้อรถ*</InputLabel>
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

                <Grid item xs={12} md={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="color-car">สีรถ*</InputLabel>
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

                <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="mediam"
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveOutlined />}
                  >
                    บันทึกข้อมูล
                  </Button>
                  <Button
                    size="mediam"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      backToCar();
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
  );
}

export default UpdateCar;
