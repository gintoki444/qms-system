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
          // console.log('setReservationData', result);
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
          setOnSetOrderNew([
            {
              product_brand_id: result.product_brand_id,
              itemsList: [{ product_id: '', quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate }]
            }
          ]);
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
  // const getProduct = async (idCom, idBrand) => {
  //   try {
  //     reserveRequest.getProductByIdComAndBrandId(idCom, idBrand).then((response) => {
  //       setProductList(response);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // แก้ไข getProduct ให้เก็บข้อมูลแบบแยกตาม product_brand_id
  const getProduct = async (idCom, idBrand) => {
    try {
      const response = await reserveRequest.getProductByIdComAndBrandId(idCom, idBrand);
      if (Array.isArray(response)) {
        setProductList((prevList) => {
          let dataPrevList = [...prevList];
          response.forEach((item) => {
            item.product_brand_id = idBrand;

            // ตรวจสอบว่ามีข้อมูลซ้ำใน dataPrevList หรือไม่
            const isDuplicate = dataPrevList.some(
              (existingItem) => existingItem.product_id === item.product_id && existingItem.product_brand_id === idBrand
            );

            // ถ้าไม่มีข้อมูลซ้ำ ให้เพิ่ม item เข้าไปใน dataPrevList
            if (!isDuplicate) {
              dataPrevList.push(item);
            }
          });
          console.log('dataPrevList :', dataPrevList);
          return dataPrevList;
        });
        console.log('response', response);

        return response; // ส่งคืน response กลับไปให้ผู้เรียก
      } else {
        console.error(`Error: Response is not an array. Received:`, response);
        return []; // ส่งคืน array เปล่าเพื่อหลีกเลี่ยงข้อผิดพลาด
      }
    } catch (error) {
      console.log(error);
      return []; // ส่งคืน array เปล่าเพื่อหลีกเลี่ยงข้อผิดพลาด
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
    setOnSetOrderNew([
      {
        product_brand_id: e.target.value,
        itemsList: [{ product_id: '', quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate }]
      }
    ]);
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
  // function createOrder(data) {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       // คำนวณ grandTotalQuantity จาก onSetOrderNew
  //       const grandTotalQuantity = onSetOrderNew.reduce((grandTotal, order) => {
  //         // รวม quantity ใน itemsList ของ product_brand_id แต่ละตัว
  //         const totalForProductBrand = order.itemsList.reduce((acc, item) => {
  //           return acc + parseFloat(item.quantity);
  //         }, 0);
  //         console.log('totalForProductBrand:', totalForProductBrand);

  //         // รวมค่า totalForProductBrand เข้าไปใน grandTotal
  //         return totalForProductBrand;
  //       }, 0);

  //       console.log('grandTotalQuantity:', grandTotalQuantity);

  //       if (items.length === 0) {
  //         // alert('กรุณาเพิ่มข้อมูล : items.length = 0');
  //         enqueueSnackbar('กรุณาเพิ่มข้อมูลสินค้า', { variant: 'warning' });
  //         return;
  //       }

  //       var raw = {
  //         reserve_id: id,
  //         ref_order_id: data.ref_order_id,
  //         company_id: reservationData.company_id,
  //         description: data.description,
  //         order_date: data.order_date,
  //         total_amount: grandTotalQuantity,
  //         product_company_id: data.product_company_id,
  //         product_brand_id: data.product_brand_id,
  //         created_at: currentDate,
  //         updated_at: currentDate,
  //         items: data.items
  //       };

  //       console.log('createOrder :', raw);
  //       // if (id === 99999) {
  //       try {
  //         reserveRequest.postCreateOrder(raw)
  //         .then((response) => {
  //           if (response.status === 'ok') {
  //             updateReserveTotal();
  //             resolve(response.status);
  //           }
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //       // }
  //     }, 500);
  //   });
  // }
  // แยกการทำงาน async ออกมาเป็นฟังก์ชัน
  async function processCreateOrder(data) {
    if (onSetOrderNew.length === 0) {
      enqueueSnackbar('กรุณาเพิ่มข้อมูลสินค้า', { variant: 'warning' });
      throw new Error('ไม่มีข้อมูลใน onSetOrderNew');
    }

    // ลูปผ่านแต่ละรายการใน onSetOrderNew เพื่อสร้างข้อมูลสำหรับการบันทึก
    // for (const order of onSetOrderNew) {
    // const { product_brand_id, itemsList } = data.items;

    // คำนวณ grandTotalQuantity จาก itemsList ของแต่ละ order
    const totalForProductBrand = data.items.reduce((acc, item) => {
      return acc + parseFloat(item.quantity);
    }, 0);

    // สร้างข้อมูลสำหรับการส่งไปยัง API
    const raw = {
      reserve_id: id,
      ref_order_id: data.ref_order_id,
      company_id: reservationData.company_id,
      description: data.description,
      order_date: data.order_date,
      total_amount: totalForProductBrand,
      product_company_id: data.product_company_id,
      product_brand_id: data.product_brand_id,
      created_at: currentDate,
      updated_at: currentDate,
      items: data.items
    };

    // console.log('createOrder :', raw);

    // ส่งข้อมูลไปยัง API ด้วย postCreateOrder
    const response = await reserveRequest.postCreateOrder(raw);
    if (response.status !== 'ok') {
      enqueueSnackbar('เกิดข้อผิดพลาดในการสร้าง Order', { variant: 'error' });
      throw new Error(`สร้าง Order ล้มเหลว: ${response.message}`);
    }
    // }

    // เมื่อสร้าง order สำเร็จทุกคำขอ
    updateReserveTotal();
    return 'สร้าง Order สำเร็จ';
  }

  // แก้ไขฟังก์ชัน createOrder โดยไม่ใช้ async ภายใน Promise
  function createOrder(data) {
    return new Promise((resolve, reject) => {
      processCreateOrder(data)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  const updateReserveTotal = () => {
    try {
      reserveRequest.getReserTotalByID(id).then(() => {
        // console.log(response);
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
      setLoading(true); // เปิดการแสดง Loading
      // ตรวจสอบข้อมูลใน onSetOrderNew
      for (const order of onSetOrderNew) {
        const { itemsList } = order;

        // ตรวจสอบว่า product_id ต้องไม่เป็นค่าว่าง
        const invalidProducts = itemsList.filter((item) => !item.product_id);
        if (invalidProducts.length > 0) {
          enqueueSnackbar('กรุณาเพิ่มข้อมูลสินค้าให้ครบถ้วน', { variant: 'warning' });
          setErrors(true);
          setSubmitting(false);
          setLoading(false);
          return; // ออกจากฟังก์ชัน
        }

        // ตรวจสอบว่า quantity ต้องมีค่ามากกว่า 0
        const invalidQuantity = itemsList.filter((item) => item.quantity <= 0);
        if (invalidQuantity.length > 0) {
          enqueueSnackbar('กรุณาระบุจำนวนสินค้าให้มากกว่า 0 ตัน', { variant: 'warning' });
          setErrors(true);
          setSubmitting(false);
          setLoading(false);
          return; // ออกจากฟังก์ชัน
        }

        // ตรวจสอบว่า quantity ไม่มากกว่า subtotal
        const invalidSubtotal = itemsList.filter((item) => item.subtotal > 0 && item.quantity > item.subtotal);
        if (invalidSubtotal.length > 0) {
          const { quantity } = invalidSubtotal[0]; // ดึง quantity ที่มีปัญหาออกมาแสดง
          enqueueSnackbar(`จำนวนสินค้ามีจำนวนมากกว่า จำนวนที่จอง : ${quantity}`, { variant: 'warning' });
          setErrors(true);
          setSubmitting(false);
          setLoading(false);
          return; // ออกจากฟังก์ชัน
        }
      }

      // ถ้าข้อมูลครบถ้วน
      for (const order of onSetOrderNew) {
        const { product_brand_id, itemsList } = order;

        // แทนค่าใน values
        values.product_brand_id = product_brand_id;
        values.items = itemsList;
        // if (order === 99999) {
        // บันทึกข้อมูล
        await createOrder(values);
        // }
      }

      const data = {
        audit_user_id: userId,
        audit_action: 'I',
        audit_system_id: id,
        audit_system: 'orders',
        audit_screen: `เพิ่มข้อมูลคำสั่งซื้อ : ${values.ref_order_id} `,
        audit_description: JSON.stringify(onSetOrder)
      };
      // console.log('AddAuditLogs :', data);
      // เพิ่มการบันทึก Log ถ้าจำเป็น
      // if (order === 99999) {
      AddAuditLogs(data);
      // ถ้าบันทึกข้อมูลสำเร็จ
      enqueueSnackbar('บันทึกข้อมูลสำเร็จ', { variant: 'success' });
      setSubmitting(false);
      setLoading(false);
      // }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('เกิดข้อผิดพลาดในการบันทึกข้อมูล', { variant: 'error' });
      setErrors(true);
      setSubmitting(false);
      setLoading(false);
    }
  };

  // const handleSubmits = async (values, { setErrors, setSubmitting }) => {
  //   try {
  //     setLoading(true); // ปิดการแสดง Loading เมื่อข้อมูลทั้งหมดถูกโหลดเสร็จ
  //     let coutItemId = 0;
  //     let coutItemsTotal = 0;
  //     items.map((x) => {
  //       if (x.product_id) {
  //         coutItemId = coutItemId + 1;
  //         if (x.quantity <= 0) {
  //           coutItemsTotal = coutItemsTotal + 1;
  //         }
  //       }
  //     });

  //     if (coutItemsTotal !== 0) {
  //       setErrors(false);
  //       setSubmitting(false);
  //       enqueueSnackbar('กรุณาระบุจำนวนสินค้าให้มากกว่า 0 ตัน', { variant: 'warning' });

  //       return;
  //     }

  //     if (items.length !== coutItemId) {
  //       setErrors(false);
  //       setSubmitting(false);
  //       // alert('กรุณาเพิ่มข้อมูลสินค้าให้ครบถ้วน');
  //       enqueueSnackbar('กรุณาเพิ่มข้อมูลสินค้าให้ครบถ้วน', { variant: 'warning' });
  //       return;
  //     }

  //     if (!values.product_brand_id || !values.product_company_id) {
  //       setErrors(false);
  //       setSubmitting(false);
  //       // alert('ระบุบริษัท(สินค้า)/ตรา(สินค้า)');
  //       enqueueSnackbar('ระบุบริษัท(สินค้า)/ตรา(สินค้า)', { variant: 'warning' });
  //       return;
  //     }

  //     console.log('values', values);

  //     if (values === 999) {
  //       await createOrder(values);
  //       // if (values === 999) {
  //       const data = {
  //         audit_user_id: userId,
  //         audit_action: 'I',
  //         audit_system_id: id,
  //         audit_system: 'orders',
  //         audit_screen: `เพิ่มข้อมูลคำสั่งซื้อ : ${values.ref_order_id} `,
  //         audit_description: JSON.stringify(onSetOrder)
  //       };
  //       AddAuditLogs(data);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // =============== เลือกสินค้า ===============//
  const handleInputChange = (e, index, product_brand_id) => {
    const { value } = e.target; // ดึงค่าใหม่จาก TextField
    const updatedValue = parseFloat(value); // แปลงค่าจาก string เป็น number

    // อัปเดตค่าของ onSetOrderNew
    setOnSetOrderNew((prevOrder) => {
      // คัดลอกค่าของ onSetOrderNew ทั้งหมด
      const updatedOrder = [...prevOrder];

      // ค้นหารายการที่มี product_brand_id ที่ต้องการ
      const orderIndex = updatedOrder.findIndex((order) => order.product_brand_id === product_brand_id);

      if (orderIndex !== -1) {
        // อัปเดตค่า quantity ใน itemsList ที่ตำแหน่งที่ต้องการ (index)
        updatedOrder[orderIndex].itemsList[index].quantity = updatedValue > 0 ? updatedValue : 0;
      }

      return updatedOrder; // คืนค่าใหม่ของ onSetOrderNew
    });
  };

  const handleInputChangeSelect = (value, index, product_brand_id) => {
    setOnSetOrderNew((prevOrder) => {
      // คัดลอกค่าของ onSetOrderNew ทั้งหมด
      const updatedOrder = [...prevOrder];

      // ค้นหารายการที่มี product_brand_id ที่ต้องการ
      const orderIndex = updatedOrder.findIndex((order) => order.product_brand_id === product_brand_id);

      if (orderIndex !== -1) {
        // อัปเดตค่า product_id ใน itemsList ที่ตำแหน่งที่ต้องการ (index)
        updatedOrder[orderIndex].itemsList[index].product_id = value ? value.product_id : null;
      }

      return updatedOrder; // คืนค่าใหม่ของ onSetOrderNew
    });
  };

  // const handleInputChangeSelect = (e, index) => {
  //   const updatedItems = [...items];

  //   if (e !== null) {
  //     const { product_id } = e;
  //     updatedItems[index]['product_id'] = product_id;
  //   } else {
  //     updatedItems[index]['product_id'] = e;
  //   }

  //   setItems(updatedItems);
  //   initialValue.items = items;
  // };

  // =============== เพิ่ม-ลบรา รายการสินค้า ===============//
  const [coutRowsProduct, setCoutRowsProduct] = useState(1);
  const addItem = (product_brand_id) => {
    // คัดลอก onSetOrderNew เพื่อหลีกเลี่ยงการแก้ไขข้อมูลต้นฉบับโดยตรง
    const updatedOrder = [...onSetOrderNew];

    // ค้นหาว่า orderNav ที่ต้องการเพิ่มสินค้าเข้าไปนั้นมีอยู่ใน onSetOrderNew แล้วหรือยัง
    const orderIndex = updatedOrder.findIndex((order) => order.product_brand_id === product_brand_id);

    // ถ้าพบรายการที่ต้องการเพิ่ม
    if (orderIndex !== -1) {
      // เพิ่ม newItem เข้าไปใน itemsList ของ product_brand_id นั้น ๆ
      const newItem = {
        product_id: null,
        quantity: 1,
        subtotal: 0,
        created_at: currentDate,
        updated_at: currentDate
      };
      updatedOrder[orderIndex].itemsList.push(newItem);
    } else {
      // ถ้าไม่พบรายการ product_brand_id นั้นใน onSetOrderNew ให้เพิ่มใหม่
      updatedOrder.push({
        product_brand_id,
        itemsList: [
          {
            product_id: null,
            quantity: 1,
            subtotal: 0,
            created_at: currentDate,
            updated_at: currentDate
          }
        ]
      });
    }

    // อัปเดต state ใหม่
    setOnSetOrderNew(updatedOrder);
  };

  const removeItem = (product_brand_id, index) => {
    // คัดลอก onSetOrderNew เพื่อหลีกเลี่ยงการแก้ไขข้อมูลต้นฉบับโดยตรง
    const updatedOrder = [...onSetOrderNew];

    // ค้นหาว่า orderNav ที่ต้องการลบสินค้านั้นมีอยู่ใน onSetOrderNew หรือไม่
    const orderIndex = updatedOrder.findIndex((order) => order.product_brand_id === product_brand_id);

    // ถ้าพบรายการที่ต้องการลบ
    if (orderIndex !== -1) {
      const items = updatedOrder[orderIndex].itemsList;

      // ถ้ามี item มากกว่า 1 ตัวในรายการนั้น ก็ทำการลบตัวที่ต้องการ
      if (items.length > 1) {
        items.splice(index, 1);
      } else {
        // ถ้ามี item แค่ตัวเดียว ก็ลบทั้งรายการ product_brand_id ออกจาก onSetOrderNew
        updatedOrder.splice(orderIndex, 1);
      }

      // อัปเดต state ใหม่
      setOnSetOrderNew(updatedOrder);
    }
  };

  // const addItem = () => {
  //   items.push({ product_id: '', quantity: 1, subtotal: sutotal, created_at: currentDate, updated_at: currentDate });
  //   setCoutRowsProduct(coutRowsProduct + 1);
  //   initialValue.items = items;
  // };

  // const removeItem = (index) => {
  //   setCoutRowsProduct(coutRowsProduct - 1);
  //   const updatedItems = [...items];
  //   updatedItems.splice(index, 1);

  //   setItems(updatedItems);
  // };

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
  const [onSetOrderNew, setOnSetOrderNew] = useState([]);
  // const handleOnSetOrder = (data) => {
  //   let itemList = [];
  //   if (data) {
  //     data.item_list.map((item) => {
  //       if (item.items.Detial !== undefined && productList.filter((x) => x.product_id === item.items.Detial.product_id).length > 0) {
  //         const newItem = {
  //           product_id: item.items.Detial.product_id,
  //           quantity: item.Quantity,
  //           subtotal: sutotal,
  //           created_at: currentDate,
  //           updated_at: currentDate
  //         };
  //         console.log('newItem', newItem);
  //         itemList.push(newItem);
  //       } else {
  //         item.status = false;
  //       }
  //       return item;
  //     });
  //     setOnSetOrder(data);
  //     setItems(itemList);
  //     console.log(onSetOrder);
  //   }
  // };
  const handleOnSetOrder = async (data) => {
    let itemList = [];
    let groupedData = {}; // เก็บข้อมูลที่จัดกลุ่มตาม CommonName
    let orderNavList = []; // เก็บรายการ orderNav ที่สร้างขึ้น

    if (data && data.item_list) {
      // 1. จัดกลุ่มตาม CommonName
      groupedData = data.item_list.reduce((acc, currentItem) => {
        const commonName = currentItem.CommonName;

        if (!acc[commonName]) {
          acc[commonName] = [];
        }
        acc[commonName].push(currentItem);
        return acc;
      }, {});

      // 2. วนลูปตามกลุ่มที่ได้จากการจัดกลุ่ม
      for (let commonName of Object.keys(groupedData)) {
        const itemsInGroup = groupedData[commonName];

        // 3. ค้นหาใน productBrand ว่ามี product_brand_name ตรงกับ commonName หรือไม่
        const filteredBrand = productBrand.filter((x) => x.product_brand_name === commonName);

        // 4. ถ้า length > 0 ให้ทำการดึง productList ด้วย getProduct
        if (filteredBrand.length > 0) {
          const brand = filteredBrand[0];

          // ดึง productList โดยใช้ getProduct แบบ async/await
          const productListForBrand = await getProduct(selectIdCom, brand.product_brand_id);

          // ตรวจสอบว่าค่า productListForBrand มีค่าเป็น array หรือไม่
          if (Array.isArray(productListForBrand)) {
            // สร้าง orderNav สำหรับ brand นั้น ๆ
            let orderNav = {
              product_brand_id: brand.product_brand_id,
              itemsList: []
            };

            // เพิ่มข้อมูล items ใน orderNav
            itemsInGroup.forEach((item) => {
              const isProductAvailable = productListForBrand.some((y) => {
                return item.items?.Detial?.product_id && y.product_id === item.items.Detial.product_id;
              });
              if (item.items.Detial !== undefined && isProductAvailable) {
                const newItem = {
                  product_id: item.items.Detial.product_id,
                  quantity: item.Quantity,
                  subtotal: item.Quantity, // แทนที่ด้วยสูตรคำนวณจริง
                  created_at: currentDate,
                  updated_at: currentDate
                };
                orderNav.itemsList.push(newItem);
              } else {
                const foundInData2 = productListForBrand.find((data2Item) => {
                  return data2Item.product_brand_id === brand.product_brand_id && item.items.Description.includes(data2Item.name);
                });

                // console.log('foundInData2:', foundInData2);
                const newItem = {
                  product_id: foundInData2 ? foundInData2.product_id : '',
                  quantity: item.Quantity ? item.Quantity : 1,
                  subtotal: item.Quantity ? item.Quantity : 0, // แทนที่ด้วยสูตรคำนวณจริง
                  created_at: currentDate,
                  updated_at: currentDate
                };
                orderNav.itemsList.push(newItem);
              }
            });

            // เพิ่ม orderNav ลงใน orderNavList
            orderNavList.push(orderNav);
          } else {
            console.error(`Error: productListForBrand is not an array. Received:`, productListForBrand);
          }
        }
      }

      // 5. เพิ่มรายการที่ผ่านการกรองแล้วลงใน itemList
      data.item_list.map((item) => {
        // ค้นหาใน productList ที่ดึงมาใหม่ในขั้นตอนข้างบน
        const filteredBrand = productBrand.filter((x) => x.product_brand_name === item.CommonName);
        if (filteredBrand.length > 0) {
          const brand = filteredBrand[0];
          item.product_brand_id = brand.product_brand_id;
          // console.log('add brand:', item.product_brand_id);
        }

        if (
          item.items.Detial !== undefined &&
          orderNavList.some((orderNav) => orderNav.itemsList.some((product) => product.product_id === item.items.Detial.product_id))
        ) {
          const newItem = {
            product_id: item.items.Detial.product_id,
            quantity: item.Quantity,
            subtotal: item.Quantity * 50, // แทนที่ด้วยสูตรคำนวณจริง
            created_at: currentDate,
            updated_at: currentDate
          };
          itemList.push(newItem);
        } else {
          item.status = false;
        }
        return item;
      });

      // 6. เก็บข้อมูลที่ได้ลง state
      setOnSetOrder(data);
      setItems(itemList);
      setOnSetOrderNew(orderNavList);
      // groupedData;
      // console.log('groupedData', groupedData);
      // console.log('onSetOrder', data);
      // console.log('orderNavList', orderNavList); // ดูผลลัพธ์ของ orderNavList                         ท
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
                    {/* <Grid item xs={12}>
                      <Typography variant="h2">แบบใหม่</Typography>
                    </Grid> */}
                    {onSetOrderNew.length > 0 &&
                      onSetOrderNew.map((orderItem) => (
                        <>
                          <Grid item xs={12} md={12}>
                            <Typography variant="h4">
                              {'ตราสินค้า : ' +
                                productBrand.find((x) => x.product_brand_id === orderItem.product_brand_id)?.product_brand_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={5} sx={{ pt: '0!important' }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>สินค้า</TableCell>
                                  <TableCell align="left">จำนวน (ตัน)</TableCell>
                                  <TableCell align="center">Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {orderItem?.itemsList &&
                                  Array.isArray(orderItem.itemsList) &&
                                  orderItem.itemsList.length > 0 &&
                                  orderItem.itemsList.map(
                                    (
                                      item,
                                      index // แก้ไขจาก itemList เป็น itemsList
                                    ) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                                            <Autocomplete
                                              disablePortal
                                              id="product-list"
                                              options={productList.filter((x) => x.product_brand_id === orderItem.product_brand_id)}
                                              value={item.product_id ? productList.find((x) => x.product_id === item.product_id) : null}
                                              onChange={(e, value) => {
                                                handleInputChangeSelect(value, index, orderItem.product_brand_id); // เพิ่ม product_brand_id
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
                                        {/* <TableCell>
                                          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                                            <Autocomplete
                                              disablePortal
                                              id="product-list"
                                              options={productList.filter((x) => x.product_brand_id === orderItem.product_brand_id)}
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
                                        </TableCell> */}
                                        <TableCell>
                                          <TextField
                                            required
                                            value={item.quantity}
                                            onChange={(e) => handleInputChange(e, index, orderItem.product_brand_id)} // เพิ่ม product_brand_id เพื่ออ้างอิงในฟังก์ชัน
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

                                          {/* <TextField
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
                                          )} */}
                                        </TableCell>
                                        <TableCell align="center" sx={{ '& button': { m: 1 } }}>
                                          {coutRowsProduct === index + 1 && (
                                            <Button
                                              size="mediam"
                                              color="info"
                                              sx={{ p: '6px 0', minWidth: '33px!important', fontSize: '24px', m: '0!important' }}
                                              onClick={() => addItem(orderItem.product_brand_id)} // เพิ่ม orderItem.product_brand_id ในการเรียกใช้
                                            >
                                              <PlusSquareOutlined />
                                            </Button>
                                          )}
                                          {index !== 0 && (
                                            <Button
                                              sx={{ p: '6px 0', minWidth: '33px!important', fontSize: '24px', m: '0!important' }}
                                              onClick={() => removeItem(orderItem.product_brand_id, index)} // เพิ่ม orderItem.product_brand_id ในการเรียกใช้
                                              size="mediam"
                                              color="error"
                                            >
                                              <MinusSquareOutlined />
                                            </Button>
                                          )}
                                        </TableCell>

                                        {/* <TableCell align="center" sx={{ '& button': { m: 1 } }}>
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
                                        </TableCell> */}
                                      </TableRow>
                                    )
                                  )}
                                <TableRow>
                                  <TableBody xs={12} sx={{ '& button': { m: 1 } }}></TableBody>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Grid>

                          {/* รายการสินค้าจาก Navitions */}
                          {Object.keys(onSetOrder).length > 0 && (
                            <Grid item xs={12} md={5} sx={{ borderLeft: 'solid 1px ', ml: 2 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>รหัสสินค้า</TableCell>
                                    <TableCell>ชื่อสินค้า</TableCell>
                                    <TableCell align="left">จำนวน (ตัน)</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {onSetOrder.item_list?.map(
                                    (item, index) =>
                                      item.product_brand_id === orderItem.product_brand_id && (
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
                                      )
                                  )}
                                  <TableRow>
                                    <TableBody xs={12} sx={{ '& button': { m: 1 } }}></TableBody>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Grid>
                          )}
                        </>
                      ))}
                    {/* <Grid item xs={12}>
                      <Typography variant="h2">แบบเก่า</Typography>
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
                    </Grid>*/}

                    {/* รายการสินค้าจาก Navitions 
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
                    )} */}

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
