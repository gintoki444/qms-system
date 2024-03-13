import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Link api url
import * as adminRequest from '_api/adminRequest';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Divider } from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

import MainCard from 'components/MainCard';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

function UpdateWarehouseManager() {
  const [initialValue, setInitialValue] = useState({
    manager_name: '',
    contact_info: '',
    department: '',
    warehouse_id: '',
    description: '',
    end_date: '',
    status: 'A'
  });
  // const lastDate = moment().endOf('year').format('YYYY-MM-DD');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getManagerWareHouse();
    // getWareHouses();
  }, [id]);

  const getManagerWareHouse = () => {
    adminRequest.getManagerWareHouse(id).then((response) => {
      if (response) {
        response.map((result) => {
          setInitialValue({
            manager_name: result.manager_name,
            contact_info: result.contact_info,
            department: result.department,
            warehouse_id: result.warehouse_id,
            description: result.description,
            end_date: result.end_date,
            status: result.status
          });
        });
      }
    });
  };

  const validations = Yup.object().shape({
    manager_name: Yup.string().max(255).required('กรุณาระบุชื่อหัวหน้าโกดัง')
    // contact_info: Yup.string()
    //   .matches(/^0/, 'กรุณาระบุเบอร์โทรศัพท์ตัวแรกเป็น 0')
    //   .matches(/^[0-9]*$/, 'กรุณาระบุเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น')
    //   .min(9, 'กรุณาระบุเบอร์โทรศัพท์ 9 หลัก')
    //   .max(10, 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก')
    //   .required('กรุณาระบุเบอร์โทรศัพท์ผู้ติดต่อ')
  });

  // const [wareHouseList, setWareHouseList] = useState([]);
  // const getWareHouses = () => {
  //   try {
  //     adminRequest.getAllWareHouse().then((response) => {
  //       setWareHouseList(response);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values) => {

    try {
      const dataUpdate = {
        manager_name: values.manager_name,
        contact_info: values.contact_info,
        department: values.department
      };

      adminRequest
        .putManagerWareHouse(id, dataUpdate)
        .then(() => {
          navigate('/admin/warehouse/');
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const backToPage = () => {
    navigate('/admin/warehouse/');
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container>
        <Grid item xs={8}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={validations} enableReinitialize={true} onSubmit={handleSubmits}>
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">เพิ่มข้อมูลหัวหน้าโกดัง</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="manager_name-car">ชื่อ-นามสกุล*</InputLabel>
                        <OutlinedInput
                          id="manager_name-car"
                          type="text"
                          value={values.manager_name}
                          name="manager_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ชื่อ-นามสกุล"
                          fullWidth
                          error={Boolean(touched.manager_name && errors.manager_name)}
                        />
                        {touched.manager_name && errors.manager_name && (
                          <FormHelperText error id="helper-text-name-company">
                            {errors.manager_name}
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

                    {/* <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="departmentr">แผนก</InputLabel>
                    <FormControl>
                      <Select
                        id="warehouse_id"
                        name="warehouse_id"
                        displayEmpty
                        value={values.warehouse_id}
                        onChange={handleChange}
                        input={<OutlinedInput />}
                        error={Boolean(touched.warehouse_id && errors.warehouse_id)}
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem disabled value="">
                          เลือกโกดัง
                        </MenuItem>
                        {wareHouseList.map((warehouse) => (
                          <MenuItem key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                            {warehouse.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {touched.warehouse_id && errors.warehouse_id && (
                      <FormHelperText error id="helper-text-warehouse_id">
                        {errors.warehouse_id}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid> */}

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

export default UpdateWarehouseManager;
