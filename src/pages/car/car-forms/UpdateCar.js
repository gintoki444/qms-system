import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';
// Link api url
import * as carRequest from '_api/carRequest';
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
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Alert
} from '@mui/material';
import MainCard from 'components/MainCard';

// DateTime
import moment from 'moment';

function UpdateCar() {
  const pageId = 6;
  const userPermission = useSelector((state) => state.auth?.user_permissions);
  const [pageDetail, setPageDetail] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  let [initialValue, setInitialValue] = useState({
    registration_no: '',
    brand: '',
    province_id: '',
    color: '',
    car_type_id: ''
  });

  const userId = localStorage.getItem('user_id');

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    registration_no: Yup.string().max(255).required('กรุณาระบุทะเบียนรถ'),
    province_id: Yup.string().max(255).required('กรุณาระบุจังหวัด'),
    car_type_id: Yup.string().required('กรุณาระบุประเภทรถ')
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
              car_type_id: result.car_type_id ? result.car_type_id : '',
              brand: result.brand,
              province_id: result.province_id ? result.province_id : '',
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

  const [carList, setCarList] = useState([]);
  const getCarList = async () => {
    setOpen(true);
    try {
      carRequest.getAllCars(userId).then((response) => {
        setCarList(response);
        setOpen(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  // =============== Get ข้อมูล Type Car ===============//
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
    setOpen(true);
    if (Object.keys(userPermission).length > 0) {
      if (userPermission.permission.filter((x) => x.page_id === pageId).length > 0) {
        setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
        getCar(id);
        getCarList();
        getCarType();
        getProvinces();
      } else {
        setOpen(false);
      }
    }
  }, [id, userPermission]);
  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData();

    if (carList.filter((x) => x.registration_no === values.registration_no && x.car_id !== parseInt(id)).length > 0) {
      enqueueSnackbar('ไม่สามารถแก้ไขข้อมูลรถซ้ำได้!', { variant: 'error' });
    } else {
      try {
        values.user_id = userId;
        values.created_at = currentDate;
        values.updated_at = currentDate;

        formData.append('user_id', values.user_id);
        formData.append('registration_no', values.registration_no);
        formData.append('car_type_id', values.car_type_id);
        formData.append('province_id', values.province_id);
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
            if (result.data.status === 'ok') {
              enqueueSnackbar('บันทึกข้อมูลรถสำเร็จ!', { variant: 'success' });
              window.location.href = '/car';
            } else {
              enqueueSnackbar('บันทึกข้อมูลร้านค้า/บริษัท ไม่สำเร็จ!' + result['message']['sqlMessage'], { variant: 'warning' });
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
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5">แก้ไขข้อมูลรถ</Typography>
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
                        <Autocomplete
                          disablePortal
                          id="province-list"
                          options={provincesList}
                          onChange={(e, value) => {
                            const newValue = value ? value.province_id : null;
                            setFieldValue('province_id', newValue);
                          }}
                          value={provincesList.length > 0 ? provincesList.find((item) => item.province_id === values.province_id) : []}
                          getOptionLabel={(option) => (option.name_th ? option.name_th : '')}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              padding: '3px 8px!important'
                            },
                            '& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
                              right: '7px!important',
                              top: 'calc(50% - 18px)'
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="province_id"
                              placeholder="เลือกจังหวัด"
                              error={Boolean(touched.province_id && errors.province_id)}
                            />
                          )}
                        />
                        {/* <Select
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
                      </Select> */}
                      </FormControl>
                      {touched.province_id && errors.province_id && (
                        <FormHelperText error id="helper-province_id">
                          {errors.province_id}
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
      )}
    </Grid>
  );
}

export default UpdateCar;
