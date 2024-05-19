import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
  Divider,
  Backdrop,
  CircularProgress,
  Alert
} from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

import MainCard from 'components/MainCard';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function UpdateCompanyCon() {
  const pageId = 20;
  const userRole = useSelector((state) => state.auth?.roles);
  const userPermission = useSelector((state) => state.auth?.user_permissions);

  const [pageDetail, setPageDetail] = useState([]);

  useEffect(() => {
    if (Object.keys(userPermission).length > 0) {
      setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
    }
  }, [userRole, userPermission]);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const companyList = location.state?.companyList;
  const { id } = useParams();
  const [initialValue, setInitialValue] = useState({
    contract_company_name: '',
    created_at: '',
    updated_at: ''
  });

  const validations = Yup.object().shape({
    contract_company_name: Yup.string().max(255).required('กรุณาระบุชื่อสังกัด')
  });

  useEffect(() => {
    if (companyList.length > 0) {
      const finData = companyList.find((x) => x.contract_company_id == id);
      setInitialValue({
        contract_company_name: finData.contract_company_name,
        created_at: finData.created_at,
        updated_at: finData.updated_at
      });
    }
  }, [id]);

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {
    setOpen(true);
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const getFilter = companyList.filter(
      (x) => x.contract_company_name == values.contract_company_name && x.contract_company_id !== parseInt(id)
    );
    if (getFilter.length > 0) {
      enqueueSnackbar('ไม่สามารถเพิ่มข้อมูลสังกัดซ้ำได้!', { variant: 'error' });
      setOpen(false);
    } else {
      try {
        values.created_at = currentDate;
        values.updated_at = currentDate;

        adminRequest
          .putCompanyContractors(id, values)
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

  const backToPage = () => {
    navigate('/admin/company-contractors/');
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
                          <Typography variant="h5">แก้ไขข้อมูลสังกัด</Typography>
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

export default UpdateCompanyCon;
