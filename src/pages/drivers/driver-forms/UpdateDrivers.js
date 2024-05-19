import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as driverRequest from '_api/driverRequest';

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
import MainCard from 'components/MainCard';

// DateTime
import moment from 'moment';

function UpdateDrivers() {
  const pageId = 7;
  const userPermission = useSelector((state) => state.auth?.user_permissions);
  const [pageDetail, setPageDetail] = useState([]);

  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let [initialValue, setInitialValue] = useState({
    firstname: '',
    lastname: '',
    license_no: '',
    id_card_no: '',
    mobile_no: ''
  });
  // =============== Get ข้อมูล Driver ===============//
  const { id } = useParams();
  const getDriver = async (id) => {
    setOpen(true);
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
              id_card_no: result.id_card_no,
              mobile_no: result.mobile_no
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
    if (Object.keys(userPermission).length > 0) {
      if (userPermission.permission.filter((x) => x.page_id === pageId).length > 0) {
        setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
        getDriver(id);
        getDriversList();
      } else {
        setOpen(false);
      }
    }
  }, [id, userPermission]);

  const [driverList, setDriverList] = useState([]);
  const getDriversList = () => {
    setOpen(true);
    try {
      driverRequest.getAllDriver(userId).then((response) => {
        setOpen(false);
        setDriverList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== บันทึกข้อมูล ===============//
  const userId = localStorage.getItem('user_id');
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData();

    if (
      driverList.filter((x) => x.firstname == values.firstname && x.lastname == values.lastname && x.driver_id !== parseInt(id)).length > 0
    ) {
      enqueueSnackbar('ไม่สามารถแก้ไขข้อมูลคนขับซ้ำได้!', { variant: 'error' });
    } else {
      try {
        values.user_id = userId;
        values.created_at = currentDate;
        values.updated_at = currentDate;

        formData.append('user_id', values.user_id);
        formData.append('firstname', values.firstname);
        formData.append('lastname', values.lastname);
        formData.append('license_no', values.license_no);
        formData.append('id_card_no', values.id_card_no);
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
              enqueueSnackbar('บันทึกข้อมูลคนขับรถสำเร็จ!', { variant: 'success' });
              window.location.href = '/drivers';
            } else {
              enqueueSnackbar('บันทึกข้อมูลคนขับรถไม่สำเร็จ!' + result['message']['sqlMessage'], { variant: 'warning' });
              // alert(result['message']['sqlMessage']);
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
    }
  };

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().max(255).required('กรุณาระบุชื่อ'),
    lastname: Yup.string().max(255).required('กรุณาระบุนามสกุล'),
    // license_no: Yup.string()
    //   .matches(/^[0-9]*$/, 'กรุณาระบุเลขใบขับขี่เป็นตัวเลขเท่านั้น')
    //   .min(13, 'กรุณาระบุเลขใบขับขี่ 13 หลัก')
    //   .max(13, 'กรุณาระบุเลขใบขับขี่ 13 หลัก')
    //   .required('กรุณาระบุเลขใบขับขี่'),
    id_card_no: Yup.string()
      .nullable()
      .matches(/^[0-9]*$/, 'กรุณาระบุเลขบัตรประชาชนเป็นตัวเลขเท่านั้น')
      .min(13, 'กรุณาระบุเลขบัตรประชาชน 13 หลัก')
      .max(13, 'กรุณาระบุเลขบัตรประชาชน 13 หลัก')
      .required('กรุณาระบุเลขบัตรประชาชน'),
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
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      {Object.keys(userPermission).length > 0 && pageDetail.length === 0 && (
        <Grid item xs={12}>
          <MainCard content={false}>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
            </Stack>
          </MainCard>
        </Grid>
      )}
      {pageDetail.length !== 0 && (
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
                      <InputLabel htmlFor="id_card_no-driver">เลขที่บัตรประชาชน*</InputLabel>
                      <OutlinedInput
                        id="id_card_no-driver"
                        type="text"
                        value={values.id_card_no}
                        name="id_card_no"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="เลขที่บัตรประชาชน"
                        fullWidth
                        error={Boolean(touched.id_card_no && errors.id_card_no)}
                      />
                      {touched.id_card_no && Boolean(errors.id_card_no) && (
                        <FormHelperText error id="helper-text-id_card_no-driver">
                          {errors.id_card_no}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* <Grid item xs={12} md={6}>
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
                </Grid> */}

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
                    {pageDetail.length > 0 &&
                      (pageDetail[0].permission_name === 'manage_everything' ||
                        pageDetail[0].permission_name === 'add_edit_delete_data') && (
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
                      )}

                    <Button
                      size="mediam"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        backToDrivers();
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
      )}
    </Grid>
  );
}

export default UpdateDrivers;
