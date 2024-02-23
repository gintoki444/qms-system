import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import MainCard from 'components/MainCard';

// Alert Massage
import Alert from '@mui/material/Alert';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import moment from 'moment';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

function AddUser() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [massageErrors, setMassageErrors] = useState('');
  const [popupErrors, setPopupErrors] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConformPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    setPopupErrors(false);
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
      console.log('values ', values);
      setStatus({ success: false });
      setSubmitting(false);

      const jsonData = {
        firstname: values.firstname,
        lastname: values.lastname,
        company_id: '',
        role_id: '3',
        role: 'Subscriber',
        country: '',
        email: values.email,
        avatar: '',
        password: values.password,
        remember_token: '',
        created_at: currentDate,
        updated_at: currentDate
      };

      await axios
        .post(apiUrl + '/adduser', jsonData)
        .then((res) => {
          if (res.data.status === 'ok') {
            window.location = '/admin/users/';
          } else {
            setMassageErrors('คุณได้ใช้อีเมล :' + values.email + ' สมัครสมาชิกแล้ว !');
            setPopupErrors(true);
          }
        })
        .catch((err) => {
          console.log('Error : ', err);
        });
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
          {popupErrors == true && (
            <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
              <Alert severity="error">{massageErrors}</Alert>
            </Stack>
          )}
          <Formik
            initialValues={{
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              confirm_password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              firstname: Yup.string().max(255).required('กรุณาระบุชื่อ'),
              lastname: Yup.string().max(255).required('กรุณาระบุนามสกุล'),
              email: Yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').max(255).required('กรุณาระบุอีเมล'),
              password: Yup.string().max(255).required('กรุณาระบุรหัสผ่าน'),
              confirm_password: Yup.string()
                .max(255)
                .required('กรุณาระบุยืนยันรหัสผ่าน')
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
            })}
            onSubmit={handleSubmits}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="firstname-signup">ชื่อ*</InputLabel>
                      <OutlinedInput
                        id="firstname-login"
                        type="firstname"
                        value={values.firstname}
                        name="firstname"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="ชื่อ"
                        fullWidth
                        error={Boolean(touched.firstname && errors.firstname)}
                      />
                      {touched.firstname && errors.firstname && (
                        <FormHelperText error id="helper-text-firstname-signup">
                          {errors.firstname}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="lastname-signup">นามสกุล*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.lastname && errors.lastname)}
                        id="lastname-signup"
                        type="lastname"
                        value={values.lastname}
                        name="lastname"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="นามสกุล"
                        inputProps={{}}
                      />
                      {touched.lastname && errors.lastname && (
                        <FormHelperText error id="helper-text-lastname-signup">
                          {errors.lastname}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-signup">อีเมล*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                        id="email-login"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="demo@company.com"
                        inputProps={{}}
                      />
                      {touched.email && errors.email && (
                        <FormHelperText error id="helper-text-email-signup">
                          {errors.email}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-signup">รหัสผ่าน*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password-signup"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          changePassword(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
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
                      {touched.password && errors.password && (
                        <FormHelperText error id="helper-text-password-signup">
                          {errors.password}
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

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="confirm_password-signup">ยืนยันรหัสผ่าน*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.confirm_password && errors.confirm_password)}
                        id="confirm_password-signup"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={values.confirm_password}
                        name="confirm_password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConformPassword}
                              onMouseDown={handleMouseDownConfirmPassword}
                              edge="end"
                              size="large"
                            >
                              {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="******"
                        inputProps={{}}
                      />
                      {/* {values.confirm_password && values.confirm_password != values.password && (
                  <FormHelperText error id="helper-text-confirm_password-signup">
                    รหัสผ่านไม่ตรงกัน
                  </FormHelperText>
                )} */}
                      {touched.confirm_password && errors.confirm_password && (
                        <FormHelperText error id="helper-text-confirm_password-signup">
                          {errors.confirm_password}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="primary">
                        เพิ่มข้อมูลผู้ใช้งาน
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
    </>
  );
}

export default AddUser;
