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
  Box,
  Stack,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  FormControl,
  Backdrop,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import MainCard from 'components/MainCard';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// get Icons
import { PlusSquareOutlined, MinusSquareOutlined, SaveOutlined, RollbackOutlined } from '@ant-design/icons';
// DateTime
import moment from 'moment';
import { useSnackbar } from 'notistack';

import * as functionAddLogs from 'components/Function/AddLog';
import GetOrderNavision from './GetOrderNavision';

function AddOrder() {
  const userId = localStorage.getItem('user_id');
  const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const sutotal = 0;
  const [items, setItems] = useState([
    { product_id: '', quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate }
  ]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  let [initialValue, setInitialValue] = useState({
    ref_order_id: '',
    company_id: '',
    product_company_id: '',
    product_brand_id: '',
    description: '',
    order_date: moment(new Date()).format('YYYY-MM-DD'),
    items: items
  });

  // =============== Get Reserve ID ===============//
  const [reservationData, setReservationData] = useState({});
  const { id } = useParams();
  const getReserve = async () => {
    // setLoading(true);
    const urlapi = apiUrl + `/reserve/` + id;
    const res = await axios.get(urlapi);
    try {
      if (res) {
        const promises = res.data.reserve.map((result) => {
          setReservationData(result);
          setInitialValue({
            ref_order_id: '',
            company_id: result.company_id,
            product_company_id: result.product_company_id,
            product_brand_id: result.product_brand_id,
            description: '',
            order_date: moment(new Date()).format('YYYY-MM-DD'),
            items: items
          });
          setSelectIdCom(result.product_company_id);
          // รวมการเรียกใช้ฟังก์ชันสองตัวนี้ใน Promise.all
          return Promise.all([getProduct(result.product_company_id, result.product_brand_id), getProductBrand(result.product_company_id)]);
        });

        await Promise.all(promises);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =============== Get Product ===============//
  const [productList, setProductList] = useState([]);
  const getProduct = async (idCom, idBrand) => {
    try {
      reserveRequest.getProductByIdComAndBrandId(idCom, idBrand).then((response) => {
        setProductList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get Product Company ===============//
  const [productCompany, setProductCompany] = useState([]);
  const getProductCompany = () => {
    try {
      reserveRequest.getAllproductCompanys().then((response) => {
        setProductCompany(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [selectIdCom, setSelectIdCom] = useState('');
  const handleChangeProductCom = (e) => {
    setCoutRowsProduct(1);

    const newItem = [{ product_id: null, quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate }];
    setItems(newItem);
    setProductList([]);
    getProductBrand(e.target.value);
    setSelectIdCom(e.target.value);
  };

  // =============== Get Product Brand ===============//
  const [productBrand, setProductBrand] = useState([]);
  const getProductBrand = (id) => {
    try {
      reserveRequest.getProductBrandById(id).then((response) => {
        setProductBrand(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeBrand = (e) => {
    setProductList([]);
    setCoutRowsProduct(1);
    const newItem = [{ product_id: null, quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate }];
    setItems(newItem);
    getProduct(selectIdCom, e.target.value);
  };

  // =============== useEffect ===============//
  useEffect(() => {
    setLoading(true); // ปิดการแสดง Loading เมื่อข้อมูลทั้งหมดถูกโหลดเสร็จ
    Promise.all([getReserve(), getProductCompany()])
      .then(() => {
        setLoading(false); // ปิดการแสดง Loading เมื่อข้อมูลทั้งหมดถูกโหลดเสร็จ
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setLoading(false); // ปิดการแสดง Loading แม้จะเกิดข้อผิดพลาด
      });
  }, [id]);

  // =============== Validate Forms ===============//
  const validationSchema = Yup.object().shape({
    ref_order_id: Yup.string().required('กรุณาระบุหมายเลขคำสั่งซื้อ'),
    order_date: Yup.string().required('กรุณาระบุวันที่สั่งซื้อสินค้า'),
    product_company_id: Yup.string().required('กรุณาระบุบริษัท(สินค้า)'),
    product_brand_id: Yup.string().required('กรุณาระบุตรา(สินค้า)')
  });
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
          // alert('กรุณาเพิ่มข้อมูล : items.length = 0');
          enqueueSnackbar('กรุณาเพิ่มข้อมูลสินค้า', { variant: 'warning' });
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

        try {
          reserveRequest.postCreateOrder(raw).then((response) => {
            if (response.status === 'ok') {
              updateReserveTotal();
              resolve(response.status);
            }
          });
        } catch (error) {
          console.log(error);
        }
      }, 500);
    });
  }

  const updateReserveTotal = () => {
    try {
      reserveRequest.getReserTotalByID(id).then((response) => {
        console.log(response);
        enqueueSnackbar('บันทึกข้อมูลคำสั่งซื้อสำเร็จ!', { variant: 'success' });
        editReserve();
      });
    } catch (error) {
      console.log(error);
      alert('ข้อผิดพลาด ', error);
    }
  };

  const editReserve = () => {
    navigate('/reserve/update/' + id);
  };

  const handleSubmits = async (values, { setErrors, setSubmitting }) => {
    try {
      setLoading(true); // ปิดการแสดง Loading เมื่อข้อมูลทั้งหมดถูกโหลดเสร็จ
      let coutItemId = 0;
      let coutItemsTotal = 0;
      items.map((x) => {
        if (x.product_id) {
          coutItemId = coutItemId + 1;
          if (x.quantity <= 0) {
            coutItemsTotal = coutItemsTotal + 1;
          }
        }
      });

      if (coutItemsTotal !== 0) {
        setErrors(false);
        setSubmitting(false);
        enqueueSnackbar('กรุณาระบุจำนวนสินค้าให้มากกว่า 0 ตัน', { variant: 'warning' });

        return;
      }

      if (items.length !== coutItemId) {
        setErrors(false);
        setSubmitting(false);
        // alert('กรุณาเพิ่มข้อมูลสินค้าให้ครบถ้วน');
        enqueueSnackbar('กรุณาเพิ่มข้อมูลสินค้าให้ครบถ้วน', { variant: 'warning' });
        return;
      }

      if (!values.product_brand_id || !values.product_company_id) {
        setErrors(false);
        setSubmitting(false);
        // alert('ระบุบริษัท(สินค้า)/ตรา(สินค้า)');
        enqueueSnackbar('ระบุบริษัท(สินค้า)/ตรา(สินค้า)', { variant: 'warning' });
        return;
      }

      //   if (values === 999) {
      await createOrder(values);
      // if (values === 999) {
      const data = {
        audit_user_id: userId,
        audit_action: 'I',
        audit_system_id: id,
        audit_system: 'orders',
        audit_screen: `เพิ่มข้อมูลคำสั่งซื้อ : ${values.ref_order_id} `,
        audit_description: JSON.stringify(onSetOrder)
      };
      AddAuditLogs(data);
      // }
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
  };

  const handleInputChangeSelect = (e, index) => {
    const updatedItems = [...items];

    if (e !== null) {
      const { product_id } = e;
      updatedItems[index]['product_id'] = product_id;
    } else {
      updatedItems[index]['product_id'] = e;
    }

    setItems(updatedItems);
    initialValue.items = items;
  };

  // =============== เพิ่ม-ลบรา รายการสินค้า ===============//
  const [coutRowsProduct, setCoutRowsProduct] = useState(1);
  const addItem = () => {
    items.push({ product_id: '', quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate });
    setCoutRowsProduct(coutRowsProduct + 1);
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

  const AddAuditLogs = async (data) => {
    await functionAddLogs.AddAuditLog(data);
  };

  const [SoNumber, setSoNumber] = useState('');
  const handleChangeSO = (e) => {
    setSoNumber(e.target.value);
  };

  const [onSetOrder, setOnSetOrder] = useState({});
  const handleOnSetOrder = (data) => {
    let itemList = [];
    if (data) {
      data.item_list.map((item) => {
        if (item.items.Detial !== undefined && productList.filter((x) => x.product_id === item.items.Detial.product_id).length > 0) {
          const newItem = {
            product_id: item.items.Detial.product_id,
            quantity: item.Quantity,
            subtotal: sutotal,
            created_at: currentDate,
            updated_at: currentDate
          };
          itemList.push(newItem);
        } else {
          item.status = false;
        }
        return item;
      });
      setOnSetOrder(data);
      setItems(itemList);
      console.log(onSetOrder);
    }
  };
  return (
    <Grid alignItems="center" justifyContent="space-between">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
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
                <strong>วันที่เข้ารับสินค้า</strong>: {moment(reservationData.pickup_date).format('DD/MM/YY')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={12}>
          <MainCard content={false} sx={{ mt: 1.5, p: 3 }}>
            <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmits} enableReinitialize={true}>
              {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, touched, errors, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h5">เพิ่มข้อมูลการสั่งซื้อสินค้า</Typography>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <InputLabel>บริษัท (สินค้า) *</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          variant="outlined"
                          name="product_company_id"
                          disabled={Object.keys(onSetOrder).length > 0}
                          value={values.product_company_id}
                          onChange={(e) => {
                            setFieldValue('product_company_id', e.target.value);
                            setFieldValue('product_brand_id', '');
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
                      <InputLabel>ตรา (สินค้า) *</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          variant="outlined"
                          name="product_brand_id"
                          disabled={Object.keys(onSetOrder).length > 0}
                          value={values.product_brand_id}
                          onChange={(e) => {
                            handleChange(e);
                            handleChangeBrand(e);
                          }}
                          placeholder="เลือกสายแรงงาน"
                          fullWidth
                          error={Boolean(touched.product_brand_id && errors.product_brand_id)}
                        >
                          <MenuItem disabled value="">
                            เลือกตรา (สินค้า)
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

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>เลขที่คำสั่งซื้อ *</InputLabel>
                        <Box display="flex" alignItems="center">
                          <OutlinedInput
                            id="ref_order_id"
                            type="text"
                            value={values.ref_order_id}
                            name="ref_order_id"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              setFieldValue('ref_order_id', e.target.value);
                              handleChangeSO(e);
                            }}
                            placeholder="เลขที่คำสั่งซื้อ *"
                            sx={{ width: '100%' }}
                            error={Boolean(touched.ref_order_id && errors.ref_order_id)}
                          />
                          {/* {values.ref_order_id === 9999 && ( */}
                          <Box marginLeft={2}>
                            <GetOrderNavision soNumber={SoNumber} onSetData={handleOnSetOrder} proCompanyID={values.product_company_id} />
                            {/* <Button variant="outlined" disabled={loading} onClick={() => handleSearch(values.ref_order_id)}>
                              {loading ? 'Loading...' : 'Navision...API'}
                            </Button> */}
                          </Box>
                          {/* )} */}
                        </Box>

                        {touched.ref_order_id && errors.ref_order_id && (
                          <FormHelperText error id="helper-text-ref_order_id">
                            {errors.ref_order_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel>วันที่สั่งซื้อสินค้า *</InputLabel>
                        <TextField
                          required
                          fullWidth
                          type="date"
                          id="order_date"
                          name="order_date"
                          onBlur={handleBlur}
                          value={
                            (Object.keys(onSetOrder).length > 0 && moment(onSetOrder.Posting_Date).format('YYYY-MM-DD')) ||
                            values.order_date
                          }
                          onChange={handleChange}
                        />
                        {touched.order_date && errors.order_date && (
                          <FormHelperText error id="helper-text-order_date">
                            {errors.order_date}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <InputLabel>รายละเอียดการสั่งซื้อสินค้า </InputLabel>
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

                    <Grid item xs={12} md={5}>
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
                                  <Autocomplete
                                    disablePortal
                                    id="product-list"
                                    options={productList}
                                    value={item.product_id ? productList.find((x) => x.product_id === item.product_id) : null}
                                    onChange={(e, value) => {
                                      setFieldValue(item.product_id, value);
                                      handleInputChangeSelect(value, index);
                                    }}
                                    getOptionLabel={(option) => option.name || null}
                                    sx={{
                                      width: '100%',
                                      '& .MuiOutlinedInput-root': {
                                        padding: '3px 8px!important'
                                      },
                                      '& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
                                        right: '7px!important',
                                        top: 'calc(50% - 1px)'
                                      }
                                    }}
                                    error={Boolean(touched.product_id && errors.product_id)}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="เลือกสินค้า"
                                        error={Boolean(touched.product_id && errors.product_id)}
                                      />
                                    )}
                                  />
                                  {touched.items && touched.items[index] && errors.items && errors.items[index] && (
                                    <>
                                      {touched.items[index].product_id && errors.items[index].product_id && (
                                        <FormHelperText error id="helper-text-description">
                                          {errors.items[index].product_id}
                                        </FormHelperText>
                                      )}
                                    </>
                                  )}
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
                              </TableCell>
                              <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                                {coutRowsProduct === index + 1 && (
                                  <Button
                                    size="mediam"
                                    color="info"
                                    sx={{ p: '6px 0', minWidth: '33px!important', fontSize: '24px', m: '0!important' }}
                                    onClick={() => {
                                      addItem();
                                    }}
                                  >
                                    <PlusSquareOutlined />
                                  </Button>
                                )}
                                {index !== 0 && (
                                  <Button
                                    sx={{ p: '6px 0', minWidth: '33px!important', fontSize: '24px', m: '0!important' }}
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

                    {/* รายการสินค้าจาก Navitions */}
                    {Object.keys(onSetOrder).length > 0 && (
                      <Grid item xs={12} md={6} sx={{ borderLeft: 'solid 1px ', ml: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>รหัสสินค้า</TableCell>
                              <TableCell>ชื่อสินค้า</TableCell>
                              <TableCell align="left">จำนวน (ตัน)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {onSetOrder.item_list?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Typography variant="body1" sx={item?.status === false && { color: 'red' }}>
                                    {item.No}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body1" sx={item?.status === false && { color: 'red' }}>
                                    {item.items.Description}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography variant="body1" sx={item?.status === false && { color: 'red' }}>
                                    {item.Quantity}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableBody xs={12} sx={{ '& button': { m: 1 } }}></TableBody>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Grid>
                    )}

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
