import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox
  // DialogTitle,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import MainCard from 'components/MainCard';
import { SaveOutlined, RollbackOutlined, EditOutlined } from '@ant-design/icons';

import axios from '../../../../../node_modules/axios/index';
const apiUrl = process.env.REACT_APP_API_URL;
import * as reserveRequest from '_api/reserveRequest';
import * as adminRequest from '_api/adminRequest';

// DateTime
import moment from 'moment';

import * as functionAddLogs from 'components/Function/AddLog';
function AddTeamLoading({ id, handleReload, token, permission }) {
  const userId = localStorage.getItem('user_id');
  const [user_Id, setUserId] = useState(false);
  const [reservationData, setReservationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {}, [permission]);
  const getReserve = async (reserveId) => {
    setLoading(true);
    const urlapi = apiUrl + `/reserve/` + reserveId;
    await axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.reserve.map((result) => {
            setUserId(result.user_id);
            setReservationData(result);
            getTeamloading(result.team_id);
            getTeamManagers(result.team_id);
            getLaborLine(result.contractor_id);
            getAllContractor(result.contractor_id);

            if (result.contractor_id_to_other !== null) {
              setCheckPreSling(true);
            }
          });
          setLoading(false);
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
    labor_line_id: reservationData.labor_line_id ? reservationData.labor_line_id : 0,
    contractor_id_to_other: reservationData.contractor_id_to_other ? reservationData.contractor_id_to_other : null,
    contractor_other_id: reservationData.contractor_other_id ? reservationData.contractor_other_id : null,
    checkPreSling: reservationData.contractor_other_id !== null ? true : false
  };

  // =============== Validate Forms ===============//
  const validations = Yup.object().shape({
    contractor_id: Yup.string().required('กรุณาเลือกสายแรงงาน'),
    team_id: Yup.string().required('กรุณาเลือกทีมขึ้นสินค้า'),
    contractor_id_to_other: Yup.lazy((value, context) => {
      console.log('checkPreSling:', context.parent.checkPreSling); // ตรวจสอบค่าของ checkPreSling
      return context.parent.checkPreSling
        ? Yup.number()
            .required('กรุณาเลือกทีมขึ้นสินค้า Pre-sling')
            .typeError('กรุณาเลือกทีมขึ้นสินค้า Pre-sling')
            .nullable()
            .test('is-not-null', 'กรุณาเลือกทีมขึ้นสินค้า Pre-sling', (value) => value !== null)
        : Yup.mixed().notRequired(); // ไม่ทำการ Validate เมื่อ checkPreSling เป็น false
    })
    // contractor_id_to_other: Yup.number()
    //   .nullable() // กำหนดให้สามารถเป็น null ได้
    //   .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
    //   .when('checkPreSling', {
    //     is: true, // เมื่อ checkPreSling เป็น true
    //     then: Yup.number()
    //       .required('กรุณาเลือกทีมขึ้นสินค้า Pre-sling')
    //       .typeError('กรุณาเลือกทีมขึ้นสินค้า Pre-sling') // แสดงข้อความเมื่อค่าไม่ใช่ number
    //       .test('is-not-null', 'กรุณาเลือกทีมขึ้นสินค้า Pre-sling', (value) => value !== null), // ตรวจสอบว่าค่าไม่เป็น null
    //     otherwise: Yup.number().nullable().typeError('กรุณาเลือกทีมขึ้นสินค้า Pre-sling') // ถ้าไม่ใช่ true ก็ให้เป็น nullable
    //   })
  });

  // =============== Get TeamLoanding ===============//
  // const [team_id, setTeamId] = useState([]);
  const [teamloadingList, setTeamLoadingList] = useState([]);
  const getTeamloading = (teamId) => {
    try {
      adminRequest.getAllLoadingTeamByStation().then((result) => {
        const sortedData = sortTeams(
          result.filter((x) => x.station_status == 'waiting' || x.station_status == null || x.team_id === teamId)
        );
        // console.log('sortedData :', sortedData)
        setTeamLoadingList(sortedData);

        // setTeamLoadingList(result.filter((x) => x.station_status == 'waiting' || x.station_status == null || x.team_id === teamId));
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
    getTeamloadingByIds(e);
    getTeamManagers(e);
  };

  // =============== Get Contractor ===============//
  const [contractorList, setContractorList] = useState([]);
  const getAllContractor = async (contractId) => {
    try {
      await adminRequest.getAllContractors().then((result) => {
        const sortedData = sortContractors(
          result.filter(
            (x) => x.status === 'A' && (x.contract_status === 'waiting' || x.contract_status === null || x.contractor_id === contractId)
          )
        );
        setContractorList(sortedData);
        // console.log('getAllContractor :', result);
        // console.log('getAllContractor filter:', result.filter((x) => x.status === 'A' && (x.contract_status == 'waiting' || x.contract_status == null || x.contractor_id === contractId)));
        // setContractorList(result.filter((x) => x.status === 'A' && (x.contract_status == 'waiting' || x.contract_status == null || x.contractor_id === contractId)));
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

  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    console.log('values :', values);
    console.log('initialValue :', initialValue);
    try {
      // if (values === 9999) {
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

      const contracOtherValue = {
        reserve_id: id,
        contractor_id: values.contractor_id_to_other,
        contract_other_status: 'waiting',
        contract_other_update: currentDate
      };

      // ตรวจสอบการแก้ไขข้อมูล Contractor Other
      if (values.contractor_other_id && checkPreSling === false) {
        await deleteContractorOthers(values.contractor_other_id);
        const data = {
          audit_user_id: userId,
          audit_action: 'I',
          audit_system_id: id,
          audit_system: 'step0',
          audit_screen: 'ข้อมูลสายแรงงาน Pre-Sling : เพิ่มข้อมูลทีมขึ้นสินค้า',
          audit_description: JSON.stringify(teamValue)
        };

        AddAuditLogs(data);
      } else if (values.contractor_other_id && checkPreSling === true) {
        await updateContractorOthers(values.contractor_other_id, contracOtherValue);
        const data = {
          audit_user_id: userId,
          audit_action: 'I',
          audit_system_id: id,
          audit_system: 'step0',
          audit_screen: 'ข้อมูลสายแรงงาน Pre-Sling : แก้ไขข้อมูล',
          audit_description: JSON.stringify(teamValue)
        };
        AddAuditLogs(data);
      } else if (!values.contractor_other_id && checkPreSling === true) {
        await addContractorOthers(contracOtherValue);
        const data = {
          audit_user_id: userId,
          audit_action: 'I',
          audit_system_id: id,
          audit_system: 'step0',
          audit_screen: 'ข้อมูลสายแรงงาน Pre-Sling : เพิ่มข้อมูล',
          audit_description: JSON.stringify(teamValue)
        };
        AddAuditLogs(data);
      }

      // if (values.contractor_id === 9999) {
      await reserveRequest
        .putReserById(id, values)
        .then((result) => {
          if (result.status === 'ok') {
            console.log(result.status);
            updateTeamLoading(teamValue);
            // if (values.contractor_id === 9999) {
            const data = {
              audit_user_id: userId,
              audit_action: 'I',
              audit_system_id: id,
              audit_system: 'step0',
              audit_screen: 'ข้อมูลทีมขึ้นสินค้า : เพิ่มข้อมูลทีมขึ้นสินค้า',
              audit_description: JSON.stringify(teamValue)
            };
            AddAuditLogs(data);
            setCheckPreSling(false);
            updateTeamData(values.team_data);
            // }
          } else {
            enqueueSnackbar('บันทึกข้อมูลทีมขึ้นสินค้าไม่สำเร็จ!' + result['message']['sqlMessage'], { variant: 'warning' });
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

  // =============== บันทึกข้อมูล ===============//
  const updateTeamLoading = (values) => {
    try {
      adminRequest.putReserveTeam(id, values).then((response) => console.log('updateTeamLoading :', response));
    } catch (error) {
      console.log(error);
    }
  };
  const updateTeamData = (values) => {
    try {
      adminRequest.putReserveTeamData(id, values).then(() => {
        setReservationData({});
        setTeamLoading([]);
        setOpen(false);
        enqueueSnackbar('บันทึกข้อมูลทีมขึ้นสินค้าสำเร็จ!', { variant: 'success' });
        handleReload(true);
        // console.log('updateTeamData :', response)
      });
    } catch (error) {
      enqueueSnackbar('บันทึกข้อมูลทีมขึ้นสินค้าไม่สำเร็จ!' + result['message']['sqlMessage'], { variant: 'warning' });
      console.log(error);
    }
  };

  // =============== บันทึกข้อมูล สายแรงงานใหม่ ===============//
  const [contractorOtherList, setContractorOtherList] = useState([]);
  const getContractorOthers = async () => {
    try {
      await adminRequest.getContractorOtherAll().then((response) => {
        setContractorOtherList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addContractorOthers = async (values) => {
    try {
      await adminRequest.AddContractorOther(values);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContractorOthers = async (id) => {
    try {
      await adminRequest.deleteContractorOtherByID(id);
    } catch (error) {
      console.log(error);
    }
  };

  const updateContractorOthers = async (id, value) => {
    try {
      await adminRequest.putContractorOther(id, value);
    } catch (error) {
      console.log(error);
    }
  };

  function sortTeams(data) {
    const today = getCurrentDateInThailand(); // Get today's date in YYYY-MM-DD format

    // Function to check if the date string is today's date
    const isToday = (dateStr) => dateStr && dateStr.startsWith(today);

    // Separate teams with today's update and others
    const todayTeams = data.filter((team) => isToday(team.time_update));
    const otherTeams = data.filter((team) => !isToday(team.time_update));

    // Sort teams by team_id
    otherTeams.sort((a, b) => a.team_id - b.team_id);

    // Sort today's teams by time_update, then by team_id
    todayTeams.sort((a, b) => {
      if (a.time_update < b.time_update) return -1;
      if (a.time_update > b.time_update) return 1;
      return a.team_id - b.team_id;
    });

    // Combine the lists
    return [...todayTeams, ...otherTeams];
  }

  // สร้างฟังก์ชันเพื่อดึงวันที่ปัจจุบันใน Time Zone ของประเทศไทย
  const dateNow = getCurrentDateInThailand();
  function getCurrentDateInThailand() {
    const thailandTimezone = 'Asia/Bangkok';
    const options = { timeZone: thailandTimezone, year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Intl.DateTimeFormat('en-CA', options).format(new Date());

    // แยกวันที่เดือนปี
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
  }
  // function getCurrentDateInThailand() {
  //     const thailandTimezone = 'Asia/Bangkok';
  //     const date = new Date().toLocaleDateString('th-TH', {
  //         timeZone: thailandTimezone,
  //         year: 'numeric',
  //         month: '2-digit',
  //         day: '2-digit'
  //     });

  //     // แยกวันที่เดือนปี
  //     const [day, month, year] = date.split('/');
  //     return `${year}-${month}-${day}`;
  // }

  function sortContractors(data) {
    const today = getCurrentDateInThailand(); // Get today's date in YYYY-MM-DD format

    // Function to check if the date string is today's date
    const isToday = (dateStr) => dateStr && dateStr.startsWith(today);

    // Separate contractor with today's update and others
    const todayTeams = data.filter((team) => isToday(team.contract_update));
    const otherTeams = data.filter((team) => !isToday(team.contract_update));

    // Sort contractor by contractor_id
    otherTeams.sort((a, b) => a.contractor_id - b.contractor_id);

    // Sort today's contractor by contract_update, then by contractor_id
    todayTeams.sort((a, b) => {
      if (a.contract_update < b.contract_update) return -1;
      if (a.contract_update > b.contract_update) return 1;
      return a.contractor_id - b.contractor_id;
    });

    // Combine the lists: otherTeams first, then todayTeams
    return [...otherTeams, ...todayTeams];
  }

  const handleClickOpen = (reserveId) => {
    setOpen(true);
    setLoading(true);
    if (reserveId) {
      getReserve(reserveId);
      getContractorOthers();
    }
  };

  const [checkPreSling, setCheckPreSling] = useState(false);
  const handleClickCheckbox = (checked) => {
    setCheckPreSling(!checked);
  };

  const handleClose = async (flag) => {
    if (flag === 0) {
      setCheckPreSling(false);
      setReservationData({});
      setTeamLoading([]);
      setOpen(false);
    }
  };
  const AddAuditLogs = async (data) => {
    await functionAddLogs.AddAuditLog(data);
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          <Typography variant="h5" align="center">
            จัดการทีมขึ้นสินค้าคิว : {token}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ minWidth: { xs: 'auto', md: '40vw' } }}>
          <DialogContentText style={{ fontFamily: 'kanit' }}>
            {loading && (
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
                open={loading}
              >
                <CircularProgress color="primary" />
              </Backdrop>
            )}
            <MainCard content={false} sx={{ p: 2 }}>
              <Formik initialValues={initialValue} validationSchema={validations} onSubmit={handleSubmits} enableReinitialize={true}>
                {({ errors, handleSubmit, isSubmitting, touched, values, setFieldValue, handleChange }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid item xs={12}>
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5">ข้อมูลทีมจ่ายสินค้า</Typography>
                      </Grid>

                      <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={12}>
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
                        <Grid item xs={12} md={12}>
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
                                    {contractorList.contract_update &&
                                      contractorList.contract_update.slice(0, 10) === dateNow &&
                                      ' (' + contractorList.contract_update.slice(11, 16) + ' น.)'}{' '}
                                    {contractorOtherList.filter(
                                      (x) => x.contractor_id === contractorList.contractor_id && x.contract_other_status !== 'completed'
                                    )?.length > 0 && <span style={{ color: 'green' }}> (กำลัง Pre-sling)</span>}
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

                        <Grid item xs={12} md={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkPreSling}
                                onChange={() => {
                                  if (checkPreSling === true) {
                                    setFieldValue('contractor_id_to_other', null);
                                  }
                                  setFieldValue('checkPreSling', !checkPreSling);
                                  handleClickCheckbox(checkPreSling);
                                }}
                                name="checked1"
                              />
                            }
                            label="Pre-Sling"
                          />

                          {checkPreSling && (
                            <Stack spacing={1}>
                              <FormControl>
                                <Select
                                  displayEmpty
                                  variant="outlined"
                                  name="contractor_id_to_other"
                                  value={values.contractor_id_to_other || ''}
                                  onChange={(e) => {
                                    setFieldValue('contractor_id_to_other', e.target.value);
                                    handleChangeContractor(e);
                                  }}
                                  placeholder="สายแรงงาน Pre-Sling"
                                  fullWidth
                                  error={Boolean(touched.contractor_id_to_other && errors.contractor_id_to_other)}
                                >
                                  <MenuItem disabled value="">
                                    เลือกสายแรงงาน
                                  </MenuItem>
                                  {contractorList.map((contractorList) => (
                                    <MenuItem key={contractorList.contractor_id} value={contractorList.contractor_id}>
                                      {contractorList.contractor_name}
                                      {contractorList.contract_update &&
                                        contractorList.contract_update.slice(0, 10) === dateNow &&
                                        ' (' + contractorList.contract_update.slice(11, 16) + ' น.)'}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              {touched.contractor_id_to_other && errors.contractor_id_to_other && (
                                <FormHelperText error id="helper-text-contractor_id_to_other">
                                  {errors.contractor_id_to_other}
                                </FormHelperText>
                              )}
                            </Stack>
                          )}
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

                      <Grid item xs={12} align="center" sx={{ '& button': { m: 1 }, mt: 2 }}>
                        <Button
                          size="mediam"
                          variant="contained"
                          color="error"
                          disabled={isSubmitting}
                          onClick={() => {
                            handleClose(0);
                          }}
                          startIcon={<RollbackOutlined />}
                        >
                          ยกเลิก
                        </Button>
                        <Button
                          disableElevation
                          disabled={isSubmitting}
                          size="mediam"
                          type="submit"
                          variant="contained"
                          color="success"
                          startIcon={<SaveOutlined />}
                        >
                          บันทึกข้อมูล
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </MainCard>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Tooltip title="เพิ่มทีมชึ้นสินค้า">
        <Button
          variant="contained"
          size="medium"
          color="primary"
          sx={{ minWidth: '33px!important', p: '6px 0px' }}
          disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
          onClick={() => handleClickOpen(id)}
        >
          <EditOutlined />
        </Button>
      </Tooltip>
    </>
  );
}

export default AddTeamLoading;
