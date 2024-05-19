import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Get api company
import * as companyRequest from '_api/companyRequest';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

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
import MainCard from 'components/MainCard';

// DateTime
import moment from 'moment';

function UpdateCompany() {
  const pageId = 5;
  const userPermission = useSelector((state) => state.auth?.user_permissions);
  const [pageDetail, setPageDetail] = useState([]);
  const userId = useSelector((state) => state.auth.user_id);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  let [initialValue, setInitialValue] = useState({
    name: '',
    country: '',
    open_time: '',
    description: '',
    tax_no: '',
    phone: '',
    address: '',
    zipcode: '',
    contact_person: '',
    contact_number: ''
  });

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required('กรุณาระบุชื่อ บริษัท/ร้านค้า')
    // country: Yup.string().max(255).required('กรุณาระบุประเทศ'),
    // open_time: Yup.string().max(255).required('กรุณาระบุเวลาทำการ'),
    // // description: Yup.string().max(255).required('กรุณาระบุรายละเอียดของบริษัท'),
    // tax_no: Yup.string().min(13).max(13).required('กรุณาระบุเลขที่ผู้เสียภาษี'),
    // phone: Yup.string()
    //   .min(8, 'กรุณาระบุเบอร์โทรศัพท์อย่างน้อย 8 หลัก')
    //   .max(10, 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก')
    //   .matches(/^0/, 'กรุณาระบุเบอร์โทรศัพท์ตัวแรกเป็น 0')
    //   .matches(/^[0-9]*$/, 'กรุณาระบุเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น')
    //   .required('กรุณาระบุเบอร์โทรศัพท์'),
    // address: Yup.string().max(255).required('กรุณาระบุที่อยู่'),
    // zipcode: Yup.string().max(5).required('กรุณาระบุรหัสไปรษณีย์'),
    // contact_person: Yup.string().max(255).required('กรุณาระบุชื่อผู้ติดต่อ'),
    // contact_number: Yup.string()
    //   .matches(/^0/, 'กรุณาระบุเบอร์โทรศัพท์ตัวแรกเป็น 0')
    //   .matches(/^[0-9]*$/, 'กรุณาระบุเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น')
    //   .min(9, 'กรุณาระบุเบอร์โทรศัพท์ 9 หลัก')
    //   .max(10, 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก')
    //   .required('กรุณาระบุเบอร์โทรศัพท์ผู้ติดต่อ')
  });

  const { id } = useParams();

  useEffect(() => {
    setOpen(true);
    if (Object.keys(userPermission).length > 0) {
      if (userPermission.permission.filter((x) => x.page_id === pageId).length > 0) {
        setPageDetail(userPermission.permission.filter((x) => x.page_id === pageId));
        getCompany(id);
        getCompanyList();
      } else {
        setOpen(false);
      }
    }
  }, [id, userId, userPermission]);

  // =============== Get ข้อมูล Company ===============//
  const [companyList, setCompanyList] = useState([]);
  const getCompanyList = () => {
    setOpen(true);

    companyRequest
      .getAllCompanyByuserId(userId)
      .then((response) => {
        setCompanyList(response);
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getCompany = async (id) => {
    setOpen(true);

    companyRequest
      .getAllCompanyById(id)
      .then((response) => {
        response.company.map((result) => {
          if (result) {
            setInitialValue({
              name: result.name,
              country: result.country,
              open_time: result.open_time,
              description: result.description,
              tax_no: result.tax_no,
              phone: result.phone,
              address: result.address,
              zipcode: result.zipcode,
              contact_person: result.contact_person,
              contact_number: result.contact_number
            });
            setOpen(false);
          }
        });
      })

      .catch((error) => {
        console.log(error);
      });
  };

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    // const formData = new FormData();
    if (companyList.filter((x) => x.name == values.name && x.company_id !== parseInt(id)).length > 0) {
      enqueueSnackbar('ไม่สามารถแก้ไขข้อมูลร้านค้าซ้ำได้!', { variant: 'error' });
    } else {
      try {
        setOpen(true);
        values.user_id = userId;
        values.created_at = currentDate;
        values.updated_at = currentDate;
        values.location_lat = '0000';
        values.location_lng = '0000';

        companyRequest.updateCompany(id, values).then((result) => {
          if (result.status === 'ok') {
            enqueueSnackbar('บันทึกข้อมูลร้านค้า/บริษัท สำเร็จ!', { variant: 'success' });
            window.location.href = '/company';
          } else {
            enqueueSnackbar('บันทึกข้อมูลร้านค้า/บริษัท ไม่สำเร็จ!' + result['message']['sqlMessage'], { variant: 'warning' });
            // alert(result['message']['sqlMessage']);
          }
        });
      } catch (err) {
        console.error(err);
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setSubmitting(false);
      }
    }
  };

  const navigate = useNavigate();

  const backToCompany = () => {
    navigate('/company');
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      {open && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={open}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      {Object.keys(userPermission).length > 0 && pageDetail.length === 0 && (
        <Grid item xs={12}>
          <MainCard content={false}>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="warning">คุณไม่มีสิทธิ์ใช้เข้าถึงข้อมูลนี้</Alert>
            </Stack>
          </MainCard>
        </Grid>
      )}
      {pageDetail.length !== 0 && (
        <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
          <Formik initialValues={initialValue} validationSchema={validationSchema} enableReinitialize={true} onSubmit={handleSubmits}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5">แก้ไขข้อมูลร้านค้า/บริษัท</Typography>
                    <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                  </Grid>

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

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="country-company">ประเทศ*</InputLabel>
                      <OutlinedInput
                        id="country-company"
                        type="country"
                        value={values.country}
                        name="country"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="ประเทศ"
                        fullWidth
                        error={Boolean(touched.country && errors.country)}
                      />
                      {touched.country && errors.country && (
                        <FormHelperText error id="helper-text-country-company">
                          {errors.country}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="address-company">ที่อยู่*</InputLabel>
                      <OutlinedInput
                        id="address-company"
                        type="address"
                        value={values.address}
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="ที่อยู่"
                        fullWidth
                        error={Boolean(touched.address && errors.address)}
                      />
                      {touched.address && errors.address && (
                        <FormHelperText error id="helper-text-address-company">
                          {errors.address}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="zipcode-company">รหัสไปรษณีย์*</InputLabel>
                      <OutlinedInput
                        id="zipcode-company"
                        type="zipcode"
                        value={values.zipcode}
                        name="zipcode"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="รหัสไปรษณีย์"
                        fullWidth
                        error={Boolean(touched.zipcode && errors.zipcode)}
                      />
                      {touched.zipcode && errors.zipcode && (
                        <FormHelperText error id="helper-text-zipcode-company">
                          {errors.zipcode}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="open_time-company">เวลาทำการ*</InputLabel>
                      <OutlinedInput
                        id="open_time-company"
                        type="open_time"
                        value={values.open_time}
                        name="open_time"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="เวลาทำการ"
                        fullWidth
                        error={Boolean(touched.open_time && errors.open_time)}
                      />
                      {touched.open_time && errors.open_time && (
                        <FormHelperText error id="helper-text-open_time-company">
                          {errors.open_time}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="description-company">รายละเอียด</InputLabel>
                      <OutlinedInput
                        id="description-company"
                        type="description"
                        value={values.description}
                        name="description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="รายละเอียด"
                        fullWidth
                        error={Boolean(touched.description && errors.description)}
                      />
                      {touched.description && errors.description && (
                        <FormHelperText error id="helper-text-description-company">
                          {errors.description}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h5">ข้อมูลผู้ติดต่อ</Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="contact_person-company">ชื่อผู้ติดต่อ</InputLabel>
                      <OutlinedInput
                        id="contact_person-company"
                        type="contact_person"
                        value={values.contact_person}
                        name="contact_person"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="ชื่อผู้ติดต่อ"
                        fullWidth
                        error={Boolean(touched.contact_person && errors.contact_person)}
                      />
                      {touched.contact_person && errors.contact_person && (
                        <FormHelperText error id="helper-text-contact_person-company">
                          {errors.contact_person}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="contact_number-company">เบอร์โทรผู้ติดต่อ</InputLabel>
                      <OutlinedInput
                        id="contact_number-company"
                        type="contact_number"
                        value={values.contact_number}
                        name="contact_number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="เบอร์โทรผู้ติดต่อ"
                        fullWidth
                        error={Boolean(touched.contact_number && errors.contact_number)}
                      />
                      {touched.contact_number && errors.contact_number && (
                        <FormHelperText error id="helper-text-contact_number-company">
                          {errors.contact_number}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                    {pageDetail.length > 0 &&
                      (pageDetail[0].permission_name === 'manage_everything' ||
                        pageDetail[0].permission_name === 'add_edit_delete_data') && (
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
                      )}
                    <Button
                      size="mediam"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        backToCompany();
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
      )}
    </Grid>
  );
}

export default UpdateCompany;
