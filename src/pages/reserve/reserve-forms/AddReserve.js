import React, { useState, useEffect } from 'react';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
const userId = localStorage.getItem('user_id');

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Divider } from '@mui/material';
import MainCard from 'components/MainCard';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// DateTime
import moment from 'moment';

function AddReserve() {
  const currentDate = new Date().toISOString().split('T')[0];

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
    const urlapi = apiUrl + `/allcars/` + userId;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setCarList(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Driver ===============//
  const [driverList, setDriverList] = useState([]);
  const getDriverLsit = () => {
    const urlapi = apiUrl + `/alldrivers/` + userId;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setDriverList(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Brand ===============//
  const [brandList, setBrandList] = useState([]);
  const getBrandList = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(apiUrl + '/allproductbrandgroup', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setBrandList(result);
      })
      .catch((error) => console.log('error', error));
  };

  // =============== Get Warehouses ===============//
  const [warehousesList, setWarehousesList] = useState([]);
  const getWarehouses = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(apiUrl + '/allwarehouses', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setWarehousesList(result);
      })
      .catch((error) => console.log('error', error));
  };

  // =============== useEffect ===============//
  useEffect(() => {
    getCompanyLsit();
    getCarLsit();
    getDriverLsit();
    getWarehouses();
    getBrandList();
  }, []);

  const initialValue = {
    company_id: '',
    car_id: '',
    brand_group_id: '',
    driver_id: '',
    description: '',
    pickup_date: moment(new Date()).format('YYYY-MM-DD'),
    warehouse_id: '',
    status: 'waiting',
    total_quantity: 0
  };

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required('กรุณาเลือกบริษัท/ร้านค้า'),
    brand_group_id: Yup.string().required('กรุณาเลือกกลุ่มสินค้า'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า'),
    description: Yup.string().required('กรุณากรอกหัวข้อการจอง')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    try {
      values.user_id = userId;
      values.pickup_date = moment(values.pickup_date).format('YYYY-MM-DD HH:mm:ss');
      values.created_at = currentDate;
      values.updated_at = currentDate;

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/addreserve',
        headers: {
          'Content-Type': 'application/json'
        },
        data: values
      };

      axios
        .request(config)
        .then((result) => {
          if (result.data.status === 'ok') {
            window.location.href = '/reserve/update/'+result.data.results.insertId;
            console.log('result :', result);
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
    <Grid alignItems="center" justifyContent="space-between">
      <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits}>
          {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, touched, errors }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">เพิ่มข้อมูลจองคิวรับสินค้า</Typography>
                  <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>บริษัท/ร้านค้า*</InputLabel>
                    <TextField
                      select
                      variant="outlined"
                      name="company_id"
                      value={values.company_id}
                      onChange={handleChange}
                      placeholder="เลือกบริษัท/ร้านค้า"
                      fullWidth
                    >
                      {companyList.map((companias) => (
                        <MenuItem key={companias.company_id} value={companias.company_id}>
                          {companias.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    {touched.company_id && errors.company_id && (
                      <FormHelperText error id="helper-text-company-car">
                        {errors.company_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>กลุ่มสินค้า*</InputLabel>
                    <TextField
                      select
                      variant="outlined"
                      name="brand_group_id"
                      value={values.brand_group_id}
                      onChange={handleChange}
                      placeholder="เลือกกลุ่มสินค้า"
                      fullWidth
                    >
                      {brandList.map((brand) => (
                        <MenuItem key={brand.brand_group_id} value={brand.brand_group_id}>
                          {brand.group_code} - {brand.description}
                        </MenuItem>
                      ))}
                    </TextField>
                    {touched.brand_group_id && errors.brand_group_id && (
                      <FormHelperText error id="helper-text-company-car">
                        {errors.brand_group_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>รถบรรทุก</InputLabel>
                    <TextField
                      select
                      variant="outlined"
                      name="car_id"
                      value={values.car_id}
                      onChange={handleChange}
                      placeholder="เลือกรถบรรทุก"
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        <em>Placeholder</em>
                      </MenuItem>
                      {carList.map((cars) => (
                        <MenuItem key={cars.car_id} value={cars.car_id}>
                          {cars.brand} : {cars.registration_no}
                        </MenuItem>
                      ))}
                    </TextField>
                    {touched.company && errors.company && (
                      <FormHelperText error id="helper-text-company-car">
                        {errors.company}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>คนขับรถ</InputLabel>
                    <TextField
                      select
                      variant="outlined"
                      type="date"
                      name="driver_id"
                      value={values.driver_id}
                      onChange={handleChange}
                      placeholder="เลือกคนขับรถ"
                      fullWidth
                    >
                      {driverList.map((driver) => (
                        <MenuItem key={driver.driver_id} value={driver.driver_id}>
                          {driver.firstname} {driver.lastname}
                        </MenuItem>
                      ))}
                    </TextField>
                    {touched.company && errors.company && (
                      <FormHelperText error id="helper-text-company-car">
                        {errors.company}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>วันที่เข้ารับสินค้า*</InputLabel>
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
                    <InputLabel>เหตุผลการจอง*</InputLabel>
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel>คลังสินค้า</InputLabel>
                    <TextField
                      select
                      variant="outlined"
                      name="warehouse_id"
                      value={values.warehouse_id}
                      onChange={handleChange}
                      placeholder="เลือกคลังสินค้า"
                      fullWidth
                    >
                      {warehousesList.map((warehouses) => (
                        <MenuItem key={warehouses.warehouse_id} value={warehouses.warehouse_id}>
                          {warehouses.description}
                        </MenuItem>
                      ))}
                    </TextField>
                    {touched.company && errors.company && (
                      <FormHelperText error id="helper-text-company-car">
                        {errors.company}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

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
                  <Button disableElevation disabled={isSubmitting} size="mediam" type="submit" variant="contained" color="primary">
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
