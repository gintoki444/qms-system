import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from '../../../../node_modules/axios/index';

// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
import * as reserveRequest from '_api/reserveRequest';

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
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  FormControl
} from '@mui/material';
import MainCard from 'components/MainCard';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// get Icons
import { PlusSquareOutlined, MinusSquareOutlined, SaveOutlined, RollbackOutlined } from '@ant-design/icons';
// DateTime
import moment from 'moment';

function AddOrder() {
  const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const sutotal = 0;
  const [items, setItems] = useState([
    { product_id: '', quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate }
  ]);

  // =============== Get Reserve ID ===============//
  const [reservationData, setReservationData] = useState({});
  const { id } = useParams();
  const getReserve = () => {
    const urlapi = apiUrl + `/reserve/` + id;
    axios
      .get(urlapi)
      .then((res) => {
        if (res) {
          res.data.reserve.map((result) => {
            setReservationData(result);
          });
        }
      })
      .catch((err) => console.log(err));
  };
  // =============== Get order ===============//
  //   const [orderList, setOrderList] = useState([]);
  //   const getOrder = async () => {
  //     const urlapi = apiUrl + `/orders/` + id;
  //     await axios
  //       .get(urlapi)
  //       .then((res) => {
  //         setOrderList(res.data);
  //       })
  //       .catch((err) => console.log(err));
  //   };

  // =============== Get Product ===============//
  const [productList, setProductList] = useState([]);
  const getProduct = async () => {
    const urlapi = apiUrl + `/allproducts`;
    await axios
      .get(urlapi)
      .then((res) => {
        setProductList(res.data);
      })
      .catch((err) => console.log(err));
  };

  // =============== Get Product Company ===============//
  const [productCompany, setProductCompany] = useState([]);
  const getProductCompany = () => {
    try {
      reserveRequest.getAllproductCompanys().then((response) => {
        console.log(response);
        setProductCompany(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeProductCom = (e) => {
    console.log(e.target.value);
    getProductBrand(e.target.value);
  };

  // =============== Get Product Brand ===============//
  const [productBrand, setProductBrand] = useState([]);
  const getProductBrand = (id) => {
    try {
      reserveRequest.getProductBrandById(id).then((response) => {
        setProductBrand(response);
        console.log();
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== useEffect ===============//
  useEffect(() => {
    // getOrder();
    getReserve();
    getProduct();
    getProductCompany();
  }, [id]);

  // =============== Validate Forms ===============//
  const generateItemSchema = () =>
    Yup.object().shape({
      product_id: Yup.string().required('กรุณาระบุสินค้า'),
      quantity: Yup.number().required('กรุณาระบุจำนวนสินค้า').min(0.2, 'กรุณาระบุจำนวนสินค้าอย่างน้อย 0.2 ตัน')
    });
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape({
      ref_order_id: Yup.string().required('กรุณาระบุหมายเลขคำสั่งซื้อ'),
      description: Yup.string().required('กรุณาระบุรายละเอียด'),
      order_date: Yup.string().required('กรุณาระบุวันที่สั่งซื้อสินค้า'),
      product_company_id: Yup.string().required('กรุณาระบุบริษัท(สินค้า)'),
      product_brand_id: Yup.string().required('กรุณาระบุแบรนด์(สินค้า)'),
      items: Yup.array().of(generateItemSchema())
    })
  );
  const initialValue = {
    ref_order_id: '',
    company_id: reservationData.company_id,
    product_company_id: '',
    product_brand_id: '',
    description: '',
    order_date: moment(new Date()).format('YYYY-MM-DD'),
    items: items
  };

  // =============== บันทึกข้อมูล ===============//
  //ตรวจสอบว่ามีการสร้าง Queue จากข้อมูลการจองหรือยัง
  function createOrder(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // รวม grand total ของ quantity ของทุกรายการ items
        const grandTotalQuantity = items.reduce((acc, item) => {
          return acc + parseFloat(item.quantity);
        }, 0);

        if (items.length === 0) {
          alert('กรุณาเพิ่มข้อมูล : items.length = 0');
          return;
        }

        if (items[0].product_id === '') {
          alert('กรุณาเพิ่มข้อมูล');
          return;
        }

        var raw = {
          reserve_id: id,
          ref_order_id: data.ref_order_id,
          company_id: reservationData.company_id,
          description: data.description,
          order_date: data.order_date,
          total_amount: grandTotalQuantity,
          product_company_id: data.product_company_id,
          product_brand_id: data.product_brand_id,
          created_at: currentDate,
          updated_at: currentDate,
          items
        };

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: apiUrl + '/ordertran',
          headers: {
            'Content-Type': 'application/json'
          },
          data: raw
        };

        axios
          .request(config)
          .then((result) => {
            if (result.data.status === 'ok') {
              //Update total_amount
              updateReserveTotal();
              resolve(result['status']);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }, 500);
    });
  }

  const updateReserveTotal = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + '/updatereservetotal/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        editReserve();
      })
      .catch((error) => console.log('error', error));
  };

  const editReserve = () => {
    navigate('/reserve/update/' + id);
  };

  const handleSubmits = async (values) => {
    try {
      // values.items = items;
      await createOrder(values);
    } catch (err) {
      console.error(err);
    }
  };

  // =============== เลือกสินค้า ===============//
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;

    setItems(updatedItems);
    initialValue.items = items;
    // ตรวจสอบว่ามีสินค้าที่ถูกเลือกแล้วหรือไม่
    // const isDuplicate = items.some((item, i) => i !== index && item.product_id === value);

    // if (isDuplicate) {
    //   window.alert('รายการนี้ถูกเลือกไปแล้ว!');
    // } else {
    //   const updatedItems = [...items];
    //   updatedItems[index][name] = value;

    //   setItems(updatedItems);
    //   initialValue.items = items;
    // }
  };

  // =============== เพิ่ม-ลบรา รายการสินค้า ===============//
  const [coutRowsProduct, setCoutRowsProduct] = useState(1);
  const addItem = () => {
    items.push({ product_id: '', quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate });

    setCoutRowsProduct(coutRowsProduct + 1);

    setValidationSchema((prevSchema) => {
      return Yup.object().shape({
        ...prevSchema.fields,
        items: Yup.array().of(generateItemSchema())
      });
    });

    initialValue.items = items;
  };

  const removeItem = (index) => {
    setCoutRowsProduct(coutRowsProduct - 1);
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const navigate = useNavigate();
  const backToReserce = () => {
    navigate('/reserve/update/' + id);
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      <Grid container rowSpacing={1} columnSpacing={1.75}>
        <Grid item xs={12} lg={12}>
          <Grid sx={{ m: 3, ml: 0 }} container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4">เลขที่การจอง: {id} </Typography>
              <Divider sx={{ mb: { xs: 1, sm: 2 }, mt: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="p" sx={{ pt: 5 }}>
                <strong>ร้านค้า/บริษัท</strong>: {reservationData.company}{' '}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="p" sx={{ pt: 2 }}>
                <strong>วันที่เข้ารับสินค้า</strong>: {moment(reservationData.pickup_date).format('DD/MM/YYYY')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={12}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits}>
              {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, touched, errors, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">เพิ่มข้อมูลการสั่งซื้อสินค้า</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>เลขที่คำสั่งซื้อ *</InputLabel>
                        <OutlinedInput
                          id="ref_order_id"
                          type="text"
                          value={values.ref_order_id}
                          name="ref_order_id"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="เลขที่คำสั่งซื้อ *"
                          error={Boolean(touched.ref_order_id && errors.ref_order_id)}
                        />

                        {touched.ref_order_id && errors.ref_order_id && (
                          <FormHelperText error id="helper-text-ref_order_id">
                            {errors.ref_order_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>วันที่สั่งซื้อสินค้า*</InputLabel>
                        <TextField
                          required
                          fullWidth
                          type="date"
                          id="order_date"
                          name="order_date"
                          onBlur={handleBlur}
                          value={values.order_date}
                          onChange={handleChange}
                        />
                        {touched.order_date && errors.order_date && (
                          <FormHelperText error id="helper-text-order_date">
                            {errors.order_date}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <InputLabel>บริษัท (สินค้า)</InputLabel>
                      <FormControl sx={{ width: '100%' }} size="small">
                        <Select
                          displayEmpty
                          variant="outlined"
                          name="product_company_id"
                          value={values.product_company_id}
                          onChange={(e) => {
                            setFieldValue('product_company_id', e.target.value);
                            handleChangeProductCom(e);
                          }}
                          placeholder="เลือกสายแรงงาน"
                          fullWidth
                          error={Boolean(touched.product_company_id && errors.product_company_id)}
                        >
                          <MenuItem disabled value="">
                            เลือกบริษัท
                          </MenuItem>
                          {productCompany.map((companias) => (
                            <MenuItem key={companias.product_company_id} value={companias.product_company_id}>
                              {companias.product_company_name_th}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {touched.product_company_id && errors.product_company_id && (
                        <FormHelperText error id="helper-text-product_company_id">
                          {errors.product_company_id}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <InputLabel>เบรนสินค้า</InputLabel>
                      <FormControl sx={{ width: '100%' }} size="small">
                        <Select
                          displayEmpty
                          variant="outlined"
                          name="product_brand_id"
                          value={values.product_brand_id}
                          onChange={handleChange}
                          placeholder="เลือกสายแรงงาน"
                          fullWidth
                          error={Boolean(touched.product_brand_id && errors.product_brand_id)}
                        >
                          <MenuItem disabled value="">
                            เลือกเบรนสินค้า
                          </MenuItem>
                          {productBrand.map((brands) => (
                            <MenuItem key={brands.product_brand_id} value={brands.product_brand_id}>
                              {brands.product_brand_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {touched.product_brand_id && errors.product_brand_id && (
                        <FormHelperText error id="helper-text-product_brand_id">
                          {errors.product_brand_id}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <InputLabel>รายละเอียดวันสั่งซื้อสินค้า *</InputLabel>
                        <OutlinedInput
                          id="description"
                          type="description"
                          value={values.description}
                          name="description"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="รายละเอียดการสั่งซื้อสินค้า *"
                          error={Boolean(touched.description && errors.description)}
                        />
                        {touched.description && errors.description && (
                          <FormHelperText error id="helper-text-description">
                            {errors.description}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>สินค้า</TableCell>
                            <TableCell align="left">จำนวน (ตัน)</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id={`items.${index}.product_id`}
                                    placeholder="สินค้า"
                                    size="small"
                                    value={item.product_id}
                                    onChange={(e) => handleInputChange(e, index)}
                                    name={`product_id`}
                                  >
                                    {productList.map((product) => (
                                      <MenuItem key={product.product_id} value={product.product_id}>
                                        {product.name}
                                      </MenuItem>
                                    ))}
                                  </Select>

                                  {touched.items && touched.items[index] && errors.items && errors.items[index] && (
                                    <>
                                      {touched.items[index].product_id && errors.items[index].product_id && (
                                        <FormHelperText error id="helper-text-description">
                                          {errors.items[index].product_id}
                                        </FormHelperText>
                                      )}
                                    </>
                                  )}
                                  {/* {touched.items && touched.items[index] && errors.items && errors.items[index] && (
                                <FormHelperText error id="helper-text-description">
                                  {errors.items[index].product_id}
                                </FormHelperText>
                              )} */}
                                </FormControl>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  required
                                  value={item.quantity}
                                  onChange={(e) => handleInputChange(e, index)}
                                  name={`quantity`}
                                  autoComplete="quantity"
                                  size="small"
                                  type="number"
                                  inputProps={{ min: 1, step: 1, pattern: '^\\d*\\.?\\d{0,4}$' }}
                                  InputProps={{ inputMode: 'numeric' }}
                                />
                                {touched.items && touched.items[index] && errors.items && errors.items[index] && (
                                  <>
                                    {touched.items[index].quantity && errors.items[index].quantity && (
                                      <FormHelperText error id="helper-text-description">
                                        {errors.items[index].quantity}
                                      </FormHelperText>
                                    )}
                                  </>
                                )}
                                {/* {touched.items && touched.items[index] && errors.items && errors.items[index] && (
                              <FormHelperText error id="helper-text-description">
                                {errors.items[index].quantity}
                              </FormHelperText>
                            )} */}
                              </TableCell>
                              <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                                {coutRowsProduct === index + 1 && (
                                  <Button
                                    size="mediam"
                                    color="info"
                                    sx={{ p: '6px 0', minWidth: '33px!important', fontSize: '24px' }}
                                    onClick={() => {
                                      // items.push({ product_id: '', quantity: 0 });
                                      addItem();
                                    }}
                                  >
                                    <PlusSquareOutlined />
                                  </Button>
                                )}

                                {coutRowsProduct > index + 1 && (
                                  <Button
                                    sx={{ p: '6px 0', minWidth: '33px!important', fontSize: '24px' }}
                                    onClick={() => removeItem(index)}
                                    size="mediam"
                                    color="error"
                                  >
                                    <MinusSquareOutlined />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableBody xs={12} sx={{ '& button': { m: 1 } }}></TableBody>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>

                    <Grid item xs={12} sx={{ '& button': { m: 1 } }}>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 1 }} />
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
                          backToReserce();
                        }}
                        startIcon={<RollbackOutlined />}
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
      </Grid>
    </Grid>
  );
}

export default AddOrder;
