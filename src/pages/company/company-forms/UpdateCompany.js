import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Divider } from '@mui/material';
import MainCard from 'components/MainCard';

// DateTime
import moment from 'moment';

function UpdateCompany() {
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
    name: Yup.string().max(255).required('กรุณาระบุชื่อ บริษัท/ร้านค้า'),
    country: Yup.string().max(255).required('กรุณาระบุประเทศ'),
    open_time: Yup.string().max(255).required('กรุณาระบุเวลาทำการ'),
    description: Yup.string().max(255).required('กรุณาระบุรายละเอียดของบริษัท'),
    tax_no: Yup.string().min(13).max(13).required('กรุณาระบุเลขที่ผู้เสียภาษี'),
    phone: Yup.string()
      .matches(/^[0-9]*$/, 'กรุณาระบุเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น')
      .required('กรุณาระบุเบอร์โทรศัพท์'),
    address: Yup.string().max(255).required('กรุณาระบุที่อยู่'),
    zipcode: Yup.string().max(5).required('กรุณาระบุรหัสไปรษณีย์'),
    contact_person: Yup.string().max(255).required('กรุณาระบุชื่อผู้ติดต่อ'),
    contact_number: Yup.string()
      .matches(/^[0-9]*$/, 'กรุณาระบุเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น')
      .required('กรุณาระบุเบอร์โทรศัพท์ผู้ติดต่อ')
  });

  const { id } = useParams();

  useEffect(() => {
    getCompany(id);
  }, [id]);

  // =============== Get ข้อมูล Company ===============//
  const getCompany = async (id) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: apiUrl + '/company/' + id,
      headers: {}
    };

    await axios
      .request(config)
      .then((response) => {
        response.data.company.map((result) => {
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
          }
        });
      })

      .catch((error) => {
        console.log(error);
      });
  };

  // =============== บันทึกข้อมูล ===============//
  const userId = localStorage.getItem('user_id');
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData();
    try {
      values.user_id = userId;
      values.created_at = currentDate;
      values.updated_at = currentDate;
      values.location_lat = '0000';
      values.location_lng = '0000';

      formData.append('user_id', values.user_id);
      formData.append('name', values.name);
      formData.append('country', values.country);
      formData.append('open_time', values.open_time);
      formData.append('description', values.description);
      formData.append('tax_no', values.tax_no);
      formData.append('phone', values.phone);
      formData.append('address', values.address);
      formData.append('zipcode', values.zipcode);
      formData.append('location_lat', values.location_lat);
      formData.append('location_lng', values.location_lng);
      formData.append('contact_number', values.contact_number);
      formData.append('contact_person', values.contact_person);
      formData.append('created_at', values.created_at);
      formData.append('updated_at', values.updated_at);

      console.log(values);

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: apiUrl + '/updatecompany/' + id,
        headers: {
          'Content-Type': 'application/json'
        },
        data: formData
      };

      axios
        .request(config)
        .then((result) => {
          console.log('result :', result);
          if (result.data.status === 'ok') {
            window.location.href = '/company';
          } else {
            alert(result['message']['sqlMessage']);
          }

          setStatus({ success: false });
          setSubmitting(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();

  const backToCompany = () => {
    navigate('/company');
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between">
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
                    <InputLabel htmlFor="description-company">รายละเอียด*</InputLabel>
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
                    <InputLabel htmlFor="contact_person-company">ชื่อผู้ติดต่อ*</InputLabel>
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
                    <InputLabel htmlFor="contact_number-company">เบอร์โทรผู้ติดต่อ*</InputLabel>
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
                  <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="primary">
                    บันทึกข้อมูล
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      backToCompany();
                    }}
                  >
                    ย้อนกลับ
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </MainCard>
    </Grid>
  );
}

export default UpdateCompany;
