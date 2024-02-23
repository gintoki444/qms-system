import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import {
  // Box,
  Button,
  // FormControl,
  FormHelperText,
  Grid,
  // IconButton,
  // InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  MenuItem
  // Typography
} from '@mui/material';
import MainCard from 'components/MainCard';

// Alert Massage
import Alert from '@mui/material/Alert';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
// import { strengthColor, strengthIndicator } from 'utils/password-strength';
import moment from 'moment';

// assets
// import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// Link api user
import * as getUsers from '_api/userRequest';

function UpdateUser() {
  // const [level, setLevel] = useState();

  // const [massageErrors, setMassageErrors] = useState('');
  const [popupErrors, setPopupErrors] = useState(false);

  let [initialValue, setInitialValue] = useState({
    user_id: null,
    firstname: '',
    lastname: '',
    company_id: '',
    role: '',
    country: '',
    email: '',
    avatar: '',
    remember_token: '',
    role_id: 3
  });

  // const changePassword = (value) => {
  //   const temp = strengthIndicator(value);
  //   setLevel(strengthColor(temp));
  // };

  // =============== Get ข้อมูล User ===============//
  const { id } = useParams();
  const getUser = async (id) => {
    await getUsers.getAlluserId(id).then((responst) => {
      if (responst.length > 0) {
        responst.map((result) => {
          setInitialValue({
            user_id: result.user_id,
            firstname: result.firstname,
            lastname: result.lastname,
            company_id: result.company_id,
            role: result.role,
            country: result.country,
            email: result.email,
            avatar: result.avatar,
            role_id: result.role_id
          });
        });
      }
    });
  };

  const [rolesuser, setRolesUser] = useState([]);

  const getRole = () => {
    getUsers.getRoleUsers().then((responst) => {
      setRolesUser(responst);
    });
  };

  useEffect(() => {
    getUser(id);
    getRole();
  }, [id]);

  // =============== Submit ข้อมูล User ===============//

  const navigate = useNavigate();
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    setPopupErrors(false);
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
      console.log('values ', values);
      setStatus({ success: false });
      setSubmitting(false);

      const sRoles = rolesuser.find((x) => x.role_id == values.role_id);

      const jsonData = {
        firstname: values.firstname,
        lastname: values.lastname,
        company_id: values.company_id,
        role: sRoles.role_name,
        country: values.country,
        email: values.email,
        avatar: values.avatar,
        role_id: values.role_id,
        updated_at: currentDate
      };

      getUsers.putUsers(values.user_id,jsonData).then((responst) => {
        console.log('responst:', responst);
        if (responst.status === 'ok') {
          navigate('/admin/users/');
        }
      });

      console.log('jsonData :', jsonData);
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };
  return (
    <>
      <Grid alignItems="center" justifyContent="space-between">
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
              {popupErrors == true && (
                <Stack sx={{ width: '100%', mb: '18px' }} spacing={2}>
                  <Alert severity="error">{massageErrors}</Alert>
                </Stack>
              )}
              <Formik
                initialValues={initialValue}
                validationSchema={Yup.object().shape({
                  firstname: Yup.string().max(255).required('กรุณาระบุชื่อ'),
                  lastname: Yup.string().max(255).required('กรุณาระบุนามสกุล'),
                  email: Yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').max(255).required('กรุณาระบุอีเมล')
                })}
                onSubmit={handleSubmits}
                enableReinitialize={true}
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

                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel>ประเภทผู้ใช้งาน*</InputLabel>
                          <TextField
                            select
                            variant="outlined"
                            name="role_id"
                            value={values.role_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                          >
                            {rolesuser.map((roles) => (
                              <MenuItem key={roles.role_id} value={roles.role_id}>
                                {roles.role_name}
                              </MenuItem>
                            ))}
                          </TextField>
                          {touched.role_id && errors.role_id && (
                            <FormHelperText error id="helper-text-company-car">
                              {errors.role_id}
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
                          <Button disabled={isSubmitting} size="large" type="submit" variant="contained" color="primary">
                            บันทึกข้อมูล
                          </Button>
                        </AnimateButton>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default UpdateUser;
