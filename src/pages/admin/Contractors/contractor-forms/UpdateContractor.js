import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  FormControl,
  Select,
  MenuItem,
  Divider,
  Backdrop,
  CircularProgress
} from '@mui/material';

import MainCard from 'components/MainCard';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

function UpdateContractor() {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [initialValue, setInitialValue] = useState({
    contractor_name: '',
    contract_company_id: '',
    contact_info: '',
    contract_amount: '',
    start_date: '',
    end_date: '',
    status: ''
  });

  const validations = Yup.object().shape({
    contractor_name: Yup.string().max(255).required('กรุณาระบุชื่อสายแรงงาน'),
    contract_company_id: Yup.string().max(255).required('กรุณาระบุสังกัด')
  });

  useEffect(() => {
    getContractorDetails();
    getCompanyContractors();
    getContractorsList();
  }, []);

  //   const [contractorData, setContractorData] = useState({});
  const getContractorDetails = () => {
    setOpen(true);
    adminRequest.getContractorsById(id).then((response) => {
      if (response.length) {
        response.map((x) => {
          setInitialValue({
            contractor_id: x.contractor_id,
            contractor_name: x.contractor_name,
            contract_company_id: x.contract_company_id,
            contact_info: x.contact_info,
            address: x.address,
            contract_type: x.contract_type,
            start_date: x.start_date,
            end_date: x.end_date,
            contract_amount: x.contract_amount,
            status: x.status
          });
        });
      }
    });
  };

  const [companyConList, setCompanyConList] = useState([]);
  const getCompanyContractors = () => {
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
  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    if (
      contractorList.filter(
        (x) =>
          x.contractor_name === values.contractor_name &&
          x.contract_company_id == values.contract_company_id &&
          x.contractor_id !== values.contractor_id
      ).length > 0
    ) {
      enqueueSnackbar('ไม่สามารถแก้ไขข้อมูลสายแรงงานซ้ำได้!', { variant: 'error' });
    } else {
      setOpen(true);
      try {
        adminRequest.putContractor(id, values).then(() => {
          enqueueSnackbar('บันทึกข้อมูลรถสำเร็จ!', { variant: 'success' });
          backToPage();
          setOpen(false);
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const backToPage = () => {
    navigate('/admin/contractors/');
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
                    <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        size="mediam"
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveOutlined />}
                      >
                        บันทึกข้อมูล
                      </Button>

                      <Button
                        size="mediam"
                        variant="contained"
                        color="error"
                        onClick={() => {
                          backToPage();
                        }}
                        startIcon={<RollbackOutlined />}
                      >
                        ยกเลิก
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

export default UpdateContractor;
