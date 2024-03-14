import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../../node_modules/axios/index';
// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as reseveRequest from '_api/reserveRequest';
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
  CircularProgress
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
  const userRoles = useSelector((state) => state.auth.roles);
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
    const urlapi = apiUrl + `/allcompany/` + user_Id;
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
    const urlapi = apiUrl + `/allcars/` + user_Id;
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
    const urlapi = apiUrl + `/alldrivers/` + user_Id;
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
  // const [selectWarehouse, setSelectWareHouse] = useState('');
  const [warehousesList, setWarehousesList] = useState([]);
  const getWarehouses = () => {
    adminRequest
      .getAllWareHouse()
      .then((result) => {
        setWarehousesList(result);
      })
      .catch((error) => console.log('error', error));
  };

  const handleChangeWarehouse = (e) => {
    setTeamLoading([]);
    setTeamLoadingList([]);
    getStation(e.target.value);
    getTeamloading(e.target.value);
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

  // =============== Get Stations ===============//
  const [stationsList, setStationsList] = useState([]);
  const getStation = (id) => {
    try {
      adminRequest.getStationsByWareHouse(id).then((response) => {
        setStationsList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get TeamLoanding ===============//
  // const [team_id, setTeamId] = useState([]);
  const [teamloadingList, setTeamLoadingList] = useState([]);
  const getTeamloading = (id) => {
    try {
      adminRequest.getLoadingTeamByIdwh(id).then((result) => {
        setTeamLoadingList(result);
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
    try {
      adminRequest.getLoadingTeamById(id).then((result) => {
        setTeamData(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTeam = (e) => {
    setTeamLoading([]);
    getTeamManagers(e);
    getTeamloadingByIds(e);
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
      adminRequest.getContractorById(id).then((result) => {
        setLayborLineList(result.labor_lines);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== useEffect ===============//
  useEffect(() => {
    getReserve();
    if (user_Id) {
      getBrandList();
    }

    if ((userRoles && userRoles === 9) || userRoles === 1) {
      getWarehouses();
      getAllContractor();
    }
  }, [user_Id]);

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

            if (userRoles === 9 || userRoles === 1) {
              getStation(result.warehouse_id);
              getTeamloading(result.warehouse_id);
              getTeamManagers(result.team_id);
              getLaborLine(result.contractor_id);
            }
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
    driver_id: reservationData.driver_id,
    description: reservationData.reserve_description,
    pickup_date: moment(reservationData.pickup_date).format('YYYY-MM-DD'),
    status: reservationData.status,
    total_quantity: reservationData.total_quantity,
    reserve_station_id: reservationData.reserve_station_id,
    warehouse_id: reservationData.warehouse_id,
    contractor_id: reservationData.contractor_id,
    team_id: reservationData.team_id,
    labor_line_id: reservationData.labor_line_id
  };

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required('กรุณาเลือกบริษัท/ร้านค้า'),
    brand_group_id: Yup.string().required('กรุณาเลือกกลุ่มสินค้า'),
    reserve_station_id: Yup.string().required('กรุณาเลือกหัวจ่าย'),
    pickup_date: Yup.string().required('กรุณาเลือกวันที่เข้ารับสินค้า'),
    description: Yup.string().required('กรุณากรอกiรายละเอียดการจอง')
  });

  // =============== บันทึกข้อมูล ===============//
  const updateTeamLoading = (values) => {
    adminRequest.putReserveTeam(id, values).then(() => {});
  };
  const updateTeamData = (values) => {
    adminRequest.putReserveTeamData(id, values).then(() => {
      window.location.href = '/admin/step0';
    });
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

      await reseveRequest
        .putReserById(id, values)
        .then((result) => {
          console.log('result ', result);
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
    } catch (err) {
      console.error(err);
    }
  };

  // =============== เพิ่มรายการสินค้า ===============//
  const addOrder = () => {
    // window.location = `/order/add/${id}`;
    navigate(`/order/add/${id}`);
  };

  // =============== กลับหน้า Reserve ===============//
  const navigate = useNavigate();
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
                    {(userRoles == 9 || userRoles == 1) && (
                      <Grid item xs={12}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h5">ข้อมูลการเข้ารับสินค้า</Typography>
                        </Grid>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel>โกดังสินค้า</InputLabel>
                              <TextField
                                select
                                variant="outlined"
                                name="warehouse_id"
                                value={values.warehouse_id}
                                onChange={(e) => {
                                  setFieldValue('warehouse_id', e.target.value);
                                  handleChangeWarehouse(e);
                                }}
                                placeholder="เลือกโกดังสินค้า"
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
                              <InputLabel>หัวจ่าย</InputLabel>
                              <TextField
                                select
                                variant="outlined"
                                name="reserve_station_id"
                                value={values.reserve_station_id}
                                onChange={handleChange}
                                placeholder="เลือกคลังสินค้า"
                                fullWidth
                              >
                                {stationsList.map((station) => (
                                  <MenuItem key={station.station_id} value={station.station_id}>
                                    {station.station_description}
                                  </MenuItem>
                                ))}
                              </TextField>
                              {touched.reserve_station_id && errors.reserve_station_id && (
                                <FormHelperText error id="helper-text-reserve_station_id">
                                  {errors.reserve_station_id}
                                </FormHelperText>
                              )}
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel>ทีมรับสินค้า</InputLabel>
                              <FormControl>
                                <Select
                                  id="team_id"
                                  name="team_id"
                                  displayEmpty
                                  value={values.team_id}
                                  onChange={(e) => {
                                    setFieldValue('team_id', e.target.value);
                                    handleChangeTeam(e.target.value);
                                  }}
                                  input={<OutlinedInput />}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                >
                                  <MenuItem disabled value="">
                                    ทีมรับสินค้า
                                  </MenuItem>
                                  {teamloadingList.map((teamload) => (
                                    <MenuItem key={teamload.team_id} value={teamload.team_id}>
                                      {teamload.team_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel>สายแรงงาน {values.contractor_id}</InputLabel>
                              <TextField
                                select
                                variant="outlined"
                                name="contractor_id"
                                value={values.contractor_id}
                                onChange={(e) => {
                                  setFieldValue('contractor_id', e.target.value);
                                  handleChangeContractor(e);
                                }}
                                placeholder="ทีมรับสินค้า"
                                fullWidth
                              >
                                {contractorList.map((contractorList) => (
                                  <MenuItem key={contractorList.contractor_id} value={contractorList.contractor_id}>
                                    {contractorList.contractor_name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                              <InputLabel>หมายเลขสาย</InputLabel>
                              <TextField
                                select
                                variant="outlined"
                                name="labor_line_id"
                                value={values.labor_line_id}
                                onChange={handleChange}
                                placeholder="ทีมรับสินค้า"
                                fullWidth
                              >
                                {layborLineList.map((layborLine) => (
                                  <MenuItem key={layborLine.labor_line_id} value={layborLine.labor_line_id}>
                                    {layborLine.labor_line_name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
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
                                  <TableCell align="center">ลำดับ</TableCell>
                                  <TableCell align="center">รายชื่อ</TableCell>
                                  <TableCell align="center">ตำแหน่ง</TableCell>
                                </TableRow>
                              </TableHead>
                              {teamLoading ? (
                                <TableBody>
                                  {teamLoading.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell align="center">{index + 1}</TableCell>
                                      <TableCell align="center">
                                        {item.manager_name && item.manager_name}
                                        {item.checker_name && item.checker_name}
                                        {item.forklift_name && item.forklift_name}
                                      </TableCell>
                                      <TableCell align="center">
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
                      disabled={isSubmitting}
                      size="mediam"
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveOutlined />}
                    >
                      บันทึกข้อมูลการจอง
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
    </Grid>
  );
}

export default AddQueue;
