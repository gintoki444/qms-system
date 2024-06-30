import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import {
    Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography,
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
function AddTeamLoading({ id, handleReload, token }) {
    const [user_Id, setUserId] = useState(false);
    const [reservationData, setReservationData] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

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
        labor_line_id: reservationData.labor_line_id ? reservationData.labor_line_id : ''
    };

    // =============== Validate Forms ===============//
    const validations = Yup.object().shape({
        contractor_id: Yup.string().required('กรุณาเลือกสายแรงงาน'),
        team_id: Yup.string().required('กรุณาเลือกทีมขึ้นสินค้า')
    });

    // =============== Get TeamLoanding ===============//
    // const [team_id, setTeamId] = useState([]);
    const [teamloadingList, setTeamLoadingList] = useState([]);
    const getTeamloading = (teamId) => {
        try {
            adminRequest.getAllLoadingTeamByStation().then((result) => {
                setTeamLoadingList(result.filter((x) => (x.station_status == 'waiting' || x.station_status == null || x.team_id === teamId)));
                console.log(result.filter((x) => (x.station_status == 'waiting' || x.station_status == null || x.team_id === teamId)))
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

            console.log('handleSubmits values:', values);
            console.log('handleSubmits teamValue:', teamValue);

            // if (values === 9999) {
            await reserveRequest
                .putReserById(id, values)
                .then((result) => {
                    if (result.status === 'ok') {
                        updateTeamLoading(teamValue);
                        updateTeamData(values.team_data);
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
            adminRequest.putReserveTeam(id, values);
            // .then((response) => console.log('updateTeamLoading :', response));
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
                handleReload(true)
                // console.log('updateTeamData :', response)
            });
        } catch (error) {
            enqueueSnackbar('บันทึกข้อมูลทีมขึ้นสินค้าไม่สำเร็จ!' + result['message']['sqlMessage'], { variant: 'warning' });
            console.log(error);
        }
    };

    const handleClickOpen = (reserveId) => {
        setOpen(true);
        setLoading(true)
        if (reserveId) {
            getReserve(reserveId);
            getAllContractor();
        }
    };


    const handleClose = async (flag) => {
        if (flag === 0) {
            setReservationData({});
            setTeamLoading([]);
            setOpen(false);
        }
    };
    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">
                    <Typography variant="h5" align="center">จัดการทีมขึ้นสินค้าคิว : {token}</Typography>
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
                            <Formik initialValues={initialValue}
                                validationSchema={validations}
                                onSubmit={handleSubmits} enableReinitialize={true} >
                                {({ errors, handleSubmit, isSubmitting, touched, values, setFieldValue, handleChange
                                }) => (
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

                                            <Grid item xs={12} align="center" sx={{ '& button': { m: 1 }, mt: 2 }} >
                                                <Button
                                                    size="mediam"
                                                    variant="contained"
                                                    color="error"
                                                    disabled={isSubmitting}
                                                    onClick={() => {
                                                        handleClose(0)
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
                    onClick={() => handleClickOpen(id)}
                >
                    <EditOutlined />
                </Button>
            </Tooltip>
        </>
    )
}

export default AddTeamLoading