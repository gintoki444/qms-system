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
import * as companyRequest from '_api/companyRequest';

// DateTime
import moment from 'moment';
import { useSnackbar } from 'notistack';

function AddCompany({ userID, onSaves, companyList }) {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => { }, [userID]);

    const initialValue = {
        name: '',
        country: 'ไทย',
        open_time: '08.00-18.00',
        description: '',
        tax_no: '',
        phone: '',
        address: '',
        zipcode: '',
        contact_person: '',
        contact_number: ''
    };

    const valiDationSchema = Yup.object().shape({
        name: Yup.string().max(255).required('กรุณาระบุชื่อ บริษัท/ร้านค้า')
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

        const checkCompany = companyList.filter(
            (x) => x.name == values.name
        );

        if (checkCompany && checkCompany.length <= 0) {
            try {
                values.user_id = userID;
                values.created_at = currentDate;
                values.updated_at = currentDate;
                values.location_lat = '0000';
                values.location_lng = '0000'
                setLoading(true);
                setOpenDriver(false);

                // // test add
                // onSaves(values);

                // if (values == 999) {
                companyRequest.AddCompany(values).then((response) => {
                    if (response.status === 'ok') {
                        companyRequest.getAllCompanyByuserId(userID).then((response) => {
                            const result = response.filter(
                                (x) => x.name == values.name
                            );

                            enqueueSnackbar('เพิ่มข้อมูลร้านค้า/บริษัทสำเร็จ!', { variant: 'success' });
                            onSaves(result);
                            setLoading(false);
                        });
                    } else {
                        enqueueSnackbar('เพิ่มข้อมูลร้านค้า/บริษัทไม่สำเร็จ! :' + response.message.sqlMessage, { variant: 'error' });
                    }
                });
                // }
            } catch (err) {
                console.error(err);
            }
        } else {
            enqueueSnackbar('มีข้อมูลร้านค้า/บริษัท : ' + values.name, { variant: 'error' });
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
                เพิ่มร้านค้า/บริษัท
            </Button>
            <Dialog open={openDriver} onClose={handleCloseDriver} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title" align="center">
                    <Typography variant="h5">เพิ่มข้อมูลร้านค้า/บริษัท</Typography>
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
                                                    <InputLabel htmlFor="name-company">ชื่อบริษัท*</InputLabel>
                                                    <OutlinedInput
                                                        id="name-company"
                                                        type="name"
                                                        value={values.name}
                                                        name="name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="ชื่อบริษัท"
                                                        fullWidth
                                                        error={Boolean(touched.name && errors.name)}
                                                    />
                                                    {touched.name && errors.name && (
                                                        <FormHelperText error id="helper-text-name-company">
                                                            {errors.name}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="tax_no-company">เลขที่ผู้เสียภาษี *</InputLabel>
                                                    <OutlinedInput
                                                        id="tax_no-company"
                                                        type="tax_no"
                                                        value={values.tax_no}
                                                        name="tax_no"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="เลขที่ผู้เสียภาษี"
                                                        fullWidth
                                                        error={Boolean(touched.tax_no && errors.tax_no)}
                                                    />
                                                    {touched.tax_no && errors.tax_no && (
                                                        <FormHelperText error id="helper-text-tax_no-company">
                                                            {errors.tax_no}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="phone-company">เบอร์โทรศัพท์*</InputLabel>
                                                    <OutlinedInput
                                                        id="phone-company"
                                                        type="phone"
                                                        value={values.phone}
                                                        format="##-####-####"
                                                        name="phone"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="เบอร์โทรศัพท์"
                                                        fullWidth
                                                        error={Boolean(touched.phone && errors.phone)}
                                                    />
                                                    {touched.phone && errors.phone && (
                                                        <FormHelperText error id="helper-text-phone-company">
                                                            {errors.phone}
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
                                                    เพิ่มข้อมูลร้านค้า/บริษัท
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

export default AddCompany