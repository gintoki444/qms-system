import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
const userId = localStorage.getItem('user_id');
import * as reserveRequest from '_api/reserveRequest';
import * as lineNotifyApi from '_api/linenotify';

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
  Autocomplete
} from '@mui/material';
import MainCard from 'components/MainCard';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { SaveOutlined } from '@ant-design/icons';
import { useSnackbar } from 'notistack';

// DateTime
import moment from 'moment';

function AddReserve() {
  const [loading, setLoading] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const userRoles = useSelector((state) => state.auth.roles);
  const { enqueueSnackbar } = useSnackbar();

  // =============== Get Company ===============//
  const [companyList, setCompanyList] = useState([]);
  const getCompanyLsit = () => {
    const urlapi = apiUrl + `/allcompany/` + userId;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setCompanyList(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Car ===============//
  const [carList, setCarList] = useState([]);
  const getCarLsit = () => {
    const urlapi = apiUrl + `/allcars/${userId}`;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.unshift({
            car_id: 1,
            user_id: 1,
            registration_no: 'ไม่ระบุรถ',
            brand: 'ไม่ระบุ',
            color: 'ไม่ระบุ',
            car_type_id: 4,
            province_id: null,
            created_at: '2024-04-04T21:17:43.000Z',
            updated_at: '2024-04-04T21:17:43.000Z',
            car_type_name: 'รถสิบล้อ',
            code: null,
            name_th: null,
            name_en: null,
            geography_id: null
          });
          setCarList(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Driver ===============//
  const [driverList, setDriverList] = useState([]);
  const getDriverLsit = () => {
    const urlapi = apiUrl + `/alldrivers/${userId}`;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.unshift({
            driver_id: 1,
            user_id: 1,
            firstname: 'ไม่ระบุคนขับรถ',
            lastname: '',
            license_no: 'ไม่ระบุ',
            id_card_no: 'ไม่ระบุ',
            mobile_no: 'ไม่ระบุ',
            created_at: '2024-04-04T21:21:02.000Z',
            updated_at: '2024-04-04T21:21:02.000Z'
          });
          setDriverList(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Product Company ===============//
  const [productCompany, setProductCompany] = useState([]);
  const getProductCompany = () => {
    try {
      reserveRequest.getAllproductCompanys().then((response) => {
        setProductCompany(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeProductCom = (e) => {
    getProductBrand(e.target.value);
  };

  // =============== Get Product Brand ===============//
  const [productBrand, setProductBrand] = useState([]);
  const getProductBrand = (id) => {
    try {
      reserveRequest.getProductBrandById(id).then((response) => {
        setProductBrand(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== useEffect ===============//
  useEffect(() => {
    if (userRoles) {
      getCompanyLsit();
      getCarLsit();
      getDriverLsit();
      getProductCompany();
    }
  }, [userRoles]);

  const initialValue = {
    company_id: '',
    car_id: '',
    brand_group_id: '',
    product_company_id: '',
    product_brand_id: '',
    driver_id: '',
    description: '',
    pickup_date: moment(new Date()).format('yyyy-MM-DD'),
    warehouse_id: 1,
    station_id: 1,
    reserve_station_id: 1,
    status: 'waiting',
    total_quantity: 0
  };

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required('กรุณาเลือกบริษัท/ร้านค้า'),
    // brand_group_id: Yup.string().required('กรุณาเลือกกลุ่มสินค้า'),
    product_company_id: Yup.string().required('กรุณาระบุบริษัท(สินค้า)'),
    product_brand_id: Yup.string().required('กรุณาระบุตรา(สินค้า)'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า'),
    reserve_station_id: Yup.string().required('กรุณาเลือกหัวจ่าย'),
    car_id: Yup.string().required('กรุณาเลือกรถบรรทุก'),
    driver_id: Yup.string().required('กรุณาเลือกคนขับรถ')
    // description: Yup.string().required('กรุณากรอกหัวข้อการจอง')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    setLoading(true);
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    try {
      values.user_id = userId;
      values.pickup_date = moment(values.pickup_date).format('YYYY-MM-DD HH:mm:ss');
      if (values.product_company_id > 7) {
        values.brand_group_id = 7;
      } else {
        values.brand_group_id = values.product_company_id;
      }
      values.created_at = currentDate;
      values.updated_at = currentDate;

      console.log(values);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/addreserve',
        headers: {
          'Content-Type': 'application/json'
        },
        data: values
      };

      // if (userId === 999) {
      axios
        .request(config)
        .then((result) => {
          if (result.data.status === 'ok') {
            enqueueSnackbar('บันทึกข้อมูลสำเร็จ!', { variant: 'success' });
            setMessageCreateReserve(result.data.results.insertId);
          } else {
            alert(result.message.sqlMessage);
          }

          setStatus({ success: false });
          setSubmitting(false);
        })
        .catch((error) => {
          enqueueSnackbar('บันทึกข้อมูลไม่สำเร็จ!', { variant: 'warning' });
          setLoading(false);
          alert(error);
        });
      // }
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setLoading(false);
      setSubmitting(false);
    }
  };

  const setMessageCreateReserve = async (id) => {
    const prurl = window.location.origin + '/reserve/update/' + id;

    await reserveRequest.getReserDetailID(id).then((result) => {
      result.reserve.map((data) => {
        const company_name_m = 'บริษัท: ' + data.name;
        const registration_no_m = data.registration_no;
        const driver_name_m = 'คนขับรถ: ' + data.driver;
        const driver_mobile_m = 'เบอร์โทร: ' + data.mobile_no;

        const textMessage =
          'แจ้งเตือนการ จองคิวรับสินค้า' +
          '\n' +
          'วันที่: ' +
          moment(new Date()).format('DD/MM/YYYY HH:mm:ss') +
          '\n' +
          '\n' +
          company_name_m +
          '\n' +
          registration_no_m +
          '\n' +
          driver_name_m +
          '\n' +
          driver_mobile_m +
          +'\n' +
          '\n' +
          '\n' +
          prurl;

        lineNotifyApi.sendLinenotify(textMessage).then(() => {
          window.location.href = '/reserve/update/' + id;
          setLoading(false);
        });
      });
    });
  };

  return (
    <Grid alignItems="center" justifyContent="space-between">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits}>
          {({ handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, values, touched, errors }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">เพิ่มข้อมูลจองคิวรับสินค้า</Typography>
                  <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>บริษัท/ร้านค้า *</InputLabel>
                    <FormControl fullWidth>
                      <Autocomplete
                        disablePortal
                        id="company-list"
                        options={companyList}
                        onChange={(e, value) => {
                          const newValue = value ? value.company_id : null;
                          setFieldValue('company_id', newValue);
                        }}
                        getOptionLabel={(option) => option.name}
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
                            name="company_id"
                            placeholder="เลือกบริษัท/ร้านค้า"
                            error={Boolean(touched.company_id && errors.company_id)}
                          />
                        )}
                      />
                    </FormControl>
                    {touched.company_id && errors.company_id && (
                      <FormHelperText error id="helper-text-company-car">
                        {errors.company_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>บริษัท (สินค้า) *</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        variant="outlined"
                        name="product_company_id"
                        value={values.product_company_id || ''}
                        onChange={(e) => {
                          setFieldValue('product_company_id', e.target.value);
                          setFieldValue('product_brand_id', '');
                          handleChangeProductCom(e);
                        }}
                        fullWidth
                        error={Boolean(touched.product_company_id && errors.product_company_id)}
                      >
                        <MenuItem disabled value="">
                          เลือกบริษัท
                        </MenuItem>
                        {productCompany.map((companias) => (
                          <MenuItem key={companias.product_company_id} value={companias.product_company_id}>
                            {companias.product_company_name_th}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  {touched.product_company_id && errors.product_company_id && (
                    <FormHelperText error id="helper-text-product_company_id">
                      {errors.product_company_id}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>ตรา (สินค้า) *</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        variant="outlined"
                        name="product_brand_id"
                        value={values.product_brand_id}
                        onChange={handleChange}
                        placeholder="เลือกสายแรงงาน"
                        fullWidth
                        error={Boolean(touched.product_brand_id && errors.product_brand_id)}
                      >
                        <MenuItem disabled value="">
                          เลือกตรา (สินค้า)
                        </MenuItem>
                        {productBrand.map((brands) => (
                          <MenuItem key={brands.product_brand_id} value={brands.product_brand_id}>
                            {brands.product_brand_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  {touched.product_brand_id && errors.product_brand_id && (
                    <FormHelperText error id="helper-text-product_brand_id">
                      {errors.product_brand_id}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>วันที่เข้ารับสินค้า *</InputLabel>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      id="pickup_date"
                      name="pickup_date"
                      onBlur={handleBlur}
                      value={values.pickup_date}
                      onChange={handleChange}
                      inputProps={{
                        min: currentDate
                      }}
                    />
                    {touched.pickup_date && errors.pickup_date && (
                      <FormHelperText error id="helper-text-pickup_date">
                        {errors.pickup_date}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>รถบรรทุก *</InputLabel>
                    <FormControl fullWidth>
                      <Autocomplete
                        disablePortal
                        id="car-list"
                        options={carList}
                        onChange={(e, value) => {
                          const newValue = value ? value.car_id : '';
                          setFieldValue('car_id', newValue);
                        }}
                        getOptionLabel={(option) => {
                          if (option.car_id !== 1) {
                            return option.registration_no;
                          } else {
                            return 'ไม่ระบุรถบรรทุก';
                          }
                        }}
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
                            name="car_id"
                            placeholder="เลือกรถบรรทุก"
                            error={Boolean(touched.car_id && errors.car_id)}
                          />
                        )}
                      />
                      {/* <Select
                        displayEmpty
                        variant="outlined"
                        name="car_id"
                        value={values.car_id || ''}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(touched.car_id && errors.car_id)}
                      >
                        <MenuItem disabled value="">
                          เลือกรถบรรทุก
                        </MenuItem>
                        <MenuItem value="1">ไม่ระบุรถบรรทุก</MenuItem>
                        {carList.map((cars) => (
                          <MenuItem key={cars.car_id} value={cars.car_id}>
                            ทะเบียน : {cars.registration_no}
                          </MenuItem>
                        ))}
                      </Select> */}
                    </FormControl>
                    {touched.car_id && errors.car_id && (
                      <FormHelperText error id="helper-text-company-car">
                        {errors.car_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>คนขับรถ *</InputLabel>
                    <FormControl fullWidth>
                      <Autocomplete
                        disablePortal
                        id="driver-list"
                        options={driverList}
                        name="driver_id"
                        // onChange={(e, value) => setFieldValue('driver_id', value.driver_id)}
                        onChange={(e, value) => {
                          const newValue = value ? value.driver_id : '';
                          setFieldValue('driver_id', newValue);
                        }}
                        getOptionLabel={(option) => option.firstname + ' ' + option.lastname}
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
                        error={Boolean(touched.driver_id && errors.driver_id)}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="เลือกคนขับรถ" error={Boolean(touched.driver_id && errors.driver_id)} />
                        )}
                      />
                    </FormControl>
                    {touched.driver_id && errors.driver_id && (
                      <FormHelperText error id="helper-text-driver_id-car">
                        {errors.driver_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>เหตุผลการจอง</InputLabel>
                    <OutlinedInput
                      id="description"
                      type="description"
                      value={values.description}
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="เหตุผลการจอง"
                      error={Boolean(touched.description && errors.description)}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error id="helper-text-description">
                        {errors.description}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid> */}

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>จำนวนสินค้า</InputLabel>
                    <OutlinedInput
                      id="total_quantity"
                      type="text"
                      disabled
                      value={values.total_quantity}
                      name="color"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="จำนวนสินค้า"
                      fullWidth
                      error={Boolean(touched.total_quantity && errors.total_quantity)}
                    />
                    {touched.total_quantity && errors.total_quantity && (
                      <FormHelperText error id="helper-text-total_quantity">
                        {errors.total_quantity}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

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
                    เพิ่มข้อมูลจองคิว
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
