import React, { useState } from 'react';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { useSnackbar } from 'notistack';
import * as reserveRequest from '_api/reserveRequest';
import * as queueRequest from '_api/queueReques';
import * as adminRequest from '_api/adminRequest';
// import * as stepRequest from '_api/StepRequest';

import {
  Button,
  // FormHelperText, InputLabel, OutlinedInput, Stack,
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions
  // DialogContentText,
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  // DialogTitle,
} from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

// import MainCard from 'components/MainCard';
// import { SaveOutlined, RollbackOutlined, EditOutlined } from '@ant-design/icons';

// import axios from '../../../../../node_modules/axios/index';
// const apiUrl = process.env.REACT_APP_API_URL;
// import * as reserveRequest from '_api/reserveRequest';

// DateTime
import moment from 'moment';

function HistoryPopup({ startDate, endDate, data, types, title, companyData, brandData }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [txtTitle, setTxtTitle] = useState(false);

  // =============== Get order ===============//
  const [orderList, setOrderList] = useState([]);
  const getOrders = async (id) => {
    try {
      await reserveRequest.getOrderByReserveId(id).then((response) => {
        setOrderList(response);
        summaryWeight(response);
        if (types === 'orders') {
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  // =============== Get All Step by id queue ===============//
  const [stepList, setStepList] = useState([]);
  const getAllSteps = async (id) => {
    try {
      await queueRequest.getAllStepById(id).then((response) => {
        if (types === 'weight') {
          getAllAuditlog(response[0].step_id, 'U', 'weight', startDate, endDate, response[2].step_id);
          // getAllAuditlog(, 'U', "weight", startDate, endDate);
        } else if (types === 'products') {
          getAllAuditlog(response[1].step_id, 'U', 'step2', startDate, endDate);
        }

        setStepList(response);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get All product register ===============//
  const [productList, setProductList] = useState([]);
  const getProductRegister = async () => {
    try {
      adminRequest.getAllProductRegister().then((response) => {
        setProductList(response);
        // setProductList(response.filter((x) => parseFloat(x.total_remain) > 0));
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =============== Get All log ===============//
  const [auditlogList, setAuditlogList] = useState([]);
  const getAllAuditlog = async (id, action, systems, sDate, eDate, id2) => {
    try {
      await adminRequest.getAllAuditLogs(sDate, eDate).then((response) => {
        const data = response.filter((x) => x.audit_system_id === id && x.audit_action === action && x.audit_system === systems);
        if (types === 'reserves') {
          setAuditlogList(data[data.length - 1]);
        } else if (types === 'orders') {
          setAuditlogList(data);
        } else if (types === 'weight') {
          const dataWeight = response.filter(
            (x) =>
              (x.audit_system_id === id && x.audit_action === action && x.audit_system === 'step1') ||
              (x.audit_system_id === id2 && x.audit_action === action && x.audit_system === 'step3')
          );
          setAuditlogList(dataWeight);
        } else if (types === 'teams') {
          setAuditlogList(data[data.length - 1]);
        } else if (types === 'products') {
          setAuditlogList(data[data.length - 1]);
        }
        // else
        // setAuditlogList(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [teamData, setTeamData] = useState([]);
  const handleClickOpen = async () => {
    setOpen(true);
    setLoading(false);
    if (types === 'reserves') {
      setLoading(true);
      await getAllAuditlog(data.reserve_id, 'I', 'reserves', data.created_date.slice(0, 10), data.created_date.slice(0, 10));
      setLoading(false);
      setTxtTitle('ข้อมูลการจอง');
    } else if (types === 'orders') {
      setTxtTitle('ข้อมูลคำสั่งซื้อ');
      setLoading(true);
      await getAllAuditlog(data.reserve_id, 'I', 'orders', startDate, endDate);
      await getOrders(data.reserve_id);
    } else if (types === 'weight') {
      setTxtTitle('ข้อมูลน้ำหนักชั่ง');
      setLoading(true);
      await getOrders(data.reserve_id);
      await getAllSteps(data.queue_id);
    } else if (types === 'teams') {
      setTxtTitle('ข้อมูลทีมจ่ายสินค้า');
      setLoading(true);
      setTeamData(data.team_data);
      await getAllAuditlog(data.reserve_id, 'I', 'step0', startDate, endDate);
      await getOrders(data.reserve_id);
      setLoading(false);
    } else if (types === 'products') {
      setTxtTitle('ข้อมูลกองสินค้าที่จ่าย');
      setLoading(true);
      await getAllSteps(data.queue_id);
      await getProductRegister();
      await getOrders(data.reserve_id);
      setLoading(false);
    }
  };

  const handleClose = (flag) => {
    if (flag === 0) {
      setOpen(false);
      setLoading(false);
    }
  };

  // =============== Get calculateAge จำนวนวัน  ===============//
  const calculateAge = (registrationDate) => {
    if (!registrationDate) return '-';

    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const regDate = moment(registrationDate).format('YYYY-MM-DD');
    // const regDate = new Date(registrationDate);

    const years = moment(currentDate).diff(regDate, 'years');
    const months = moment(currentDate).diff(regDate, 'months') % 12;
    const days = moment(currentDate).diff(regDate, 'days') % 30;

    let result = '';

    if (years !== 0) {
      result = `${years} ปี ${months} เดือน ${days} วัน`;
    } else {
      if (months !== 0) {
        result = `${months} เดือน ${days} วัน`;
      } else {
        result = `${days} วัน`;
      }
    }

    return result;
    //return `${years} ปี ${months} เดือน ${days} วัน`;
  };

  const getWarhouseDate = (id) => {
    const proWare = productList.find((x) => x.product_register_id === id);
    const numDate = proWare?.product_register_date ? ` (${calculateAge(proWare?.product_register_date)}) ` : '-';
    const txt = proWare?.warehouse_name + ' ' + proWare?.product_register_name + ' ' + numDate;
    return txt;
  };

  const [sumWeight, setSumWeight] = useState(0);
  const summaryWeight = (data) => {
    let sum = 0;
    data.map((order) => {
      order.items.map((items) => {
        const setNumber = parseFloat(items.quantity);
        console.log(setNumber);
        console.log(typeof setNumber);
        sum = sum + setNumber;
      });
    });
    setSumWeight(parseFloat(sum).toFixed(3));
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" sx={{ backgroundColor: '#e5fffc' }}>
          <Typography variant="h5" align="center">
            {txtTitle}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ maxWidth: { xs: 'auto', md: '25vw' }, mt: 2 }}>
          {/* <DialogContentText style={{ fontFamily: 'kanit' }}>
                    </DialogContentText> */}
          {loading && (
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
              open={loading}
            >
              <CircularProgress color="primary" />
            </Backdrop>
          )}
          {/* <MainCard content={false} sx={{ p: 2 }}> */}
          {!loading && types === 'reserves' && (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h5">บริษัท/ร้านค้า : {data.company}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">วันที่เข้ารับสินค้า : {moment(data.pickup_date).format('DD/MM/YYYY')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">บริษัท (สินค้า) : {companyData?.product_company_name_th}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">ตรา (สินค้า) : {brandData?.product_brand_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">รถบรรทุก : {data.registration_no}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">คนขับรถ : {data.driver}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">เบอร์โทร : {data.mobile_no}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">เลขบัตรประชาชน : {data.id_card_no}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">เวลาที่กด : {auditlogList?.audit_datetime?.slice(11, 19) + ' น.'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Create By : {auditlogList?.firstname}</Typography>
              </Grid>
            </Grid>
          )}

          {!loading && types === 'orders' && orderList.length > 0
            ? orderList.map((order, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="h5">เลขที่คำสั่งซื้อ : {order.ref_order_id}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">วันที่สั่งซื้อ : {moment(order.order_date.slice(0, 10)).format('DD/MM/YYYY')}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      บริษัท (สินค้า) :{' '}
                      {companyData.find((x) => x.product_company_id === order.product_company_id)?.product_company_name_th}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      ตรา (สินค้า) : {brandData.find((x) => x.product_brand_id === order.product_brand_id)?.product_brand_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">รายละเอียด : {order.description ? order.description : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      เวลาที่กด : {auditlogList[index]?.audit_datetime ? auditlogList[index]?.audit_datetime?.slice(11, 19) + ' น.' : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      Create By : {auditlogList[index]?.firstname ? auditlogList[index]?.firstname : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">สูตรสินค้า</Typography>
                    {order.items.length > 0 &&
                      order.items.map((items, oItems) => (
                        <Grid container justifyContent="flex-end" spacing={1} key={oItems}>
                          <Grid item xs={6}>
                            <Typography variant="body">{items.name}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body">{items.quantity && parseFloat(items.quantity * 1).toFixed(3)} (ตัน)</Typography>
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                  {index + 1 !== orderList.length && (
                    <Grid item xs={12}>
                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 1 }} />
                    </Grid>
                  )}
                </Grid>
              ))
            : !loading &&
              types === 'orders' &&
              orderList.length === 0 && (
                <Typography variant="h5" align="center" sx={{ p: 2 }}>
                  ไม่พบข้อมูลคำสั่งซื้อ
                </Typography>
              )}

          {!loading && types === 'weight' && orderList.length > 0 ? (
            <>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  {orderList.map((order, index) => (
                    <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
                      <Grid item xs={12}>
                        <Typography variant="h5">เลขที่คำสั่งซื้อ : {order.ref_order_id}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h5">วันที่สั่งซื้อ : {order.ref_order_id}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h5">
                          บริษัท (สินค้า) :{' '}
                          {companyData.find((x) => x.product_company_id === order.product_company_id)?.product_company_name_th}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h5">
                          ตรา (สินค้า) : {brandData.find((x) => x.product_brand_id === order.product_brand_id)?.product_brand_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h5">รายละเอียด : {order.description ? order.description : '-'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h5">ข้อมูลคำสั่งซื้อ</Typography>
                        {order.items.length > 0 &&
                          order.items.map((items, oItems) => (
                            <Grid container justifyContent="flex-end" spacing={1} key={oItems}>
                              <Grid item xs={6}>
                                <Typography variant="h5">{items.name}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="h5" align="right">
                                  {items.quantity && parseFloat(items.quantity * 1).toFixed(3)} (ตัน)
                                </Typography>
                              </Grid>
                            </Grid>
                          ))}
                        <Typography variant="h5" align="right" sx={{ fontSize: 20, mt: 1 }}>
                          รวม : <span style={{ color: 'red' }}>{sumWeight ? sumWeight : '-'}</span> ตัน
                        </Typography>
                      </Grid>
                      {index < orderList.length && (
                        <Grid item xs={12}>
                          <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 1 }} />
                        </Grid>
                      )}
                    </Grid>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="h5">น้ำหนักก่อนรับสินค้า : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        <span style={{ color: 'red' }}>{parseFloat(stepList[0]?.weight1).toFixed(3)}</span> (ตัน)
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body">
                        เวลาที่ชั่งเสร็จ : {stepList[0]?.end_time ? stepList[0]?.end_time.slice(11, 19) + ' น.' : '- น.'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body">
                        สถานีขึ้นชั่ง :{' '}
                        {stepList[0]?.station_description
                          ? 'สถานีที่ ' + stepList[0]?.station_description.replace(/ชั่งเบาที่ /g, '')
                          : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body">
                        Create By : {auditlogList[0]?.firstname ? auditlogList[0]?.firstname : '-'}
                        {/* Create By : { } */}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Grid container justifyContent="flex-end" spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="h5">น้ำหนักหลังรับสินค้า : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        <span style={{ color: 'red' }}>{stepList[2]?.weight2 ? parseFloat(stepList[2]?.weight2).toFixed(3) : '-'}</span>{' '}
                        (ตัน)
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body">
                        เวลาที่ชั่งเสร็จ : {stepList[2]?.end_time ? stepList[2]?.end_time.slice(11, 19) + ' น.' : '- น.'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body">
                        สถานีขึ้นชั่ง :{' '}
                        {stepList[2]?.station_id !== 27 && stepList[2]?.station_description
                          ? 'สถานีที่ ' + stepList[2]?.station_description.replace(/ชั่งหนักที่ /g, '')
                          : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body">Create By : {auditlogList[1]?.firstname ? auditlogList[1]?.firstname : '-'}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            !loading &&
            types === 'weight' &&
            orderList.length === 0 && (
              <Typography variant="h5" align="center" sx={{ p: 2 }}>
                ไม่พบข้อมูลคำสั่งซื้อ
              </Typography>
            )
          )}

          {!loading && types === 'teams' && (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  ทีมจ่ายสินค้า : {teamData?.team_name ? teamData?.team_name.replace(/ทีมขึ้นสินค้า /g, '') : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">โกดัง : {teamData?.team_warehouse_name ? teamData?.team_warehouse_name : '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">หัวจ่าย : {data.station_name ? data.station_name : '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">สายแรงงาน : {data?.contractor_id ? data?.contractor_id : '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  หัวหน้าโกดัง :{' '}
                  {teamData &&
                    teamData.team_managers &&
                    teamData.team_managers.map((manager, index) => {
                      if (index + 1 !== teamData.team_managers.length) {
                        return manager.manager_name + ' , ';
                      } else {
                        return manager.manager_name;
                      }
                    })}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  พนักงานจ่ายสินค้า :{' '}
                  {teamData &&
                    teamData.team_checkers &&
                    teamData.team_checkers.map((checker, index) => {
                      if (index + 1 !== teamData.team_checkers.length) {
                        return checker.checker_name + ' , ';
                      } else {
                        return checker.checker_name;
                      }
                    })}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  โฟล์คลิฟท์ :{' '}
                  {teamData &&
                    teamData.team_forklifts &&
                    teamData.team_forklifts.map((forklift, index) => {
                      if (index + 1 !== teamData.team_forklifts.length) {
                        return forklift.forklift_name + ' , ';
                      } else {
                        return forklift.forklift_name;
                      }
                    })}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  เวลาที่กด : {auditlogList?.audit_datetime ? auditlogList?.audit_datetime?.slice(11, 19) + ' น.' : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Create By : {auditlogList?.firstname ? auditlogList?.firstname : '-'}</Typography>
              </Grid>
            </Grid>
          )}

          {!loading && types === 'products' && (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  เวลาที่เข้าหัว : {stepList[1]?.start_time ? stepList[1]?.start_time.slice(11, 19) + ' น.' : '- น.'}
                  {/* {teamData?.team_name ? teamData?.team_name.replace(/ทีมขึ้นสินค้า /g, '') : '-'} */}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  เวลาที่เสร็จ : {stepList[1]?.end_time ? stepList[1]?.end_time.slice(11, 19) + ' น.' : '- น.'}
                  {/* {teamData?.team_warehouse_name ? teamData?.team_warehouse_name : '-'} */}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {orderList.map((order, index) => (
                  <Grid container spacing={1} key={index}>
                    <Grid item xs={12}>
                      {order.items.length > 0 &&
                        order.items.map((items, oItems) => (
                          <Grid container justifyContent="flex-end" spacing={1} key={oItems}>
                            <Grid item xs={12}>
                              <Typography variant="h5">ข้อมูลกองสินค้า : {items.name ? items.name : '-'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="h5">จำนวน : {items?.quantity ? items?.quantity : '-'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="h5">
                                โกดัง :{' '}
                                {
                                  getWarhouseDate(items.product_register_id)
                                  // product_register_id
                                  // items.name ? items.name : '-'
                                }
                              </Typography>
                            </Grid>
                            {items.smash_quantity !== '0.0000' &&
                              items.sling_hook_quantity !== '0.0000' &&
                              items.sling_sort_quantity !== '0.0000' &&
                              items.jumbo_hook_quantity !== '0.0000' && (
                                <Grid item xs={12}>
                                  <Typography variant="h5">ประเภท :{/* {data?.contractor_id ? data?.contractor_id : '-'} */}</Typography>
                                  <Typography variant="h5">
                                    <Grid container justifyContent="flex-end" spacing={1} sx={{ p: '0 16px' }}>
                                      {items.smash_quantity !== '0.0000' && (
                                        <>
                                          <Grid item xs={6}>
                                            <Typography variant="h5">ทุบปุ๋ย</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography variant="h5" align="right">
                                              <span style={{ color: 'red' }}>{parseFloat(items.smash_quantity * 1).toFixed(3)}</span> (ตัน)
                                            </Typography>
                                          </Grid>
                                        </>
                                      )}
                                      {items.sling_hook_quantity !== '0.0000' && (
                                        <>
                                          <Grid item xs={6}>
                                            <Typography variant="h5">เกี่ยวสลิง</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography variant="h5" align="right">
                                              <span style={{ color: 'red' }}>{parseFloat(items.sling_hook_quantity * 1).toFixed(3)}</span>{' '}
                                              (ตัน)
                                            </Typography>
                                          </Grid>
                                        </>
                                      )}
                                      {items.sling_sort_quantity !== '0.0000' && (
                                        <>
                                          <Grid item xs={6}>
                                            <Typography variant="h5">เรียงสลิง</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography variant="h5" align="right">
                                              <span style={{ color: 'red' }}>{parseFloat(items.sling_sort_quantity * 1).toFixed(3)}</span>{' '}
                                              (ตัน)
                                            </Typography>
                                          </Grid>
                                        </>
                                      )}
                                      {items.jumbo_hook_quantity !== '0.0000' && (
                                        <>
                                          <Grid item xs={6}>
                                            <Typography variant="h5">เกี่ยวจัมโบ้</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography variant="h5" align="right">
                                              <span style={{ color: 'red' }}>{parseFloat(items.jumbo_hook_quantity * 1).toFixed(3)}</span>{' '}
                                              (ตัน)
                                            </Typography>
                                          </Grid>
                                        </>
                                      )}
                                    </Grid>
                                    {/* {data?.contractor_id ? data?.contractor_id : '-'} */}
                                  </Typography>
                                  {/* <Typography variant="h5">
                                    หัวหน้าโกดัง : {teamData && teamData.team_managers &&
                                        teamData.team_managers.map((manager, index) => {
                                            if (index + 1 !== teamData.team_managers.length) {
                                                return manager.manager_name + ' , ';
                                            } else {
                                                return manager.manager_name;
                                            }
                                        })
                                    }
                                </Typography> */}
                                </Grid>
                              )}
                            <Grid item xs={12}>
                              <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 1 }} />
                            </Grid>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  เวลาที่กด : {auditlogList?.audit_datetime ? auditlogList?.audit_datetime?.slice(11, 19) + ' น.' : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Create By : {auditlogList?.firstname ? auditlogList?.firstname : '-'}</Typography>
              </Grid>
            </Grid>
          )}
          {/* </MainCard> */}
        </DialogContent>

        <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2, borderTop: 'solid 1px #f6f6f6' }}>
          <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      <Tooltip title={title}>
        <span>
          <Button
            variant="contained"
            size="medium"
            color="info"
            disabled={
              (types === 'reserves' && data.status !== 'completed') ||
              (types === 'orders' && parseFloat(data.total_quantity * 1) == 0) ||
              (types === 'weight' && data.step1_status !== 'completed') ||
              (types === 'teams' && data.team_data === null) ||
              (types === 'products' && data.step2_status !== 'completed')
            }
            // sx={{ minWidth: '33px!important', p: '6px 0px' }}
            onClick={() => handleClickOpen(data)}
          >
            รายละเอียด
          </Button>
        </span>
      </Tooltip>
    </>
  );
}

export default HistoryPopup;
