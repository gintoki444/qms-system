import React, { useState, useEffect } from 'react';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// material-ui
import {
  Backdrop,
  CircularProgress,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider
} from '@mui/material';

import { SaveOutlined, PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

// Link api url
import * as driverRequest from '_api/driverRequest';

// DateTime
import moment from 'moment';
import { useSnackbar } from 'notistack';

function AddDriver({ userID, onSaves, driverList }) {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {}, [userID]);

  const initialValue = {
    firstname: '',
    lastname: '',
    id_card_no: '',
    license_no: '',
    mobile_no: ''
  };

  const valiDationSchema = Yup.object().shape({
    firstname: Yup.string().max(255).required('กรุณาระบุชื่อ'),
    lastname: Yup.string().max(255).required('กรุณาระบุนามสกุล'),
    // license_no: Yup.string()
    //   .nullable()
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
      .matches(/^0/, 'กรุณาระบุเบอร์โทรศัพท์ตัวแรกเป็น 0')
      .matches(/^[0-9]*$/, 'กรุณาระบุเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น')
      .min(10, 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก')
      .max(10, 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก')
      .required('กรุณาระบุเบอร์โทรศัพท์')
  });

  // =============== เพิ่มข้อมูลคนขับรถ ===============//
  const [openDriver, setOpenDriver] = useState(false);
  const handleClickAddDriver = (open) => {
    setOpenDriver(open);
  };

  const handleCloseDriver = () => {
    setOpenDriver(false);
  };

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const checkCar = driverList.filter(
      (x) => x.firstname == values.firstname && x.lastname == values.lastname && x.license_no == values.license_no
    );

    if (checkCar && checkCar.length <= 0) {
      try {
        values.user_id = userID;
        values.created_at = currentDate;
        values.updated_at = currentDate;
        setLoading(true);
        setOpenDriver(false);

        // // test add
        // onSaves(values);

        // if (values == 999) {
        driverRequest.AddDriver(values).then((response) => {
          if (response.status === 'ok') {
            driverRequest.getAllDriver(userID).then((response) => {
              const result = response.filter(
                (x) => x.firstname == values.firstname && x.lastname == values.lastname && x.license_no == values.license_no
              );

              enqueueSnackbar('เพิ่มข้อมูลคนขับรถสำเร็จ!', { variant: 'success' });
              onSaves(result);
              setLoading(false);
            });
          } else {
            enqueueSnackbar('เพิ่มข้อมูลคนขับรถไม่สำเร็จ! :' + response.message.sqlMessage, { variant: 'error' });
          }
        });
        // }
      } catch (err) {
        console.error(err);
      }
    } else {
      enqueueSnackbar('มีข้อมูลคนขับรถ : ' + values.firstname + ' ' + values.lastname + 'แล้ว', { variant: 'error' });
    }
  };
  return (
    <>
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Button
        variant="text"
        size="small"
        sx={{ mt: 1 }}
        color="success"
        startIcon={<PlusCircleOutlined />}
        onClick={() => handleClickAddDriver(true)}
      >
        เพิ่มคนขับรถ
      </Button>
      <Dialog open={openDriver} onClose={handleCloseDriver} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" align="center">
          <Typography variant="h5">เพิ่มข้อมูลคนขับรถบรรทุก</Typography>
          <Divider sx={{ pt: 2 }} />
        </DialogTitle>
        <DialogContent sx={{ maxWidth: { xs: 'auto', md: '480px' }, minWidth: { xs: 'auto', md: '480px' } }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Formik initialValues={initialValue} validationSchema={valiDationSchema} onSubmit={handleSubmits}>
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
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

                      <Grid item xs={12} md={12}>
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
                            // error={touched.id_card_no && Boolean(errors.id_card_no)}
                            // helperText={touched.id_card_no && errors.id_card_no}
                            error={Boolean(touched.id_card_no && errors.id_card_no)}
                          />
                          {touched.id_card_no && Boolean(errors.id_card_no) && (
                            <FormHelperText error id="helper-text-id_card_no-driver">
                              {errors.id_card_no}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      {/* <Grid item xs={12} md={12}>
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
                            // error={touched.license_no && Boolean(errors.license_no)}
                            // helperText={touched.license_no && errors.license_no}
                            error={Boolean(touched.license_no && errors.license_no)}
                          />
                          {touched.license_no && Boolean(errors.license_no) && (
                            <FormHelperText error id="helper-text-license_no-driver">
                              {errors.license_no}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid> */}

                      <Grid item xs={12} md={12}>
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
                    </Grid>
                    <Grid item xs={12} sx={{ mb: '-16px' }}>
                      <Divider sx={{ pt: 2 }} />
                      <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => handleCloseDriver()}
                          autoFocus
                          startIcon={<CloseCircleOutlined />}
                        >
                          ยกเลิก
                        </Button>
                        <Button
                          disableElevation
                          size="mediam"
                          type="submit"
                          variant="contained"
                          color="success"
                          startIcon={<SaveOutlined />}
                        >
                          เพิ่มข้อมูลคนขับรถ
                        </Button>
                      </DialogActions>
                    </Grid>
                  </form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddDriver;
