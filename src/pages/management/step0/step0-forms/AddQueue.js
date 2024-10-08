import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../../node_modules/axios/index';
// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as reserveRequest from '_api/reserveRequest';
import * as adminRequest from '_api/adminRequest';

// const userId = localStorage.getItem('user_id');

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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Backdrop,
  CircularProgress,
  Alert
} from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import MainCard from 'components/MainCard';
import { PlusCircleOutlined, SaveOutlined, RollbackOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddQueue() {
  const pageId = 11;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  const [loading, setLoading] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [user_Id, setUserId] = useState(false);

  // =============== Get Reserve ID ===============//
  const [reservationData, setReservationData] = useState({
    description: '',
    company_id: '',
    car_id: '',
    driver_id: '',
    status: 'waiting',
    total_quantity: '',
    pickup_date: '',
    product_company_id: '',
    product_brand_id: '',
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
    reserve_station_id: '',
    brand: '',
    color: '',
    license_no: '',
    mobile_no: '',
    r_description: '',
    company: '',
    driver: ''
  });

  const { id } = useParams();

  // =============== Get Company ===============//
  const [companyList, setCompanyList] = useState([]);
  const getCompanyList = () => {
    const urlapi = apiUrl + `/allcompany/`;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setCompanyList(res.data);
          getCarLsit();
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Car ===============//
  const [carList, setCarList] = useState([]);
  const getCarLsit = () => {
    const urlapi = apiUrl + `/allcars/`;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setCarList(res.data);
          getDriverLsit();
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Driver ===============//
  const [driverList, setDriverList] = useState([]);
  const getDriverLsit = () => {
    const urlapi = apiUrl + `/alldrivers/`;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          setDriverList(res.data);
          getOrders();
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

  // =============== Get order ===============//
  const [orderList, setOrderList] = useState([]);
  const getOrders = async () => {
    const urlapi = apiUrl + `/orders/` + id;
    await axios
      .get(urlapi)
      .then((res) => {
        setOrderList(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  // =============== Get TeamLoanding ===============//
  // const [team_id, setTeamId] = useState([]);
  const [teamloadingList, setTeamLoadingList] = useState([]);
  const getTeamloading = (teamId) => {
    try {
      adminRequest.getAllLoadingTeamByStation().then((result) => {
        setTeamLoadingList(result.filter((x) => x.station_status == 'waiting' || x.station_status == null || x.team_id === teamId));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [teamLoading, setTeamLoading] = useState([]);
  const getTeamManagers = async (id) => {
    try {
      const teamManager = await adminRequest.getTeamManager(id);
      const teamChecker = await adminRequest.getTeamChecker(id);
      const teamForklift = await adminRequest.getTeamForklift(id);
      const combinedData = [...teamManager, ...teamChecker, ...teamForklift];
      setTeamLoading(combinedData);
    } catch (error) {
      console.log(error);
    }
  };

  const [teamData, setTeamData] = useState([]);
  const getTeamloadingByIds = (id) => {
    setLoading(true);
    try {
      adminRequest.getLoadingTeamById(id).then((result) => {
        setTeamData(result);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleChangeTeam = (e) => {
    // const filterTeam = teamloadingList.filter((x) => x.team_id == e);
    getTeamloadingByIds(e);
    getTeamManagers(e);
  };

  // =============== Get Contractor ===============//
  const [contractorList, setContractorList] = useState([]);
  const getAllContractor = () => {
    try {
      adminRequest.getAllContractors().then((result) => {
        setContractorList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeContractor = (e) => {
    getLaborLine(e.target.value);
  };

  // =============== Get Contractor and laybor Line ===============//
  const [layborLineList, setLayborLineList] = useState([]);
  const getLaborLine = (id) => {
    try {
      if (id) {
        adminRequest.getContractorById(id).then((result) => {
          setLayborLineList(result.labor_lines);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =============== useEffect ===============//
  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
      getReserve();
      getProductCompany();
      getAllContractor();
    }
    // if (user_Id) {
    //   getBrandList();
    // }

    // if ((userRole && userRole === 9) || userRole === 1) {
    //   getAllContractor();
    // }
  }, [user_Id, userRole, userPermission]);

  const getReserve = () => {
    setLoading(true);
    const urlapi = apiUrl + `/reserve/` + id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.reserve.map((result) => {
            setUserId(result.user_id);
            setReservationData(result);
            getCompanyList();
            getProductBrand(result.product_company_id);

            getTeamloading(result.team_id);
            getTeamManagers(result.team_id);
            getLaborLine(result.contractor_id);
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // =============== InitialValue ===============//
  let initialValue = {
    company_id: reservationData.company_id,
    car_id: reservationData.car_id,
    brand_group_id: reservationData.brand_group_id,
    product_company_id: reservationData.product_company_id || '',
    product_brand_id: reservationData.product_brand_id || '',
    driver_id: reservationData.driver_id,
    description: reservationData.reserve_description,
    pickup_date: moment(reservationData.pickup_date).format('YYYY-MM-DD'),
    status: reservationData.status,
    total_quantity: reservationData.total_quantity,

    reserve_station_id: reservationData.reserve_station_id !== 1 ? reservationData.reserve_station_id : '',
    warehouse_id: reservationData.warehouse_id && reservationData.team_id ? reservationData.warehouse_id : '',
    contractor_id: reservationData.contractor_id ? reservationData.contractor_id : '',
    team_id: reservationData.team_id ? reservationData.team_id : '',
    labor_line_id: reservationData.labor_line_id ? reservationData.labor_line_id : ''
  };

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required('กรุณาเลือกบริษัท/ร้านค้า'),
    // brand_group_id: Yup.string().required('กรุณาเลือกกลุ่มสินค้า'),
    reserve_station_id: Yup.string().required('กรุณาเลือกหัวจ่าย'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า'),
    product_company_id: Yup.string().required('กรุณาระบุบริษัท(สินค้า)'),
    product_brand_id: Yup.string().required('กรุณาระบุแบรนด์(สินค้า)'),
    warehouse_id: Yup.string().required('กรุณาเลือกโกดังสินค้า'),
    contractor_id: Yup.string().required('กรุณาเลือกสายแรงงาน'),
    team_id: Yup.string().required('กรุณาเลือกทีมขึ้นสินค้า')
  });

  // =============== บันทึกข้อมูล ===============//
  const updateTeamLoading = (values) => {
    try {
      adminRequest.putReserveTeam(id, values);
    } catch (error) {
      console.log(error);
    }
  };
  const updateTeamData = (values) => {
    try {
      adminRequest.putReserveTeamData(id, values).then(() => backToReserce());
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
      values.user_id = user_Id;
      values.pickup_date = moment(values.pickup_date).format('YYYY-MM-DD HH:mm:ss');
      values.created_at = currentDate;
      values.updated_at = currentDate;
      values.team_data = teamData;

      const teamValue = {
        team_id: values.team_id,
        contractor_id: values.contractor_id,
        labor_line_id: values.labor_line_id
      };

      // if (id === 9999) {
      await reserveRequest
        .putReserById(id, values)
        .then((result) => {
          if (result.status === 'ok') {
            updateTeamLoading(teamValue);
            updateTeamData(values.team_data);
          } else {
            alert(result['message']['sqlMessage']);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // }
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();
  // =============== เพิ่มรายการสินค้า ===============//
  const addOrder = () => {
    // window.location = `/order/add/${id}`;
    navigate(`/order/add/${id}`);
  };

  // =============== กลับหน้า Reserve ===============//
  const backToReserce = () => {
    navigate('/admin/step0');
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

      {Object.keys(userPermission).length > 0 &&
        pageDetail.length === 0 &&
        pageDetail.length !== 0 &&
        (pageDetail[0].permission_name !== 'view_data' ||
          pageDetail[0].permission_name !== 'manage_everything' ||
          pageDetail[0].permission_name !== 'add_edit_delete_data') && (
          <Grid item xs={12}>
            <MainCard content={false}>
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
              </Stack>
            </MainCard>
          </Grid>
        )}
      {pageDetail.length !== 0 &&
        (pageDetail[0].permission_name === 'view_data' ||
          pageDetail[0].permission_name === 'manage_everything' ||
          pageDetail[0].permission_name === 'add_edit_delete_data') && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={10}>
              <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits} enableReinitialize={true}>
                {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, touched, errors, setFieldValue }) => (
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
                            <FormControl fullWidth>
                              <Select
                                labelId="select-label"
                                id="select"
                                name="company_id"
                                value={values.company_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="เลือกบริษัท/ร้านค้า"
                              >
                                {companyList.map((companias) => (
                                  <MenuItem key={companias.company_id} value={companias.company_id}>
                                    {companias.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {touched.company_id && errors.company_id && (
                              <FormHelperText error id="helper-text-company-car">
                                {errors.company_id}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>

                        {/* <Grid item xs={12} md={6}>
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
                    </Grid> */}

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel>บริษัท (สินค้า)</InputLabel>
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
                            <InputLabel>เบรนสินค้า</InputLabel>
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
                                  เลือกเบรนสินค้า
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
                                  ทะเบียน : {cars.registration_no}
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

                        {/* <Grid item xs={12} md={6}>
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
                    </Grid> */}

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
                            <Grid item xs={6} sx={{ p: 2 }}>
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
                                  <TableContainer>
                                    <Table
                                      aria-labelledby="tableTitle"
                                      size="small"
                                      sx={{
                                        '& .MuiTableCell-root:first-of-type': {
                                          pl: 2
                                        },
                                        '& .MuiTableCell-root:last-of-type': {
                                          pr: 3
                                        }
                                      }}
                                    >
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
                                  </TableContainer>
                                </Grid>
                                <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                              </Grid>
                            ))}
                            <Stack direction="row" alignItems="center" spacing={0}>
                              <Button
                                size="mediam"
                                variant="outlined"
                                color="success"
                                onClick={() => addOrder()}
                                startIcon={<PlusCircleOutlined />}
                              >
                                เพิ่มข้อมูลสินค้า
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>

                        {/* ======= Operation ======= */}

                        {pageDetail.length !== 0 &&
                          (pageDetail[0].permission_name === 'view_data' ||
                            pageDetail[0].permission_name === 'manage_everything' ||
                            pageDetail[0].permission_name === 'add_edit_delete_data') && (
                            <Grid item xs={12}>
                              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5">ข้อมูลทีมจ่ายสินค้า</Typography>
                              </Grid>

                              <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>ทีมจ่ายสินค้า</InputLabel>
                                    <FormControl>
                                      <Select
                                        displayEmpty
                                        id="team_id"
                                        name="team_id"
                                        value={values.team_id || ''}
                                        onChange={(e) => {
                                          const filterTeam = teamloadingList.filter((x) => x.team_id == e.target.value);
                                          setFieldValue('team_id', e.target.value);
                                          setFieldValue('warehouse_id', filterTeam[0].warehouse_id);
                                          setFieldValue('reserve_station_id', filterTeam[0].station_id);
                                          handleChangeTeam(e.target.value);
                                        }}
                                        input={<OutlinedInput />}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        error={Boolean(touched.team_id && errors.team_id)}
                                      >
                                        <MenuItem disabled value="">
                                          เลือกทีมรับสินค้า
                                        </MenuItem>
                                        {teamloadingList.length > 0 &&
                                          teamloadingList.map((teamload) => (
                                            <MenuItem key={teamload.team_id} value={teamload.team_id}>
                                              {teamload.team_name} (โกดัง: {teamload.warehouse_name}) {teamload.station_description} (
                                              {teamload.manager_name})
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    </FormControl>
                                    {touched.team_id && errors.team_id && (
                                      <FormHelperText error id="helper-text-company-car">
                                        {errors.team_id}
                                      </FormHelperText>
                                    )}
                                  </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>สายแรงงาน</InputLabel>
                                    <FormControl>
                                      <Select
                                        displayEmpty
                                        variant="outlined"
                                        name="contractor_id"
                                        value={values.contractor_id || ''}
                                        onChange={(e) => {
                                          setFieldValue('contractor_id', e.target.value);
                                          handleChangeContractor(e);
                                        }}
                                        placeholder="สายแรงงาน"
                                        fullWidth
                                        error={Boolean(touched.contractor_id && errors.contractor_id)}
                                      >
                                        <MenuItem disabled value="">
                                          เลือกสายแรงงาน
                                        </MenuItem>
                                        {contractorList.map((contractorList) => (
                                          <MenuItem key={contractorList.contractor_id} value={contractorList.contractor_id}>
                                            {contractorList.contractor_name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                    {touched.contractor_id && errors.contractor_id && (
                                      <FormHelperText error id="helper-text-contractor_id">
                                        {errors.contractor_id}
                                      </FormHelperText>
                                    )}
                                  </Stack>
                                </Grid>

                                <Grid item xs={12} md={6} sx={{ display: 'none' }}>
                                  <Stack spacing={1}>
                                    <InputLabel>หมายเลขสาย</InputLabel>
                                    <FormControl>
                                      <Select
                                        displayEmpty
                                        variant="outlined"
                                        name="labor_line_id"
                                        value={values.labor_line_id || ''}
                                        onChange={handleChange}
                                        fullWidth
                                      >
                                        <MenuItem disabled value="">
                                          เลือกหมายเลขสาย
                                        </MenuItem>
                                        {layborLineList.map((layborLine) => (
                                          <MenuItem key={layborLine.labor_line_id} value={layborLine.labor_line_id}>
                                            {layborLine.labor_line_name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Stack>
                                </Grid>
                              </Grid>
                              <Grid item xs={6}>
                                <TableContainer sx={{ m: 'auto' }}>
                                  <Table
                                    aria-labelledby="tableTitle"
                                    size="small"
                                    sx={{
                                      '& .MuiTableCell-root:first-of-type': {
                                        pl: 2
                                      },
                                      '& .MuiTableCell-root:last-of-type': {
                                        pr: 3
                                      }
                                    }}
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell align="center">ลำดับ</TableCell>
                                        <TableCell align="left">รายชื่อ</TableCell>
                                        <TableCell align="left">ตำแหน่ง</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    {teamLoading ? (
                                      <TableBody>
                                        {teamLoading.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell align="left">
                                              {item.manager_name && item.manager_name}
                                              {item.checker_name && item.checker_name}
                                              {item.forklift_name && item.forklift_name}
                                            </TableCell>
                                            <TableCell align="left">
                                              {item.manager_name && 'หัวหน้าโกดัง'}
                                              {item.checker_name && 'พนักงานจ่ายสินค้า'}
                                              {item.forklift_name && 'โฟล์คลิฟท์'}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={13} align="center">
                                          ไม่พบข้อมูล
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </Table>
                                </TableContainer>
                              </Grid>
                            </Grid>
                          )}
                      </Grid>

                      <Grid item xs={12} sx={{ '& button': { m: 1 }, pl: '8px' }}>
                        <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />

                        <Button
                          disableElevation
                          disabled={
                            isSubmitting ||
                            (pageDetail[0].permission_name !== 'manage_everything' &&
                              pageDetail[0].permission_name !== 'add_edit_delete_data')
                          }
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
                            backToReserce();
                          }}
                          startIcon={<RollbackOutlined />}
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
        )}
    </Grid>
  );
}

export default AddQueue;
