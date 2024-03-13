import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Link api url
import * as adminRequest from '_api/adminRequest';

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
  Backdrop,
  CircularProgress
} from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddForklift() {
  const [open, setOpen] = useState(false);
  const lastDate = moment().endOf('year').format('YYYY-MM-DD');
  const navigate = useNavigate();

  const initialValue = {
    forklift_name: '',
    contact_info: '',
    department: '',
    start_date: '',
    end_date: lastDate,
    status: 'A'
  };

  const validations = Yup.object().shape({
    forklift_name: Yup.string().max(255).required('กรุณาระบุชื่อพนักงานจ่ายสินค้า')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    setOpen(true);
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    try {
      values.start_date = currentDate;

      adminRequest
        .addForklifts(values)
        .then(() => {
          navigate('/admin/forklifts/');
          setOpen(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
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
      <Grid container>
        <Grid item xs={8}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={validations} enableReinitialize={true} onSubmit={handleSubmits}>
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">เพิ่มข้อมูลโฟล์คลิฟท์</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="forklift_name">ชื่อ-นามสกุล*</InputLabel>
                        <OutlinedInput
                          id="forklift_name"
                          type="text"
                          value={values.forklift_name}
                          name="forklift_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ชื่อ-นามสกุล"
                          fullWidth
                          error={Boolean(touched.forklift_name && errors.forklift_name)}
                        />
                        {touched.forklift_name && errors.forklift_name && (
                          <FormHelperText error id="helper-text-name-company">
                            {errors.forklift_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="contact_info">ข้อมูลติดต่อ</InputLabel>
                        <OutlinedInput
                          id="contact_info"
                          type="contact_info"
                          value={values.contact_info}
                          name="contact_info"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ข้อมูลติดต่อ"
                          fullWidth
                          error={Boolean(touched.contact_info && errors.contact_info)}
                        />
                        {touched.contact_info && errors.contact_info && (
                          <FormHelperText error id="helper-text-contact_info">
                            {errors.contact_info}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="departmentr">แผนก</InputLabel>
                        <OutlinedInput
                          id="department"
                          type="department"
                          value={values.department}
                          name="department"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="แผนก"
                          fullWidth
                          error={Boolean(touched.department && errors.department)}
                        />
                        {touched.department && errors.department && (
                          <FormHelperText error id="helper-text-department">
                            {errors.department}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    {/* {permission.length > 0 && permission.add_data && ( */}
                    <Grid item xs={12}>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        size="mediam"
                        type="submit"
                        variant="contained"
                        color="success"
                        startIcon={<SaveOutlined />}
                      >
                        เพิ่มข้อมูล
                      </Button>
                    </Grid>
                    {/* )} */}
                  </Grid>
                </form>
              )}
            </Formik>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AddForklift;
