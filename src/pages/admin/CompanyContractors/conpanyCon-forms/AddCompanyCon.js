import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

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

function AddCompanyCon() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const companyList = location.state?.companyList;

  const initialValue = {
    contract_company_name: '',
    created_at: '',
    updated_at: ''
  };

  const validations = Yup.object().shape({
    contract_company_name: Yup.string().max(255).required('กรุณาระบุชื่อสังกัด')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    setOpen(true);
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const getFilter = companyList.filter((x) => x.contract_company_name == values.contract_company_name);
    if (getFilter.length > 0) {
      enqueueSnackbar('ไม่สามารถเพิ่มข้อมูลสังกัดซ้ำได้!', { variant: 'error' });
      setOpen(false);
    } else {
      try {
        values.created_at = currentDate;
        values.updated_at = currentDate;

        adminRequest
          .AddCompanyContractors(values)
          .then(() => {
            enqueueSnackbar('บันทึกข้อมูลสังกัดสำเร็จ!', { variant: 'success' });
            navigate('/admin/company-contractors/');
            setOpen(false);
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (err) {
        console.error(err);
      }
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
                      <Typography variant="h5">เพิ่มข้อมูลสังกัด</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="contract_company_name">ชื่อสังกัด*</InputLabel>
                        <OutlinedInput
                          id="contract_company_name"
                          type="text"
                          value={values.contract_company_name}
                          name="contract_company_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ชื่อสังกัด"
                          fullWidth
                          error={Boolean(touched.contract_company_name && errors.contract_company_name)}
                        />
                        {touched.contract_company_name && errors.contract_company_name && (
                          <FormHelperText error id="helper-text-name-company">
                            {errors.contract_company_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

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

export default AddCompanyCon;
