import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// import * as stepRequest from '_api/StepRequest';
import * as adminRequest from '_api/adminRequest';
// import * as reserveRequest from '_api/reserveRequest';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Divider
  //   FormControl,
  //   Select,
  //   MenuItem,
  //   TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';

// DateTime
import moment from 'moment';

function UpdateProducts() {
  const { id } = useParams();

  useEffect(() => {
    getProducts();
  }, [id]);

  // =============== Get Product Register ===============//
  const [products, setProducts] = useState({
    name: '',
    product_category_id: '',
    unit_price: '',
    stock_quantity: '',
    register: '',
    setup_pile_date: '',
    product_status: '',
    created_at: '',
    updated_at: ''
  });

  const getProducts = () => {
    try {
      adminRequest.getProductsById(id).then((response) => {
        if (response.status == 'ok') {
          response.product.map((data) => {
            setProducts(data);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  const initialValue = {
    name: products.product,
    product_category_id: products.product_category_id,
    unit_price: products.unit_price,
    stock_quantity: products.stock_quantity,
    register: products.register,
    setup_pile_date: products.setup_pile_date,
    product_status: products.product_status,
    created_at: products.created_at,
    updated_at: currentDate
  };

  console.log('initialValue :', initialValue);

  const valiDationSchema = Yup.object().shape({
    name: Yup.string().required('กรุณาระบุชื่อสินค้า'),
    stock_quantity: Yup.string().max(255).required('กรุณาจำนวนสินค้า')
  });

  // =============== บันทึกข้อมูล ===============//
  const handleSubmits = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      adminRequest.putProductById(id, values).then((response) => {
        if (response.status == 'ok') {
          backToPage();
        } else {
          alert('ไม่สามารถสร้าง "ชื่อ" สินค้าซ้ำกันได้');
        }
      });
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();
  const backToPage = () => {
    navigate('/admin/products/');
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={valiDationSchema} enableReinitialize={true} onSubmit={handleSubmits}>
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">เพิ่มข้อมูลสินค้า (สูตร)</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">ชื่อสินค้า *</InputLabel>
                        <OutlinedInput
                          id="name"
                          type="name"
                          value={values.name}
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ทะเบียน"
                          fullWidth
                          error={Boolean(touched.name && errors.name)}
                        />
                        {touched.name && errors.name && (
                          <FormHelperText error id="helper-text-name">
                            {errors.name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="stock_quantity">สินค้างเหลือ *</InputLabel>
                        <OutlinedInput
                          id="stock_quantity"
                          type="number"
                          value={values.stock_quantity}
                          name="stock_quantity"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="ยอดยกมา"
                          fullWidth
                          error={Boolean(touched.stock_quantity && errors.stock_quantity)}
                        />
                        {touched.stock_quantity && errors.stock_quantity && (
                          <FormHelperText error id="helper-text-stock_quantity">
                            {errors.stock_quantity}
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
                        color="success"
                        startIcon={<SaveOutlined />}
                      >
                        บันทึกข้อมูลสินค้า
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

export default UpdateProducts;
