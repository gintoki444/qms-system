import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

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
  FormControl,
  Select,
  MenuItem,
  Divider,
  Backdrop,
  CircularProgress,
  Alert
} from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function AddContractor() {
  const pageId = 21;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  const [open, setOpen] = useState(false);
  const lastDate = moment().endOf('year').format('YYYY-MM-DD');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
      getContractorsList();
      getCompanyContractors();
    }
  }, [userRole, userPermission]);

  const [companyConList, setCompanyConList] = useState([]);
  const getCompanyContractors = () => {
    setOpen(true);
    adminRequest.getAllCompanyContractors().then((response) => {
      setOpen(false);
      setCompanyConList(response);
    });
  };

  const [contractorList, setontractorList] = useState([]);
  const getContractorsList = () => {
    adminRequest.getAllContractors().then((response) => {
      setontractorList(response);
    });
  };

  const initialValue = {
    contractor_name: '',
    contract_company_id: '',
    contact_info: '',
    contract_amount: '0.00',
    start_date: '',
    end_date: lastDate,
    status: 'A'
  };

  const validations = Yup.object().shape({
    contractor_name: Yup.string().max(255).required('กรุณาระบุชื่อสายแรงงาน'),
    contract_company_id: Yup.string().max(255).required('กรุณาระบุสังกัด')
  });
  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    if (
      contractorList.filter((x) => x.contractor_name === values.contractor_name && x.contract_company_id == values.contract_company_id)
        .length > 0
    ) {
      enqueueSnackbar('ไม่สามารถเพิ่มข้อมูลสายแรงงานซ้ำได้!', { variant: 'error' });
    } else {
      try {
        setOpen(true);
        values.start_date = currentDate;

        adminRequest.AddContractors(values).then(() => {
          enqueueSnackbar('บันทึกข้อมูลรถสำเร็จ!', { variant: 'success' });
          navigate('/admin/contractors/');
          setOpen(false);
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
        {(Object.keys(userPermission).length > 0 && pageDetail.length === 0) ||
          (pageDetail.length !== 0 &&
            pageDetail[0].permission_name !== 'manage_everything' &&
            pageDetail[0].permission_name !== 'add_edit_delete_data' && (
              <Grid item xs={12}>
                <MainCard content={false}>
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
                  </Stack>
                </MainCard>
              </Grid>
            ))}
        {pageDetail.length > 0 &&
          (pageDetail[0].permission_name === 'manage_everything' || pageDetail[0].permission_name === 'add_edit_delete_data') && (
            <Grid item xs={8}>
              <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
                <Formik initialValues={initialValue} validationSchema={validations} enableReinitialize={true} onSubmit={handleSubmits}>
                  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="h5">เพิ่มข้อมูลสายแรงงาน</Typography>
                          <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="contractor_name">ชื่อสายแรงงาน*</InputLabel>
                            <OutlinedInput
                              id="contractor_name"
                              type="text"
                              value={values.contractor_name}
                              name="contractor_name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="ชื่อสายแรงงาน"
                              fullWidth
                              error={Boolean(touched.contractor_name && errors.contractor_name)}
                            />
                            {touched.contractor_name && errors.contractor_name && (
                              <FormHelperText error id="helper-text-name-company">
                                {errors.contractor_name}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel>สังกัด *</InputLabel>
                            <FormControl>
                              <Select
                                displayEmpty
                                variant="outlined"
                                name="contract_company_id"
                                value={values.contract_company_id}
                                onChange={handleChange}
                                placeholder="เลือกสังกัด"
                                fullWidth
                                error={Boolean(touched.contract_company_id && errors.contract_company_id)}
                              >
                                <MenuItem disabled value="">
                                  เลือกสังกัด
                                </MenuItem>
                                {companyConList &&
                                  companyConList.map((companyCon) => (
                                    <MenuItem key={companyCon.contract_company_id} value={companyCon.contract_company_id}>
                                      {companyCon.contract_company_name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                            {touched.contract_company_id && errors.contract_company_id && (
                              <FormHelperText error id="helper-contract_company_id">
                                {errors.contract_company_id}
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
          )}
      </Grid>
    </Grid>
  );
}

export default AddContractor;
