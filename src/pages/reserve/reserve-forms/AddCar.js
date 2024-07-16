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
  FormControl,
  Select,
  Button,
  MenuItem,
  Typography,
  Divider
} from '@mui/material';

import { SaveOutlined, PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

// Link api url
import * as carRequest from '_api/carRequest';

// DateTime
import moment from 'moment';
import { useSnackbar } from 'notistack';

function AddCar({ userID, onSaves, carsList }) {
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('user_id');
  const { enqueueSnackbar } = useSnackbar();

  if (!userId) {
    window.location.href = '/login';
  }

  const [carTypeList, setCarTypeList] = useState([]);
  const getCarType = () => {
    carRequest.getAllCarType().then((response) => {
      setCarTypeList(response.filter((x) => x.car_type_id === 1 || x.car_type_id === 3 || x.car_type_id === 4 || x.car_type_id === 5 || x.car_type_id === 6 || x.car_type_id === 8));
    });
  };

  // const [provincesList, setProvincesList] = useState([]);
  // const getProvinces = () => {
  //   carRequest.getAllProvinces().then((response) => {
  //     setProvincesList(response);
  //   });
  // };

  useEffect(() => {
    getCarType();
    // getProvinces();
  }, [userID, carsList]);

  const initialValue = {
    registration_no: '',
    brand: '',
    color: '',
    province_id: '',
    car_type_id: ''
  };

  const valiDationSchema = Yup.object().shape({
    registration_no: Yup.string().max(255).required('กรุณาระบุทะเบียนรถ'),
    // province_id: Yup.string().max(255).required('กรุณาระบุจังหวัด'),
    car_type_id: Yup.string().required('กรุณาระบุประเภทรถ')
  });

  // =============== เพิ่มข้อมูลรถ ===============//
  const [openCar, setOpenCar] = useState(false);
  const handleClickAddCar = (open) => {
    setOpenCar(open);
  };

  const handleCloseCar = () => {
    setOpenCar(false);
  };

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const checkCar = carsList.filter(
      (x) => x.registration_no == values.registration_no
        // && x.province_id == values.province_id 
        && x.car_type_id == values.car_type_id
    );

    if (checkCar && checkCar.length <= 0) {
      try {
        values.user_id = userID;
        values.created_at = currentDate;
        values.updated_at = currentDate;
        setLoading(true);
        setOpenCar(false);

        // // test add
        // onSaves(values);

        // if (values == 999) {
        carRequest.AddCar(values).then((response) => {
          if (response.status === 'ok') {
            carRequest.getAllCars(userID).then((response) => {
              const result = response.filter(
                (x) =>
                  x.registration_no == values.registration_no
                  // && x.province_id == values.province_id 
                  && x.car_type_id == values.car_type_id
              );

              enqueueSnackbar('เพิ่มข้อมูลรถสำเร็จ!', { variant: 'success' });
              onSaves(result);
              setLoading(false);
            });
          } else {
            enqueueSnackbar('เพิ่มข้อมูลรถไม่สำเร็จ! :' + response.message.sqlMessage, { variant: 'error' });
          }
        });
        // }
      } catch (err) {
        console.error(err);
      }
    } else {
      enqueueSnackbar('มีข้อมูลทะเบียนรถ : ' + values.registration_no + 'แล้ว', { variant: 'error' });
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
        onClick={() => handleClickAddCar(true)}
      >
        เพิ่มรถบรรทุก
      </Button>
      <Dialog open={openCar} onClose={handleCloseCar} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" align="center">
          <Typography variant="h5">เพิ่มข้อมูลรถบรรทุก</Typography>
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

                      {/* <Grid item xs={12} md={6}>
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
                      </Grid> */}

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
                      {/* )} */}
                    </Grid>
                    <Grid item xs={12} sx={{ mb: '-16px' }}>
                      <Divider sx={{ pt: 2 }} />
                      <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => handleCloseCar()}
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
                          เพิ่มข้อมูลรถ
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
export default AddCar;
