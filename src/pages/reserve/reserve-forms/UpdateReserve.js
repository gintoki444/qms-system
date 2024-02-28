import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
const userId = localStorage.getItem('user_id');

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
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Backdrop,
  CircularProgress
} from '@mui/material';
import MainCard from 'components/MainCard';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// DateTime
import moment from 'moment';

function UpdateReserve() {
  const [open, setOpen] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  // =============== Get Reserve ID ===============//
  const [reservationData, setReservationData] = useState({
    description: '',
    company_id: '',
    car_id: '',
    driver_id: '',
    status: 'waiting',
    total_quantity: '',
    pickup_date: '',
    brand_group_id: '',
    warehouse_id: '',
    created_at: '',
    updated_at: '',
    firstname: '',
    lastname: '',
    role: '',
    country: '',
    email: '',
    avatar: '',
    name: '',
    open_time: '',
    tax_no: '',
    phone: '',
    address: '',
    zipcode: '',
    contact_person: '',
    contact_number: '',
    registration_no: '',
    brand: '',
    color: '',
    license_no: '',
    mobile_no: '',
    r_description: '',
    company: '',
    driver: ''
  });
  const { id } = useParams();
  const getReserve = () => {
    setOpen(true);
    const urlapi = apiUrl + `/reserve/` + id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.reserve.map((result) => {
            setReservationData(result);
          });
        }
      })
      .catch((err) => console.log(err));
  };

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

  // =============== Get order ===============//
  const [orderList, setOrderList] = useState([]);
  const getOrder = async () => {
    const urlapi = apiUrl + `/orders/` + id;
    await axios
      .get(urlapi)
      .then((res) => {
        setOrderList(res.data);
        setOpen(false);
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Product ===============//
  // const [productList, setProductList] = useState([]);
  // const getProduct = async () => {
  //   const urlapi = apiUrl + `/allproducts`;
  //   await axios
  //     .get(urlapi)
  //     .then((res) => {
  //       setProductList(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // };
  // =============== useEffect ===============//
  useEffect(() => {
    getCompanyLsit();
    getCarLsit();
    getDriverLsit();
    getWarehouses();
    getBrandList();
    getOrder();
    // getProduct();
    getReserve();
  }, [id]);

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required('กรุณาเลือกบริษัท/ร้านค้า'),
    brand_group_id: Yup.string().required('กรุณาเลือกกลุ่มสินค้า'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า'),
    description: Yup.string().required('กรุณากรอกiรายละเอียดการจอง')
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
        method: 'put',
        maxBodyLength: Infinity,
        url: apiUrl + `/updatereserve/${id}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: values
      };

      console.log('values :', values);

      axios
        .request(config)
        .then((result) => {
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

  // =============== เพิ่มรายการสินค้า ===============//
  const addOrder = () => {
    window.location = `/order/add/${id}`;
    // navigate(`/order/add/${id}`);
  };

  const navigate = useNavigate();

  const backToReserce = () => {
    navigate('/reserve');
  };

  const initialValue = {
    company_id: reservationData.company_id || '',
    car_id: reservationData.car_id || '',
    brand_group_id: reservationData.brand_group_id || '',
    driver_id: reservationData.driver_id || '',
    description: reservationData.description,
    pickup_date: moment(reservationData.pickup_date).format('YYYY-MM-DD'),
    warehouse_id: reservationData.warehouse_id || '',
    status: reservationData.status,
    total_quantity: reservationData.total_quantity
  };

  const reservePrint = (id) => {
    navigate('/prints/reserve', { state: { reserveId: id, link: '/reserve/update/' + id } });
  };

  return (
    <Grid alignItems="center" justifyContent="space-between">
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits} enableReinitialize={true}>
            {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, touched, errors }) => (
              <form noValidate onSubmit={handleSubmit}>
                <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">ข้อมูลจองคิวรับสินค้า</Typography>
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
                          onBlur={handleBlur}
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
                              {cars.registration_no} : {cars.brand}
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
                        <InputLabel>หัวข้อการจอง*</InputLabel>
                        <OutlinedInput
                          id="description"
                          type="description"
                          value={values.description}
                          name="description"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="หัวข้อการจอง"
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
                          {warehousesList &&
                            warehousesList.map((warehouses) => (
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
                          sx={{ fontWeight: 600 }}
                          disabled
                          value={parseFloat(values.total_quantity).toFixed(4)}
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
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5">ข้อมูลรายการสั่งซื้อสินค้า</Typography>
                      </Grid>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                      {orderList.length === 0 && (
                        <Grid item xs={6}>
                          <Typography variant="body1">
                            <strong>ไม่มีข้อมูลสินค้า</strong>
                          </Typography>
                        </Grid>
                      )}

                      <Grid item xs={12} sx={{ p: 2 }}>
                        {orderList.map((order, index) => (
                          <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                            <Grid container spacing={2} sx={{ mb: '15px' }}>
                              <Grid item xs={12} md={12}>
                                <Typography variant="body1">
                                  <strong>เลขที่คำสั่งซื้อ : </strong> {order.ref_order_id}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={12}>
                                <Typography variant="body1">
                                  <strong>รายละเอียด : </strong> {order.description}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} md={12}></Grid>
                            <Grid item xs={12} md={6}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ p: '12px' }}>สินค้า</TableCell>
                                    <TableCell align="right" sx={{ p: '12px' }}>
                                      จำนวน (ตัน)
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell width={'50%'}>{item.name}</TableCell>
                                      <TableCell align="right">{item.quantity} ตัน</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Grid>
                            <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                          </Grid>
                        ))}

                        {orderList.length === 0 && (
                          <Typography variant="body1">
                            <strong>ไม่มีข้อมูล </strong>
                          </Typography>
                        )}
                        <Stack direction="row" alignItems="center" spacing={0}>
                          <Button size="mediam" variant="outlined" color="success" onClick={() => addOrder()}>
                            เพิ่มข้อมูลสินค้า
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                    <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />

                    {orderList.length > 0 && (
                      <Button size="mediam" variant="contained" color="info" onClick={() => reservePrint(id)}>
                        พิมพ์
                      </Button>
                    )}
                    <Button disableElevation disabled={isSubmitting} size="mediam" type="submit" variant="contained" color="primary">
                      บันทึกข้อมูลการจอง
                    </Button>

                    <Button
                      size="mediam"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        backToReserce();
                      }}
                    >
                      ย้อนกลับ
                    </Button>
                  </Grid>
                </MainCard>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UpdateReserve;
