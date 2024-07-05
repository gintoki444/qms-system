import React, { useState } from 'react'
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Button,
    Backdrop,
    CircularProgress,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    IconButton,
    InputAdornment,
    FormControl,
    Box
} from '@mui/material';
import MainCard from 'components/MainCard';
import { SaveOutlined, RollbackOutlined, EditOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import * as userRequest from '_api/userRequest';

function ResetPassword({ userData }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    // const [users, setUsers] = useState(userData);

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmits = async (values) => {
        setLoading(true);
        try {

            const setData = {
                userEmail: userData.email,
                newPassword: values.re_password
            }
            await userRequest.postResetPassword(setData).then((result) => {
                if (result.status === 'ok') {
                    enqueueSnackbar('รีเซตรหัสผ่านสำเร็จ!', { variant: 'success' });
                    backToPages();
                    setLoading(false);
                } else {
                    enqueueSnackbar('รีเซตรหัสผ่านไม่สำเร็จ!' + result['message']['sqlMessage'], { variant: 'warning' });
                }
            }).catch((error) => {
                console.log(error);
            });

        } catch (err) {
            console.error(err);
        }
    };


    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleClose = async (flag) => {
        if (flag === 0) {
            setOpen(false);
        }
    };

    const backToPages = () => {
        navigate('/admin/users/');
    };
    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">
                    <Typography variant="h5" align="center">ตั้งค่ารหัสผ่านใหม่</Typography>
                </DialogTitle>
                <DialogContent sx={{ minWidth: { xs: 'auto', md: '20vw' } }}>
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
                            <Formik initialValues={{ re_password: '' }}
                                validationSchema={Yup.object().shape({
                                    re_password: Yup.string().max(255).required('กรุณาระบุรหัสผ่าน'),
                                })}
                                onSubmit={handleSubmits} enableReinitialize={true} >
                                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                    <form noValidate onSubmit={handleSubmit}>
                                        <Grid item xs={12}>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <Typography variant="h5" sx={{ pb: 2 }}>E-mail : {userData.email}</Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={1}>
                                                    <InputLabel htmlFor="password-signup">รหัสผ่าน*</InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        error={Boolean(touched.re_password && errors.re_password)}
                                                        id="password-signup"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={values.re_password}
                                                        name="re_password"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            changePassword(e.target.value);
                                                        }}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle re_password visibility"
                                                                    onClick={handleClickShowPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    edge="end"
                                                                    size="large"
                                                                >
                                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        placeholder="******"
                                                        inputProps={{}}
                                                    />
                                                    {touched.re_password && errors.re_password && (
                                                        <FormHelperText error id="helper-text-password-signup">
                                                            {errors.re_password}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                                <FormControl fullWidth sx={{ mt: 2 }}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item>
                                                            <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                                {level?.label}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </FormControl>
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

            <Tooltip title="รีเซตรหัสผ่าน">
                <Button
                    variant="contained"
                    size="mediam"
                    color="info"
                    onClick={() => handleClickOpen(userData)}
                    startIcon={<EditOutlined />}
                >
                    รีเซตรหัสผ่าน
                </Button>
            </Tooltip>
        </>
    )
}

export default ResetPassword