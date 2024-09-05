import React, { useState, useEffect } from 'react';

import {
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  Tooltip,
  ButtonGroup,
  Checkbox,
  // Autocomplete,
  RadioGroup,
  Radio,
  FormControlLabel,
  OutlinedInput
} from '@mui/material';
import MainCard from 'components/MainCard';

// Link api queues
import * as adminRequest from '_api/adminRequest';
import * as getQueues from '_api/queueReques';
import * as stepRequest from '_api/StepRequest';
import * as reserveRequest from '_api/reserveRequest';
const apiUrl = process.env.REACT_APP_API_URL;

import CircularProgress from '@mui/material/CircularProgress';
import { RightSquareOutlined, SoundOutlined } from '@ant-design/icons';
import moment from 'moment/min/moment-with-locales';
import QueueTag from 'components/@extended/QueueTag';

// Sound Call
import SoundCall from 'components/@extended/SoundCall';
// import { Stack } from '../../../../node_modules/@mui/material/index';

import * as functionCancleTeam from 'components/Function/CancleTeamStation';
import * as functionAddLogs from 'components/Function/AddLog';

export const Step2Table = ({ status, title, onStatusChange, onFilter, permission }) => {
  // ==============================|| ORDER TABLE - HEADER ||============================== //
  const headCells = [
    {
      id: 'queueNo',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'ลำดับ'
    },
    {
      id: 'pickerDate',
      align: 'left',
      disablePadding: false,
      width: '8%',
      label: 'วันที่เข้ารับสินค้า'
    },
    {
      id: 'queueID',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'หมายเลขคิว'
    },
    {
      id: 'remarkQueue',
      align: 'center',
      disablePadding: false,
      // width: '5%',
      label: 'รหัสคิวเดิม'
    },
    {
      id: 'registration_no',
      align: 'center',
      disablePadding: true,
      width: '10%',
      label: 'ทะเบียนรถ'
    },
    {
      id: 'station',
      align: 'left',
      disablePadding: true,
      width: '170px',
      label: 'สถานีบริการ'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'driver',
      align: 'left',
      disablePadding: true,
      width: '13%',
      label: 'ชื่อผู้ขับ'
    },
    {
      id: 'tel',
      align: 'left',
      disablePadding: true,
      width: '10%',
      label: 'เบอร์โทรศัพท์'
    },
    {
      id: 'times',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'เวลาเริ่ม'
    },
    {
      id: 'reacallTitle',
      align: 'center',
      disablePadding: false,
      label: 'ทวนสอบ'
    },
    {
      id: 'selectedStation',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'สถานะ'
    },
    {
      id: 'statusTitle',
      align: 'center',
      disablePadding: false,
      label: 'หัวจ่าย'
    },
    {
      id: 'soundCall',
      align: 'center',
      disablePadding: true,
      label: 'เรียกคิว'
    },
    {
      id: 'action',
      align: 'right',
      disablePadding: false,
      width: '120px',
      label: 'Actions'
    }
  ];

  function QueueTableHead() {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <>
              {(status === 'waiting' && headCell.id === 'soundCall') || (status === 'processing' && headCell.id === 'statusTitle') || (
                <TableCell
                  key={headCell.id}
                  align={headCell.align}
                  width={headCell.width}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  {headCell.label}
                </TableCell>
              )}
            </>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const userId = localStorage.getItem('user_id');
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [open, setOpen] = useState(false);
  const [id_update, setUpdate] = useState(0);
  const [id_update_next, setUpdateNext] = useState(0);
  const [fr, setFrom] = useState('');
  const [textnotify, setText] = useState('');
  const [station_count, setStationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [onclickSubmit, setOnClickSubmit] = useState(false);
  const [message, setMessage] = useState('');

  //เพิ่ม function get จำนวนสถานีของ step 1
  const station_num = 20;
  const [station_id, setStationId] = useState(0);

  const [loopSelect, setLoopSelect] = useState([]);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 120000); // Polling every 5 seconds

    return () => clearInterval(intervalId);
  }, [
    status,
    onStatusChange,
    onFilter,
    //  loopSelect,
    permission
  ]);

  const fetchData = async () => {
    try {
      console.log('fetchData');
      getWarehouses();
      getAllContractor();
      getProductRegisters();
      getAllItemsRegis();
      // Use different API functions based on the status
      if (status === 'waiting') {
        await waitingGet();
      } else if (status === 'processing') {
        await processingGet();
        await getStepCount(2, 'processing');
      }
      // await getStation();
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    getStation();
  }, []);
  const waitingGet = async () => {
    try {
      await getQueues.getStep2Waitting().then((response) => {
        if (onFilter == 0) {
          setItems(response.filter((x) => x.team_id !== null && x.reserve_station_id !== 1));
        } else {
          setItems(response.filter((x) => x.product_company_id == onFilter && x.team_id !== null && x.reserve_station_id !== 1) || []);
        }
        cleckStations();
      });
    } catch (e) {
      console.log(e);
    }
  };

  const processingGet = async () => {
    try {
      getQueues.getStep2Processing().then((response) => {
        setItems(response);
        setItems2(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const cleckStations = async () => {
    try {
      getQueues.getStep2Processing().then((response) => {
        setItems2(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getStation = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise((resolve, reject) => {
      fetch(apiUrl + '/allstations', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log('allstations', result);
          setStations(result.filter((x) => x.station_group_id === 3));
          resolve(); // ส่งคืนเมื่อการเรียก API เสร็จสมบูรณ์
        })
        .catch((error) => {
          console.error(error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  const getStepCount = async (step_order, step_status) => {
    await stepRequest.getStepCountByIdStatus(step_order, step_status).then((response) => {
      console.log('getStepCountByIdStatus:', response);
      if (response.length > 0) response.map((result) => setStationCount(result.step_count));
    });
  };

  const getStepId = (steps_order, queues_id) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + '/stepbyqueueid/' + steps_order + '/' + queues_id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUpdateNext(result[0]['step_id']);
      })
      .catch((error) => console.log('error', error));
  };

  //Update ทีมขึ้นสินค้าสำหรับ step2
  // const updateLoadingTeam = (step_id) => {
  //   return new Promise((resolve, reject) => {
  //     const myHeaders = new Headers();
  //     myHeaders.append('Content-Type', 'application/json');

  //     const raw = JSON.stringify({
  //       team_id: teamId,
  //       contractor_id: contractorId,
  //       labor_line_id: labor_line_id
  //     });

  //     // updateTeamLoading(queues.reserve_id, teamValue);
  //     // updateTeamData(queues.reserve_id, teamData);

  //     const requestOptions = {
  //       method: 'PUT',
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: 'follow'
  //     };

  //     fetch(apiUrl + '/updateloadigteam/' + step_id, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         if (result['status'] === 'ok') {
  //           resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
  //         } else {
  //           reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
  //       });
  //   });
  // };
  const updateLoadingTeams = (step_ids) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        team_id: teamId,
        step_ids: step_ids
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updateloadingteams', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            // console.log('updateLoadingTeam is ok');
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            // console.log('not update LoadingTeam');
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  //Update สถานะคิวที่ให้บริการ
  const step1Update = async (step_id, statusupdate, stations_id) => {
    const newCurrentDate = await stepRequest.getCurrentDate();
    return new Promise((resolve, reject) => {
      if (stations_id === '') {
        setLoading(false);
        alert('กรุณาเลือกหัวจ่าย');
        return;
      } else {
        if (fr === 'call') {
          // ตัวเลขที่ต้องการค้นหา stations_id ที่เลือกไปแล้ว
          const foundItem = items2.find((item) => item.station_id === stations_id);

          if (foundItem) {
            // พบ item ที่มี station_id ที่ต้องการ
            setLoading(false);
            alert("หัวจ่าย '" + foundItem.station_description + "' ไม่ว่าง");
            return;
          } else {
            // การใช้งาน Line Notify

            getStepToken(step_id)
              .then(({ queue_id, token }) => {
                lineNotify(queue_id, token);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }
        }
      }
      // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      // console.log('newCurrentDate :', newCurrentDate);

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        status: statusupdate,
        station_id: stations_id,
        updated_at: newCurrentDate
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      // if (newCurrentDate === 99999) {
      fetch(apiUrl + '/updatestepstatus/' + step_id, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result['status'] === 'ok') {
            await getStepCount(2, 'processing');
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((error) => {
          reject(error);
        });
      // }
    });
  };

  //Update ข้อมูลรอเรียกคิวสถานีถัดไป
  // const step2Update = (step_id, statusupdate, station_id) => {
  //   return new Promise((resolve, reject) => {
  //     const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  //     var myHeaders = new Headers();
  //     myHeaders.append('Content-Type', 'application/json');

  //     var raw = JSON.stringify({
  //       status: statusupdate,
  //       station_id: station_id,
  //       updated_at: currentDate
  //     });

  //     var requestOptions = {
  //       method: 'PUT',
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: 'follow'
  //     };

  //     fetch(apiUrl + '/updatestepstatus/' + step_id, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         if (result['status'] === 'ok') {
  //           resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
  //         } else {
  //           reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('error', error);
  //         reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
  //       });
  //   });
  // };

  const updateMultipleStepStatus = (updates) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({ updates });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updatemultiplestepstatus', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            // console.log('updateMultipleStepStatus is ok');

            //alert("Update multiplestepstatus");
            waitingGet();
            processingGet();
            getStepCount(2, 'processing');
            setLoading(false);

            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            // console.log('not update MultipleStepStatus');
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  //Update start_time of step
  const [queues, setQueues] = useState([]);
  const updateStartTime = async (step_id) => {
    const currentDate = await stepRequest.getCurrentDate();
    // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        start_time: currentDate
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updatestarttime/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }

          fetchData();
          onStatusChange(status === 'waiting' ? 'processing' : 'waiting');
          setSaveLoading(false);
        })
        .catch((error) => console.error(error));
    });
  };

  //Update start_time of step
  const updateEndTime = async (step_id) => {
    //alert("updateEndTime")
    const currentDate = await stepRequest.getCurrentDate();
    // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        start_time: currentDate
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updateendtime/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  // =============== Get Reserve ===============//
  const [reservesData, setReservesData] = useState([]);
  const getReserveId = async (id) => {
    stepRequest.getReserveById(id).then((response) => {
      if (response) {
        console.log('getReserveId :', response);
        response?.reserve.map((result) => {
          getStationById(result.warehouse_id);
          getTeamloadingByIdwh(result.warehouse_id);

          if (result.contractor_id) {
            getLaborLine(result.contractor_id);
          }

          if (result.team_id !== null) {
            // if (result.team_data === null || result.team_data.team_id === null) {
            //   getTeamloadingByIds(result.team_id);
            // } else if (result.team_data.team_data && result.team_data.team_data.team_id === null) {
            //   getTeamloadingByIds(result.team_id);
            // }
            if (result.team_data) {
              getTeamloadingByIds(result.team_id);
            } else if (result.team_data.length > 0) {
              // setTeamData(result.team_data);

              // console.log('result.team_data :', result.team_data);

              // if (result.team_data === 999) {
              const combinedData = [
                ...result.team_data.team_managers,
                ...result.team_data.team_checkers,
                ...result.team_data.team_forklifts
              ];
              setTeamLoading(combinedData);
              // }
            }
          }
          setReservesData(result);
          setWareHouseId(result.warehouse_id);
          setStationsId(result.reserve_station_id);
          setTeamId(result.team_id);
          setcontractorId(result.contractor_id);
          setLaborLineId(result.labor_line_id);
        });
      }
    });
  };

  // =============== Get Order Product ===============//
  const [orders, setOrders] = useState([]);
  // const [loadOrders, setLoadOrder] = useState(false);

  const getOrderOfReserve = async (id) => {
    // setLoadOrder(true);
    await reserveRequest.getOrderByReserveId(id).then((response) => {
      if (response.length > 0) {
        response.map((result) => {
          if (result.product_company_id && result.product_brand_id) {
            result.items.map((data, index) => {
              const getProductRegis = productList.filter(
                (x) =>
                  x.product_id == data.product_id &&
                  x.product_brand_id == result.product_brand_id &&
                  x.product_company_id == result.product_company_id
              );
              data.productRegis = getProductRegis;

              const getItemsRegisData = allProductRegis.filter(
                (option) => option.order_id === data.order_id && option.item_id === data.item_id
              );

              if (getItemsRegisData.length > 0) {
                getItemsRegisData.map((x) => {
                  setLoopSelect((prevState) => {
                    const updatedOptions = [...prevState];

                    (x.id = data.order_id + data.item_id + index), updatedOptions.push(x);
                    return updatedOptions;
                  });
                });
              } else {
                const selectedOption = {
                  // id: `${data.order_id}${data.item_id}${index}`,
                  id: `${data.order_id}${data.item_id}${getItemsRegisData.length}`,
                  order_id: data.order_id,
                  item_id: data.item_id,
                  product_register_id: '',
                  quantity: parseFloat(data.quantity),
                  product_register_quantity: 0,
                  sling_hook_quantity: 0,
                  sling_sort_quantity: 0,
                  smash_quantity: 0,
                  jumbo_hook_quantity: 0
                };
                setLoopSelect((prevState) => {
                  const updatedOptions = [...prevState];
                  updatedOptions.push(selectedOption);
                  return updatedOptions;
                });
              }

              if (data.product_id) {
                const selectedOption = { id: data.item_id, value: data.product_register_id };
                setOrderSelect((prevState) => {
                  const updatedOptions = [...prevState];
                  updatedOptions.push(selectedOption);
                  return updatedOptions;
                });
              }
            });
          }
        });

        setOrders(response);
        // setLoadOrder(false);
      }
    });
  };

  const [productList, setProductList] = useState([]);
  const getProductRegisters = async () => {
    try {
      adminRequest.getAllProductRegister().then((response) => {
        adminRequest.getAllProductHistory().then((response0) => {
          let allRespon = [...response, ...response0];
          if (onFilter) {
            setProductList(allRespon.filter((x) => x.product_company_id == onFilter));
          } else {
            setProductList(allRespon);
          }
          setOnClickSubmit(false);
        });
        // if (onFilter) {
        //   setProductList(response.filter((x) => x.product_company_id == onFilter));
        // } else {
        //   setProductList(response);
        // }
        // setOnClickSubmit(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [orderSelect, setOrderSelect] = useState([]);
  const [stockSelect, setStockSelect] = useState([]);
  const handleChangeProduct = (e, id, items, key) => {
    const selectedOption = { id: id, value: e.target.value };

    const stockItem = items.productRegis.find((x) => x.product_register_id === e.target.value)?.total_remain;

    // console.log('*************** Stock select  ***************');
    setStockSelect((prevState) => {
      let updatedOptions = [...prevState];

      const selectedStock = {
        id: key,
        order_id: items.order_id,
        item_id: items.item_id,
        product_register_id: e.target.value,
        stockQuetity: parseFloat(stockItem) >= parseFloat(items.quantity) ? parseFloat(items.quantity) : parseFloat(stockItem)
      };
      console.log('selectedStock 1', selectedStock);

      const index = updatedOptions.findIndex((option) => option.order_id === items.order_id && option.item_id === items.item_id);
      const indexProId = updatedOptions.filter(
        (option) => option.order_id === items.order_id && option.item_id === items.item_id && option.product_register_id !== e.target.value
      );
      const indexKey = updatedOptions.findIndex((option) => option.id === key);

      if (parseFloat(stockItem) <= parseFloat(items.quantity) && indexKey === -1) {
        console.log('check 1');
        updatedOptions.push(selectedStock);
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length === 0) {
        console.log('check 2');
        updatedOptions[index] = selectedStock;
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length !== 0) {
        console.log('check 3');
        const filterindex = updatedOptions.filter((option) => option.order_id === items.order_id && option.item_id === items.item_id);
        filterindex.map(
          (x) =>
            (selectedStock.stockQuetity =
              selectedStock.stockQuetity > x.stockQuetity
                ? selectedStock.stockQuetity - x.stockQuetity
                : x.stockQuetity - selectedStock.stockQuetity)
        );
        if (selectedStock.stockQuetity <= 0 && indexKey !== -1) {
          console.log('check 3.1');
          selectedStock.stockQuetity = parseFloat(items.quantity);

          let filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);

          filterRemove.push(selectedStock);
          updatedOptions = filterRemove;
          // updatedOptions.push(selectedStock);
        } else if (indexKey !== -1) {
          console.log('check 3.2');
          selectedStock.stockQuetity = parseFloat(items.quantity);

          const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
          if (checkStock.length > 0) {
            console.log('check 3.2.1');
            let totolIsSelect = 0;
            checkStock.map((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));

            if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
              console.log('check 3.2.2');
              let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
              selectedStock.stockQuetity = result;
            }
          }
          updatedOptions[index] = selectedStock;
        } else {
          console.log('check 3.3');
          updatedOptions.push(selectedStock);
        }
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey === -1) {
        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
        const checkStockSelect = updatedOptions.filter((x) => x.order_id === items.order_id && x.item_id === items.item_id);
        console.log('checkStock :', checkStock);
        console.log('check 4');

        if (checkStock.length > 0) {
          console.log('check 4.1');
          let totolIsSelect = 0;
          checkStock.map((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));

          console.log('parseFloat(stockItem)', parseFloat(stockItem));
          console.log('totolIsSelect', totolIsSelect);
          console.log('totolIsSelect', selectedStock.stockQuetity);
          if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
            console.log('check 4.1.1');
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);

            // if (selectedStock.stockQuetity < items.quantity) {
            //   // console.log('check 4.2.1');
            // }
          } else if (parseFloat(stockItem) === totolIsSelect + selectedStock.stockQuetity && checkStockSelect.length > 0) {
            // console.log('checkStockSelect',checkStockSelect);
            console.log('check 4.1.2');
            let result = (parseFloat(stockItem) - selectedStock.stockQuetity).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);
            // console.log('selectedStock.stockQuetity',selectedStock.stockQuetity);
          }
        } else if (checkStockSelect.length > 0) {
          console.log('check 4.2');
          checkStockSelect.map((x) => {
            selectedStock.stockQuetity = selectedStock.stockQuetity - x.stockQuetity;
          });
        }
        updatedOptions.push(selectedStock);
      } else {
        console.log('check 5');
        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
        if (checkStock.length > 0) {
          console.log('check 5.1');
          let totolIsSelect = 0;
          checkStock.map((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));

          if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
            console.log('check 5.2');
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);
          }
        }

        updatedOptions[index] = selectedStock;
      }
      console.log('setStockSelect', updatedOptions);
      return updatedOptions;
    });

    console.log('*************** Loop select  ***************');
    setLoopSelect((prevState) => {
      let updatedOptions = [...prevState];

      const selectedOptionNew = {
        id: key,
        order_id: items.order_id,
        item_id: items.item_id,
        product_register_id: e.target.value,
        quantity: parseFloat(items.quantity),
        product_register_quantity: parseFloat(stockItem) >= parseFloat(items.quantity) ? parseFloat(items.quantity) : parseFloat(stockItem),
        sling_hook_quantity: 0,
        sling_sort_quantity: 0,
        smash_quantity: 0,
        jumbo_hook_quantity: 0
      };

      const indexProId = updatedOptions.filter(
        (option) => option.order_id === items.order_id && option.item_id === items.item_id && option.product_register_id !== e.target.value
      );
      const indexKey = updatedOptions.findIndex((option) => option.id === key);
      const orderList = updatedOptions.filter((option) => option.item_id == items.item_id && option.order_id == items.order_id);
      const orderListNotSelect = orderList.filter((option) => option.id !== key);
      console.log('orderList ', orderList);
      console.log('orderListNotSelect ', orderListNotSelect);

      let checkSum = sumSelectProductRegis(orderList);
      let checkSumNotSelect = sumSelectProductRegis(orderListNotSelect);
      console.log('checkSum ', checkSum);
      checkSum = checkSum + selectedOptionNew.product_register_quantity;
      console.log('checkSum =  ', checkSum);

      console.log('parseFloat(stockItem) ', parseFloat(stockItem));
      console.log('parseFloat(items.quantity) ', parseFloat(items.quantity));
      console.log('indexKey ', indexKey);
      console.log('indexProId ', indexProId);

      // console.log('updatedOptionsbefor ', updatedOptions);
      if (parseFloat(stockItem) < parseFloat(items.quantity) && indexKey !== -1) {
        // console.log('check 1');
        const filterList = updatedOptions.filter(
          (option) => option.item_id == items.item_id && option.order_id == items.order_id && option.product_register_id === ''
        );

        if (orderList.length < 3 && orderList.length < items.productRegis.length && filterList.length === 0) {
          console.log('check 1.1');
          if (parseFloat(items.quantity) > checkSum || checkSumNotSelect === 0) {
            console.log('check 1.2');
            console.log('orderList.length + 1', orderList.length + 1);
            const selectedOption = {
              id: `${items.order_id}${items.item_id}${orderList.length + 1}`,
              order_id: items.order_id,
              item_id: items.item_id,
              product_register_id: '',
              quantity: parseFloat(items.quantity),
              product_register_quantity: 0,
              sling_hook_quantity: 0,
              sling_sort_quantity: 0,
              smash_quantity: 0,
              jumbo_hook_quantity: 0
            };
            updatedOptions.push(selectedOption);
          }
          // else if (checkSumNotSelect) {
          //   console.log('check checkSumNotSelect', checkSumNotSelect);
          // }
        } else if (parseFloat(items.quantity) < checkSum) {
          // console.log('check 1.3');
          let sumquatity = sumSelectProductRegis(orderList);
          console.log('newsum = ', sumquatity - parseFloat(items.quantity));
          console.log('newsum = ', parseFloat(items.quantity) - sumquatity);
        }

        updatedOptions[indexKey] = selectedOptionNew;
      } else if (
        // parseFloat(items.quantity) > checkSum &&
        parseFloat(stockItem) >= parseFloat(items.quantity) &&
        indexKey !== -1 &&
        indexProId.length !== 0
      ) {
        console.log('check 2');
        const filterindex = updatedOptions.filter((option) => option.order_id === items.order_id && option.item_id === items.item_id);
        filterindex.map(
          (x) =>
            (selectedOptionNew.product_register_quantity =
              selectedOptionNew.product_register_quantity > x.product_register_quantity
                ? selectedOptionNew.product_register_quantity - x.product_register_quantity
                : x.product_register_quantity - selectedOptionNew.product_register_quantity)
        );

        if (selectedOptionNew.product_register_quantity <= 0 && indexKey !== -1) {
          console.log('check 2.1');

          selectedOptionNew.product_register_quantity = parseFloat(items.quantity);
          // console.log(updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id));
          const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);

          filterRemove.push(selectedOptionNew);
          updatedOptions = filterRemove;
        } else if (indexKey !== -1) {
          console.log('check 2.2');

          const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value && x.id !== key);
          const checkNumSelect = updatedOptions.filter(
            (option) => option.item_id == items.item_id && option.order_id == items.order_id && option.product_register_id === ''
          );
          if (checkStock.length > 0) {
            console.log('check 2.2.1');
            let totolIsSelect = 0;
            checkStock.map((x) => (totolIsSelect = x.product_register_quantity + totolIsSelect));

            if (parseFloat(stockItem) < totolIsSelect + selectedOptionNew.product_register_quantity) {
              let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
              selectedOptionNew.product_register_quantity = parseFloat(result);
              console.log('check 2.2.1.1');

              if (selectedOptionNew.product_register_quantity < selectedOptionNew.quantity && checkNumSelect < 1) {
                console.log('check 2.2.1.1.1');

                const selectedOption = {
                  id: items.order_id + items.item_id + (orderList.length + 1),
                  order_id: items.order_id,
                  item_id: items.item_id,
                  product_register_id: '',
                  quantity: parseFloat(items.quantity),
                  product_register_quantity: 0,
                  sling_hook_quantity: 0,
                  sling_sort_quantity: 0,
                  smash_quantity: 0,
                  jumbo_hook_quantity: 0
                };
                console.log('add new selectedOption', selectedOption);
                updatedOptions.push(selectedOption);
              }
            } else if (parseFloat(stockItem) === totolIsSelect + selectedOptionNew.product_register_quantity && checkNumSelect.length > 0) {
              console.log('check 2.2.1.2');
              updatedOptions = updatedOptions.filter((x) => x.id !== checkNumSelect[0].id);
            } else if (totolIsSelect < selectedOptionNew.product_register_quantity) {
              console.log('check 2.2.1.3');
              selectedOptionNew.quantity = selectedOptionNew.product_register_quantity - totolIsSelect;
            }
          } else if (checkNumSelect.length > 0) {
            console.log('check 2.2.2');

            const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);

            console.log('filterRemove :', filterRemove);
            console.log('key :', key);
            console.log('filterRemove :', (updatedOptions = filterRemove));
            updatedOptions = filterRemove;
            updatedOptions.push(selectedOptionNew);
          }

          const idKey = updatedOptions.findIndex((option) => option.id === key);
          updatedOptions[idKey] = selectedOptionNew;
          // updatedOptions.push(selectedOptionNew);
        }

        // else {
        //   updatedOptions.push(selectedOptionNew);
        // }
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length === 0) {
        console.log('check 3');
        // selectedOptionNew.product_register_quantity = parseFloat(items.quantity);
        // console.log(updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id));
        const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);

        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
        if (checkStock.length > 0) {
          console.log('check 3.1');
          let totolIsSelect = 0;
          checkStock.map((x) => (totolIsSelect = x.product_register_quantity + totolIsSelect));

          if (parseFloat(stockItem) < totolIsSelect + selectedOptionNew.product_register_quantity) {
            console.log('check 3.2');
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedOptionNew.product_register_quantity = parseFloat(result);

            if (
              parseFloat(stockItem) > parseFloat(items.quantity) &&
              orderList.length < 3 &&
              orderList.length < items.productRegis.length
            ) {
              console.log('check 1.1');
              // console.log('parseFloat(stockItem) > parseFloat(items.quantity)', parseFloat(stockItem) > parseFloat(items.quantity));
              // console.log('orderList.length < 3 :', orderList.length < 3);
              // console.log('orderList.length < items.productRegis.length :', orderList.length < items.productRegis.length);
              const selectedOption = {
                id: items.order_id + items.item_id + orderList.length,
                order_id: items.order_id,
                item_id: items.item_id,
                product_register_id: '',
                quantity: parseFloat(items.quantity),
                product_register_quantity: 0,
                sling_hook_quantity: 0,
                sling_sort_quantity: 0,
                smash_quantity: 0,
                jumbo_hook_quantity: 0
              };
              filterRemove.push(selectedOption);
            }
          }
        }

        filterRemove.push(selectedOptionNew);
        updatedOptions = filterRemove;
      }

      // console.log('setLoopSelect ', updatedOptions);
      return updatedOptions;
    });

    setOrderSelect((prevState) => {
      const updatedOptions = [...prevState];
      const index = updatedOptions.findIndex((option) => option.id === id);
      if (index !== -1) {
        // Update the existing option
        updatedOptions[index] = selectedOption;
      } else {
        // Add the new option
        updatedOptions.push(selectedOption);
      }
      return updatedOptions;
    });
  };

  const [typeSelect, setTypeSelect] = useState([]);
  const handleChangeSelect = (id, name, onloop) => (event) => {
    const { value, checked } = event.target;
    const selectedOption = { id: id, name: name, product_register_id: onloop.product_register_id, value: checked ? value || true : false };

    setTypeSelect((prevState) => {
      const updatedOptions = [...prevState];

      const index = updatedOptions.findIndex(
        (option) => option.id === id && option.name === name && option.product_register_id === onloop.product_register_id
      );
      if (index !== -1) {
        updatedOptions[index] = selectedOption;
      } else {
        updatedOptions.push(selectedOption);
      }
      return updatedOptions;
    });
  };

  const sumSelectProductRegis = (data) => {
    let sumData = 0;
    data.map((x) => {
      if (x.product_register_quantity) {
        sumData = x.product_register_quantity + sumData;
      }
    });

    return sumData;
  };

  const [typeNumSelect, setTypeNumSelect] = useState({});
  const handleChangeTypeNum = (id, name, e, maxNum, onloop) => {
    const selectedOption = { id: id, name: name, product_register_id: onloop.product_register_id, value: e.target.value };

    if (e.target.value > maxNum) {
      alert(`จำนวนสินค้าต้องไม่เกิน "${maxNum}" ตัน`);
      return;
    } else if (e.target.value < 0) {
      alert(`จำนวนสินค้าต้องมากกว่า "0" ตัน`);
      return;
    } else {
      setLoopSelect((prevState) => {
        let updatedOptions = [...prevState];
        const index = updatedOptions.findIndex(
          (option) =>
            option.item_id === onloop.item_id &&
            option.order_id === onloop.order_id &&
            option.product_register_id === onloop.product_register_id
        );
        const selectChange = updatedOptions.find(
          (option) =>
            option.item_id === onloop.item_id &&
            option.order_id === onloop.order_id &&
            option.product_register_id === onloop.product_register_id
        );

        if (name === 'checked1') selectChange.smash_quantity = parseFloat(e.target.value);
        if (name === 'checked2') selectChange.sling_hook_quantity = parseFloat(e.target.value);
        if (name === 'checked3') selectChange.sling_sort_quantity = parseFloat(e.target.value);
        if (name === 'checked4') selectChange.jumbo_hook_quantity = parseFloat(e.target.value);

        updatedOptions[index] = selectChange;
        return updatedOptions;
      });
      setTypeNumSelect((prevState) => {
        const updatedOptions = [...prevState];

        const index = updatedOptions.findIndex(
          (option) => option.id === id && option.name === name && option.product_register_id === onloop.product_register_id
        );
        if (index !== -1) {
          updatedOptions[index] = selectedOption;
        } else {
          updatedOptions.push(selectedOption);
        }
        return updatedOptions;
      });
    }
  };

  // =============== ปรับสถานะหัวจ่าย ===============//
  const updateStation = async (id, status) => {
    // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const currentDate = await stepRequest.getCurrentDate();

    try {
      const data = {
        station_status: status,
        time_update: currentDate
      };

      stepRequest.putStationStatus(id, data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // =============== ปรับสถานะ สายแรงงาน ===============//
  const updateContractor = async (id, status) => {
    // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const currentDate = await stepRequest.getCurrentDate();

    try {
      const data = {
        contract_status: status,
        contract_update: currentDate
      };

      stepRequest.putContractorStatus(id, data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClickOpen = (step_id, fr, queues_id, station_id, queuesData) => {
    //ข้อความแจ้งเตือน
    //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
    if (fr === 'call') {
      setText('เรียกคิว');
      setMessage('ขึ้นสินค้า–STEP2 เรียกคิว');
      setOrderSelect([]);
      getOrderOfReserve(queuesData.reserve_id);
      getReserveId(queuesData.reserve_id);
    } else {
      if (fr === 'close') {
        setMessage('ขึ้นสินค้า–STEP2 ปิดคิว');
        setTeamLoading([]);
        setOrderSelect([]);
        setTypeSelect([]);
        setTypeNumSelect([]);
        getOrderOfReserve(queuesData.reserve_id);
        getReserveId(queuesData.reserve_id);
        setText('ปิดคิว');
      } else {
        getOrderOfReserve(queuesData.reserve_id);
        setMessage('ขึ้นสินค้า–STEP2 ยกเลิกเรียกคิว');
        setText('ยกเลิก');
      }
    }

    console.log('queuesData :', queuesData);
    //กดปุ่มมาจากไหน
    setFrom(fr);
    setUpdate(step_id);
    setStationId(station_id);
    getStepId(3, queues_id);
    setQueues(queuesData);
    setOpen(true);
  };

  const handleClose = async (flag) => {
    //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
    const currentDate = await stepRequest.getCurrentDate();

    const contracOtherValue = {
      reserve_id: reservesData.reserve_id,
      contractor_id: reservesData.contractor_id_to_other,
      contract_other_status: 'working',
      contract_other_update: currentDate
    };

    console.log('reservesData :', reservesData);
    console.log('reservesData.contractor_other_id :', reservesData.contractor_other_id);
    console.log('contracOtherValue :', contracOtherValue);
    console.log('currentDate :', currentDate);

    if (flag === 1) {
      setOnClickSubmit(true);
      if (fr === 'call') {
        setLoading(true);
        if (station_count < station_num) {
          if (station_id) {
            let countItem = 0;
            orders.map((orderData) => {
              countItem = countItem + orderData.items.length;
            });

            let checkCountItemLoop = 0;
            loopSelect.map((orderData) => {
              if (!orderData.product_register_quantity) {
                checkCountItemLoop = checkCountItemLoop + 1;
              }
            });
            if (checkCountItemLoop > 0) {
              setOnClickSubmit(false);
              alert('กรุณาระบุกองสินค้าให้ครบถ้วน');
              return;
            } else if (orderSelect.length != countItem) {
              setOnClickSubmit(false);
              alert('กรุณาระบุกองสินค้าให้ครบถ้วน');
              return;
            } else {
              // if (status === 9999) {
              setItems([]);
              setOpen(false);

              loopSelect.map((x) => {
                if (
                  (x.order_id !== null || x.order_id !== undefined) &&
                  (x.item_id !== null || x.item_id !== undefined) &&
                  (x.product_register_id !== null || x.product_register_id !== undefined)
                ) {
                  const getItemsRegisData = allProductRegis.filter(
                    (option) => option.order_id === x.order_id && option.item_id === x.item_id
                  );
                  if (queues.recall_status === 'Y' && getItemsRegisData.length > 0) {
                    updateItemsRegister(x.item_register_id, x);
                  } else {
                    addItemsRegister(x);
                  }
                }
              });

              const dataLogStock = {
                audit_user_id: userId,
                audit_action: 'A',
                audit_system_id: id_update,
                audit_system: 'step2',
                audit_screen: 'เลือกกองสินค้า',
                audit_description: JSON.stringify(loopSelect)
              };
              AddAuditLogs(dataLogStock);

              // รอปรับปรุงข้อมูลกองสินค้าที่เลือก
              orderSelect.map((dataOrder) => {
                const setData = {
                  product_register_id: dataOrder.value,
                  smash_quantity: 0,
                  sling_hook_quantity: 0,
                  sling_sort_quantity: 0,
                  jumbo_hook_quantity: 0
                };
                updateRegisterItems(dataOrder.id, setData);
              });

              const data = {
                audit_user_id: userId,
                audit_action: 'I',
                audit_system_id: id_update,
                audit_system: 'step2',
                audit_screen: 'ข้อมูลขึ้นสินค้า',
                audit_description: 'เรียกขึ้นสินค้า'
              };
              AddAuditLogs(data);
              if (reservesData.contractor_other_id) {
                updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
              }
              updateStation(station_id, 'working');
              updateContractor(queues.contractor_id, 'working');
              setStationCount(station_count + 1);
              await step1Update(id_update, 'processing', station_id);
              await updateStartTime(id_update);
              await getProductRegisters();
              // }
              setLoopSelect([]);
              // }
            }
          } else {
            setOnClickSubmit(false);
            alert('กรุณาเลือกหัวจ่าย');
          }
        } else {
          setOnClickSubmit(false);
          alert('สถานีบริการเต็ม');
        }
      } else {
        if (fr === 'close') {
          // setOnClickSubmit(true);
          setLoading(true);
          //ปิดคิว: Update waiting Step2 ตามหมายเลขคิว 27 = Station ว่าง
          if (teamId === '' || teamId === null) {
            setOnClickSubmit(false);
            alert('กรุณาเลือกทีมขึ้นสินค้า');
            return;
          }

          if (contractorId === '' || contractorId === null) {
            setOnClickSubmit(false);
            alert('กรุณาเลือกสายรายงาน');
            return;
          }

          let countItem = 0;
          orders.map((orderData) => {
            countItem = countItem + orderData.items.length;
          });

          let countSelectError = 0;
          let countSelectErrorNum = 0;
          if (typeSelect.length > 0) {
            typeSelect.map((checked) => {
              if (checked.value == 'on') {
                const finNumSelect = typeNumSelect.filter((x) => x.id == checked.id && x.name === checked.name);
                if (finNumSelect.length == 0 || finNumSelect[0].value == '') {
                  countSelectError++;
                } else if (finNumSelect.length > 0 && parseFloat(finNumSelect[0].value) <= 0) {
                  countSelectErrorNum++;
                }
              }
            });
          }

          if (countSelectError > 0) {
            setOnClickSubmit(false);
            alert('กรุณาระบุจำนวนสินค้าให้ถูกต้อง');
            return;
          }
          if (countSelectErrorNum > 0) {
            setOnClickSubmit(false);
            alert('กรุณาระบุจำนวนสินค้าให้มากกว่า 0');
            return;
          }

          try {
            // console.log('Click close teamData', teamData);
            // if (status === 9999) {
            setItems([]);
            setOpen(false);

            loopSelect.map((x) => {
              if (
                x.item_register_id &&
                (x.order_id !== null || x.order_id !== undefined) &&
                (x.item_id !== null || x.item_id !== undefined) &&
                (x.product_register_id !== null || x.product_register_id !== undefined)
              ) {
                updateItemsRegister(x.item_register_id, x);
              }
            });

            if (status === 'processing') setOnClickSubmit(true);
            if (orderSelect.length > 0 || typeSelect.length !== 0) {
              orders.map((order) => {
                order.items.map((items) => {
                  const checkOrderSelect = orderSelect.filter((x) => x.id == items.item_id);
                  const filterNumSelect = typeNumSelect.filter((x) => x.id == items.item_id);

                  if (checkOrderSelect.length > 0) {
                    checkOrderSelect.map((dataOrder) => {
                      if (filterNumSelect.length > 0) {
                        const setData = {
                          product_register_id: dataOrder.value,
                          smash_quantity: 0,
                          sling_hook_quantity: 0,
                          sling_sort_quantity: 0,
                          jumbo_hook_quantity: 0
                        };

                        filterNumSelect.map((x) => {
                          if (x.name === 'checked1') setData.smash_quantity = x.value;
                          if (x.name === 'checked2') setData.sling_hook_quantity = x.value;
                          if (x.name === 'checked3') setData.sling_sort_quantity = x.value;
                          if (x.name === 'checked4') setData.jumbo_hook_quantity = x.value;
                        });
                        updateRegisterItems(dataOrder.id, setData);
                      } else {
                        const setData = {
                          product_register_id: items.product_register_id,
                          smash_quantity: 0,
                          sling_hook_quantity: 0,
                          sling_sort_quantity: 0,
                          jumbo_hook_quantity: 0
                        };
                        updateRegisterItems(items.item_id, setData);
                      }
                    });
                  } else {
                    if (filterNumSelect.length > 0) {
                      const setData = {
                        product_register_id: items.product_register_id,
                        smash_quantity: 0,
                        sling_hook_quantity: 0,
                        sling_sort_quantity: 0,
                        jumbo_hook_quantity: 0
                      };
                      filterNumSelect.map((x) => {
                        if (x.name === 'checked1') setData.smash_quantity = x.value;
                        if (x.name === 'checked2') setData.sling_hook_quantity = x.value;
                        if (x.name === 'checked3') setData.sling_sort_quantity = x.value;
                        if (x.name === 'checked4') setData.jumbo_hook_quantity = x.value;
                      });
                      updateRegisterItems(items.item_id, setData);
                    }
                  }
                });
              });
            }
            getStepToken(id_update)
              .then(({ queue_id, token }) => {
                lineNotify(queue_id, token);
              })
              .catch((error) => {
                console.error('Error:', error);
                // ทำอะไรกับข้อผิดพลาด
              });

            contracOtherValue.contract_other_status = 'completed';

            if (reservesData.contractor_other_id) {
              updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
            }

            const data = {
              audit_user_id: userId,
              audit_action: 'U',
              audit_system_id: id_update,
              audit_system: 'step2',
              audit_screen: 'ข้อมูลขึ้นสินค้า',
              audit_description: 'บันทึกข้อมูลขึ้นสินค้า'
            };
            AddAuditLogs(data);
            setStationCount(station_count - 1);
            updateStation(station_id, 'waiting');
            updateContractor(queues.contractor_id, 'waiting');

            // await updateLoadingTeam(id_update);
            // await updateLoadingTeam(id_update_next);
            await updateLoadingTeams([id_update, id_update_next]);

            await updateTeamLoading();
            // await updateTeamData();
            await updateEndTime(id_update);
            await updateStartTime(id_update_next);

            // await step2Update(id_update_next, 'waiting', 27);
            // await step1Update(id_update, 'completed', station_id);

            // อัปเดตสถานะและข้อมูลของทั้งสองขั้นตอนใน API call เดียว
            const station_id2 = station_id;
            const currentDate = await stepRequest.getCurrentDate();
            // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const updates = [
              { step_id: id_update, status: 'completed', station_id: station_id2, updated_at: currentDate },
              { step_id: id_update_next, status: 'waiting', station_id: 27, updated_at: currentDate }
            ];
            await updateMultipleStepStatus(updates);

            await getProductRegisters();
            // }
            setStockSelect([]);
            setLoopSelect([]);
            // }
          } catch (error) {
            console.error(error);
            // จัดการข้อผิดพลาดตามที่ต้องการ
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            setStockSelect([]);
            setReservesData([]);
            setLoopSelect([]);
          }
          // }
        } else {
          setLoading(true);
          // การใช้งาน Line Notify
          setItems([]);

          const data = {
            audit_user_id: userId,
            audit_action: 'D',
            audit_system_id: id_update,
            audit_system: 'step2',
            audit_screen: 'ข้อมูลขึ้นสินค้า',
            audit_description: 'ยกเลิกการขึ้นสินค้า'
          };
          AddAuditLogs(data);

          // console.log('cancle Click');
          if (stationStatus === 'N') {
            const data = {
              audit_user_id: userId,
              audit_action: 'D',
              audit_system_id: queues.reserve_id,
              audit_system: 'step2',
              audit_screen: 'ข้อมูลการจอง',
              audit_description: 'ยกเลิกทีมขึ้นสินค้า'
            };
            AddAuditLogs(data);
            updateCancleTeams(queues.reserve_id);
          }
          // if (id_update === 999999) {
          setOpen(false);
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              setOnClickSubmit(false);
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          loopSelect.map((x) => {
            removeItemsRegister(x.item_register_id);
          });

          updateStation(station_id, 'waiting');
          updateContractor(queues.contractor_id, 'waiting');
          setStationCount(station_count - 1);
          await step1Update(id_update, 'waiting', 27);
          await updateStartTime(id_update);
          await getProductRegisters();
          setStockSelect([]);
          setReservesData([]);
          setLoopSelect([]);
          // }
          // Trigger the parent to reload the other instance with the common status
        }
      }
    } else if (flag === 0) {
      setLoopSelect([]);
      setReservesData([]);
      setOrders([]);
      setStockSelect([]);
      setOpen(false);
      setStationStatus('');
    }
  };

  // =============== บันทึกข้อมูล ===============//
  const updateTeamLoading = async () => {
    const teamValue = {
      team_id: teamId,
      contractor_id: contractorId,
      labor_line_id: labor_line_id
    };
    await adminRequest.putReserveTeam(queues.reserve_id, teamValue);
  };

  // const updateTeamData = async () => {
  //   await adminRequest.putReserveTeamData(queues.reserve_id, teamData);
  // };

  // แสดงข้อมูลกองสินค้าทั้งหมด
  const [allProductRegis, setAllProductRegis] = useState([]);
  const getAllItemsRegis = () => {
    try {
      stepRequest.getAllItemsRegister().then((response) => {
        setAllProductRegis(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // เพิ่มข้อมูลกองสินค้า
  const addItemsRegister = async (data) => {
    await stepRequest.addItemRegister(data);
  };

  // ลบข้อมูลกองสินค้า
  const removeItemsRegister = async (id) => {
    await stepRequest.deleteItemsRegister(id);
    // .then((response) => {
    //   console.log('removeItemsRegister:', response);
    // });
    // .then((response) => {
    //   console.log('response', response);
    // });
  };

  // แก้ไขข้อมูลกองสินค้า
  const updateItemsRegister = async (id, data) => {
    try {
      await stepRequest.putItemsRegister(id, data).then((response) => {
        console.log('updateItemsRegister:', response);
      });
    } catch (error) {
      console.log();
    }
    // .then((response) => {
    //   console.log('response', response);
    // });
  };

  const updateRegisterItems = async (id, data) => {
    await stepRequest.putRegisterItem(id, data);
    // .then((response) => {
    //   console.log('response', response);
    // });
  };

  // =============== บันทึกข้อมูล สายแรงงานใหม่ ===============//
  // const deleteContractorOthers = async (id) => {
  //   try {
  //     await adminRequest.deleteContractorOtherByID(id);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const updateContractorOthers = async (id, value) => {
    try {
      await adminRequest.putContractorOther(id, value).then((response) => {
        console.log('updateContractorOthers', response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Update lineNotify Message
  const lineNotify = (queue_id, token) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    // if (queue_id === 99999) {
    var link = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    link = link + '/queues/detail/' + queue_id;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      message: message + ' หมายเลขคิว: ' + token + '\n' + link
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(apiUrl + '/line-notify', requestOptions)
      .then((response) => response.text())
      .catch((error) => console.error(error));
    // }
  };

  // Get Step Token
  const getStepToken = (step_id) => {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(apiUrl + '/getsteptoken/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.length > 0) {
            const { queue_id, reserve_id, token } = result[0];
            resolve({ queue_id, reserve_id, token });
          } else {
            reject('No data found');
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };

  const [selectedStations, setSelectedStations] = useState({}); // ใช้ state สำหรับการเก็บสถานีที่ถูกเลือกในแต่ละแถว
  const handleStationChange = (event, row) => {
    const { value } = event.target;
    setSelectedStations((prevState) => ({
      ...prevState,
      [row.step_id]: value // เก็บค่าสถานีที่ถูกเลือกในแต่ละแถวโดยใช้ step_id เป็น key
    }));
  };

  // =============== Get Warehouses ===============//
  const [warehouseId, setWareHouseId] = useState('');
  const [warehousesList, setWarehousesList] = useState([]);
  const getWarehouses = () => {
    adminRequest
      .getAllWareHouse()
      .then((result) => {
        setWarehousesList(result);
      })
      .catch((error) => console.log('error', error));
  };

  const handleChangeWarehouse = (e) => {
    setStationsId('');
    setWareHouseId(e.target.value);
    getStationById(e.target.value);
    getTeamloadingByIdwh(e.target.value);
  };

  // =============== Get Stations ===============//
  const [stationsId, setStationsId] = useState('');
  const [stationsList, setStationsList] = useState([]);
  const getStationById = (id) => {
    try {
      adminRequest.getStationsByWareHouse(id).then((response) => {
        setStationsList(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeStation = (e) => {
    setStationsId(e.target.value);
  };
  // =============== Get TeamLoanding ===============//
  const [teamId, setTeamId] = useState([]);
  const [teamloadingList, setTeamLoadingList] = useState([]);
  const getTeamloadingByIdwh = (warehouse_id) => {
    try {
      adminRequest.getLoadingTeamByIdwh(warehouse_id).then((result) => {
        setTeamLoadingList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const [teamData, setTeamData] = useState([]);
  const [teamLoading, setTeamLoading] = useState([]);
  const getTeamloadingByIds = (id) => {
    try {
      adminRequest.getLoadingTeamById(id).then((result) => {
        // console.log("getLoadingTeamById :", result);
        // setTeamData(result);
        const combinedData = [...result.team_managers, ...result.team_checkers, ...result.team_forklifts];
        setTeamLoading(combinedData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTeam = (e) => {
    setTeamLoading([]);
    setTeamId(e);
    getTeamloadingByIds(e);
  };

  // =============== Get Contractor ===============//
  const [contractorId, setcontractorId] = useState([]);
  const [contractorList, setContractorList] = useState([]);
  const getAllContractor = () => {
    try {
      adminRequest.getAllContractors().then((result) => {
        setContractorList(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeContractor = (e) => {
    getLaborLine(e.target.value);
    setcontractorId(e.target.value);
  };

  // =============== Get Contractor and laybor Line ===============//
  const [labor_line_id, setLaborLineId] = useState([]);
  const [layborLineList, setLayborLineList] = useState([]);

  const getLaborLine = (id) => {
    try {
      adminRequest.getContractorById(id).then((result) => {
        setLayborLineList(result.labor_lines);
      });
    } catch (error) {
      console.log(error);
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

  const handleChangeLaborLine = (e) => {
    setLaborLineId(e.target.value);
  };

  const sumStock = (producrReId, onStock) => {
    const setStock = stockSelect.filter((x) => x.product_register_id === producrReId);
    let total = 0;

    if (setStock.length > 0) setStock.map((x) => (total = parseFloat(x.stockQuetity) + total));
    total = parseFloat(onStock) - total;
    return total;
  };

  const handleCallQueue = async (queues) => {
    const cleanedToken = queues.token.split('').join(' ');
    const titleTxt = `ขอเชิญคิวหมายเลขที่ ${cleanedToken}`;

    const detialTxt = `เข้าโกดัง`;
    let titleTxtStation = '';
    let getWarehouseData = '';

    if (queues.station_id == 27) {
      const getStationData = stationsList.filter((x) => x.station_id == queues.reserve_station_id);

      getWarehouseData = warehousesList.filter((x) => x.warehouse_id == getStationData[0].warehouse_id);
      titleTxtStation = getStationData[0].station_description;
    } else {
      getWarehouseData = warehousesList.filter((x) => x.warehouse_id == queues.warehouse_id);
      titleTxtStation = queues.station_description;
    }

    const cleanedStringStation = titleTxtStation.replace(/^A\d\/\d\s*/g, '');

    // ==== แยกตัวอักษรป้ายทะเบียนรถ ====
    const titleTxtCar = queues.registration_no;
    const cleanedString = titleTxtCar;
    const spacedString = cleanedString.split('').join(' ').replace(/-/g, 'ขีด').replace(/\//g, 'ทับ').replace(/,/g, 'พ่วง');

    SoundCall(`${titleTxt} ทะเบียน ${spacedString} ${detialTxt} ${getWarehouseData[0].warehouse_name} ${cleanedStringStation}`);
  };

  const updateCancleTeams = async (reserveId) => {
    functionCancleTeam.updateCancleTeamStation(reserveId).then((response) => {
      console.log('updateCancleTeams :', response);
    });
  };

  // =============== เลือกสถานะ หัวจ่าย ===============//
  const [stationStatus, setStationStatus] = useState('');
  const handleSelectCloseStation = (e) => {
    setStationStatus(e);
  };

  // const handleClickOpentest = async () => {

  // }

  const AddAuditLogs = async (data) => {
    await functionAddLogs.AddAuditLog(data);
  };
  return (
    <>
      <Box>
        {saveLoading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
            open={saveLoading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        {status === 'processing' && (
          <Grid sx={{ p: 2 }}>
            <Typography variant="h4">
              {title}
              <span>
                ( {station_count}/{station_num} สถานี )
              </span>
            </Typography>
          </Grid>
        )}

        {status == 'waiting' && (
          <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title" align="center">
              <Typography variant="h5">
                {textnotify}หมายเลข : <QueueTag id={queues.product_company_id || ''} token={queues.token} />
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ minWidth: 400 }}>
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                        <strong>ข้อมูลเข้ารับสินค้า</strong>
                      </Typography>

                      <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h5">
                            โกดังสินค้า:{' '}
                            <strong style={{ color: 'red' }}>
                              {warehousesList.find((x) => x.warehouse_id === warehouseId)?.description}
                            </strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h5">
                            หัวจ่าย:{' '}
                            <strong style={{ color: 'red' }}>
                              {stationsList.find((x) => x.station_id === stationsId)?.station_description}
                            </strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                          <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
                            <strong>{teamloadingList.find((x) => x.team_id === teamId)?.team_name}</strong>
                          </Typography>
                        </Grid>
                        {teamLoading &&
                          teamLoading.map((item, index) => (
                            <Grid item xs={12} key={index}>
                              <Typography variant="h5">
                                {item.manager_name && 'หัวหน้าโกดัง'}
                                {item.checker_name && 'พนักงานจ่ายสินค้า'}
                                {item.forklift_name && 'โฟล์คลิฟท์'}:{' '}
                                <strong>
                                  {item.manager_name && item.manager_name}
                                  {item.checker_name && item.checker_name}
                                  {item.forklift_name && item.forklift_name}
                                </strong>
                              </Typography>
                            </Grid>
                          ))}

                        <Grid item xs={12} md={6}>
                          <Typography variant="h5">
                            สายแรงงาน : <strong>{contractorList.find((x) => x.contractor_id === contractorId)?.contractor_name}</strong>
                            {reservesData?.contractor_name_to_other && (
                              <>
                                {' '}
                                , <span style={{ color: 'red' }}>Pre-sling</span> : <strong>{reservesData.contractor_name_to_other}</strong>
                              </>
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 1 }}>
                      {orders.length > 0 && (
                        <Grid container spacing={2} sx={{ p: 2 }}>
                          <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                            <strong>ข้อมูลกองสินค้า:</strong>
                          </Typography>
                          {orders.map((ordersItems, orderId) => (
                            <Grid item xs={12} key={orderId}>
                              {ordersItems.product_brand_id !== null && ordersItems.product_company_id && (
                                <Grid container spacing={0} sx={{ mt: '0px' }}>
                                  {ordersItems.items.map((orderItem, orderItemId) => (
                                    <Grid item xs={12} key={orderItemId}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                          <Typography variant="h5">บริษัท (สินค้า): {queues.product_company_name}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Typography variant="h5">ตรา (สินค้า): {queues.product_brand_name}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Typography variant="h5">กองสินค้า : {orderItem.name}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Typography variant="h5">
                                            จำนวน : <strong>{orderItem.quantity}</strong> (ตัน)
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                      {loopSelect.length > 0 &&
                                        loopSelect.map(
                                          (onLoop, index) =>
                                            onLoop.order_id === orderItem.order_id &&
                                            onLoop.item_id === orderItem.item_id && (
                                              <>
                                                {queues.recall_status !== 'Y' || onLoop.product_register_id === '' ? (
                                                  <FormControl sx={{ width: '100%', mb: 2 }} size="small" key={index}>
                                                    <Select
                                                      displayEmpty
                                                      variant="outlined"
                                                      value={onLoop.product_register_id}
                                                      onChange={(e) => {
                                                        handleChangeProduct(e, orderItem.item_id, orderItem, onLoop.id);
                                                        onLoop.product_register_id = e.target.value;

                                                        // ข้อมูลกองเก่า
                                                        orderItem.product_register_id = e.target.value;
                                                      }}
                                                    >
                                                      <MenuItem disabled value="">
                                                        เลือกกองสินค้า
                                                      </MenuItem>
                                                      {orderItem.productRegis &&
                                                        orderItem.productRegis.map(
                                                          (productRegis) =>
                                                            parseFloat(productRegis.total_remain) > 0 && (
                                                              <MenuItem
                                                                key={productRegis.product_register_id}
                                                                value={productRegis.product_register_id}
                                                                disabled={
                                                                  loopSelect.find(
                                                                    (x) =>
                                                                      x.order_id == onLoop.order_id &&
                                                                      x.item_id == onLoop.item_id &&
                                                                      x.product_register_id == productRegis.product_register_id &&
                                                                      index > 0
                                                                  ) ||
                                                                  sumStock(
                                                                    productRegis.product_register_id,
                                                                    parseFloat(productRegis.total_remain).toFixed(3)
                                                                  ) <= 0
                                                                }
                                                              >
                                                                {'โกดัง : ' + productRegis.warehouse_name + ' '}
                                                                {productRegis.product_register_name}
                                                                {productRegis.product_register_date
                                                                  ? ` (${moment(productRegis.product_register_date.slice(0, 10)).format(
                                                                      'DD/MM/YY'
                                                                    )}) `
                                                                  : '-'}
                                                                {productRegis.product_register_date
                                                                  ? ` (${calculateAge(productRegis.product_register_date)}) `
                                                                  : '-'}
                                                                {productRegis.product_register_remark ? (
                                                                  <span style={{ color: 'red' }}>
                                                                    {' '}
                                                                    ({productRegis.product_register_remark})
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}
                                                                <strong> ({parseFloat(productRegis.total_remain).toFixed(3)} ตัน)</strong>
                                                                {stockSelect.filter(
                                                                  (x) => x.product_register_id === productRegis.product_register_id
                                                                ).length > 0 &&
                                                                  ' คงเหลือ ' +
                                                                    parseFloat(
                                                                      sumStock(productRegis.product_register_id, productRegis.total_remain)
                                                                    ).toFixed(3)}
                                                              </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                  </FormControl>
                                                ) : (
                                                  <FormControl sx={{ width: '100%', mb: 2 }} size="small" key={index}>
                                                    <Select
                                                      displayEmpty
                                                      variant="outlined"
                                                      value={onLoop.product_register_id}
                                                      onChange={(e) => {
                                                        handleChangeProduct(e, orderItem.item_id, orderItem);
                                                        onLoop.product_register_id = e.target.value;

                                                        // ข้อมูลกองเก่า
                                                        orderItem.product_register_id = e.target.value;
                                                      }}
                                                    >
                                                      <MenuItem disabled value="">
                                                        เลือกกองสินค้า
                                                      </MenuItem>
                                                      {orderItem.productRegis &&
                                                        // orderItem.productRegis.length > 0 &&
                                                        orderItem.productRegis.map(
                                                          (productRegis) =>
                                                            productRegis.product_register_id === onLoop.product_register_id && (
                                                              <MenuItem
                                                                key={productRegis.product_register_id}
                                                                value={productRegis.product_register_id}
                                                                disabled
                                                              >
                                                                {'โกดัง : ' + productRegis.warehouse_name + ' '}
                                                                {productRegis.product_register_name}
                                                                {productRegis.product_register_date
                                                                  ? ` (${moment(productRegis.product_register_date.slice(0, 10)).format(
                                                                      'DD/MM/YY'
                                                                    )}) `
                                                                  : '-'}
                                                                {productRegis.product_register_date
                                                                  ? ` (${calculateAge(productRegis.product_register_date)}) `
                                                                  : '-'}
                                                                {productRegis.product_register_remark ? (
                                                                  <span style={{ color: 'red' }}>
                                                                    {' '}
                                                                    ({productRegis.product_register_remark})
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}
                                                                <strong> ({parseFloat(productRegis.total_remain).toFixed(3)} ตัน)</strong>
                                                                <strong>
                                                                  {' '}
                                                                  (เลือกแล้ว {parseFloat(onLoop.product_register_quantity).toFixed(3)} ตัน)
                                                                </strong>
                                                                {/* {sumStock(productRegis.product_register_id , parseFloat(productRegis.total_remain))} */}
                                                              </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                  </FormControl>
                                                )}
                                              </>
                                            )
                                        )}
                                    </Grid>
                                  ))}
                                </Grid>
                              )}
                            </Grid>
                          ))}
                        </Grid>
                      )}
                      {/* </Stack> */}
                    </Grid>
                  </Grid>
                </Grid>
              </MainCard>
            </DialogContent>
            <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
              {onclickSubmit == true ? (
                <>
                  <CircularProgress color="primary" />
                </>
              ) : (
                <>
                  {stockSelect.length > 0 && (
                    <Button
                      color="warning"
                      variant="contained"
                      autoFocus
                      onClick={() => {
                        setLoopSelect([]);
                        setStockSelect([]);
                        setOrderSelect([]);
                        getOrderOfReserve(queues.reserve_id);
                      }}
                    >
                      รีเซ็ต
                    </Button>
                  )}
                  <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
                    ยกเลิก
                  </Button>
                  <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
                    ยืนยัน
                  </Button>
                  {fr === 'call' && (
                    <Button color="info" variant="contained" onClick={() => handleCallQueue(queues)} autoFocus endIcon={<SoundOutlined />}>
                      เรียกคิว
                    </Button>
                  )}
                </>
              )}
            </DialogActions>
          </Dialog>
        )}

        {status == 'processing' && (
          <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            {fr === 'close' ? (
              <>
                <DialogTitle id="responsive-dialog-title" align="center">
                  <Typography variant="h5">
                    {'ปิดคิวรับสินค้า'}หมายเลข : <QueueTag id={queues.product_company_id || ''} token={queues.token} />
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <MainCard>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                          <strong>ข้อมูลเข้ารับสินค้า</strong>
                        </Typography>

                        <Grid container spacing={2} sx={{ p: 2 }}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="h5">
                              โกดังสินค้า:{' '}
                              <strong style={{ color: 'red' }}>
                                {warehousesList.find((x) => x.warehouse_id === warehouseId)?.description}
                              </strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="h5">
                              หัวจ่าย:{' '}
                              <strong style={{ color: 'red' }}>
                                {stationsList.find((x) => x.station_id === stationsId)?.station_description}
                              </strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                            <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
                              <strong>{teamloadingList.find((x) => x.team_id === teamId)?.team_name}</strong>
                            </Typography>
                          </Grid>
                          {teamLoading &&
                            teamLoading.map((item, index) => (
                              <Grid item xs={12} key={index}>
                                <Typography variant="h5">
                                  {item.manager_name && 'หัวหน้าโกดัง'}
                                  {item.checker_name && 'พนักงานจ่ายสินค้า'}
                                  {item.forklift_name && 'โฟล์คลิฟท์'}:{' '}
                                  <strong>
                                    {item.manager_name && item.manager_name}
                                    {item.checker_name && item.checker_name}
                                    {item.forklift_name && item.forklift_name}
                                  </strong>
                                </Typography>
                              </Grid>
                            ))}

                          <Grid item xs={12} md={6}>
                            <Typography variant="h5">
                              สายแรงงาน : <strong>{contractorList.find((x) => x.contractor_id === contractorId)?.contractor_name}</strong>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                          <strong>ข้อมูลรถเข้ารับสินค้า</strong>
                        </Typography>

                        <Grid container spacing={2} sx={{ p: 2 }}>
                          <Grid item xs={12} md={12}>
                            <Typography variant="h5">ร้านค้า/บริษัท : {queues.company_name}</Typography>
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <Typography variant="h5">ทะเบียนรถ: {queues.registration_no}</Typography>
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <Typography variant="h5">ชื่อคนขับ : {queues.driver_name}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        {orders.length > 0 && (
                          <Grid container spacing={2} sx={{ p: 2 }}>
                            <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                              <strong>ข้อมูลกองสินค้า:</strong>
                            </Typography>
                            {orders.map((ordersItems, orderId) => (
                              <Grid item xs={12} key={orderId}>
                                {ordersItems.product_brand_id !== null && ordersItems.product_company_id && (
                                  <Grid container spacing={2}>
                                    {ordersItems.items.map((orderItem, orderIndex) => (
                                      <>
                                        <Grid item xs={12} key={orderIndex}>
                                          <Grid container spacing={2}>
                                            {/* <Grid item xs={12}>
                                              <Typography variant="h5">บริษัท (สินค้า): {queues.product_company_name}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                              <Typography variant="h5">ตรา (สินค้า): {queues.product_brand_name}</Typography>
                                            </Grid> */}
                                            <Grid item xs={12}>
                                              <Typography variant="h5">กองสินค้า : {orderItem.name}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                              <Typography variant="h5">
                                                จำนวน : <strong>{orderItem.quantity}</strong> (ตัน)
                                              </Typography>
                                            </Grid>
                                          </Grid>

                                          {loopSelect.map(
                                            (onLoop, index) =>
                                              onLoop.order_id == orderItem.order_id &&
                                              onLoop.item_id == orderItem.item_id && (
                                                <MainCard key={index} sx={{ mb: 2 }}>
                                                  <FormControl sx={{ width: '100%' }} size="small">
                                                    <Select
                                                      displayEmpty
                                                      variant="outlined"
                                                      value={onLoop.product_register_id}
                                                      onChange={(e) => {
                                                        handleChangeProduct(e, orderItem.item_id, orderItem);
                                                        onLoop.product_register_id = e.target.value;

                                                        // ข้อมูลกองเก่า
                                                        orderItem.product_register_id = e.target.value;
                                                      }}
                                                    >
                                                      <MenuItem disabled value="">
                                                        เลือกกองสินค้า
                                                      </MenuItem>

                                                      {orderItem.productRegis.map(
                                                        (productRegis) =>
                                                          productRegis.product_register_id === onLoop.product_register_id && (
                                                            <MenuItem
                                                              key={productRegis.product_register_id}
                                                              value={productRegis.product_register_id}
                                                              disabled
                                                            >
                                                              {'โกดัง : ' + productRegis.warehouse_name + ' '}
                                                              {productRegis.product_register_name}
                                                              {productRegis.product_register_date
                                                                ? ` (${moment(productRegis.product_register_date.slice(0, 10)).format(
                                                                    'DD/MM/YY'
                                                                  )}) `
                                                                : '-'}
                                                              {productRegis.product_register_date
                                                                ? ` (${calculateAge(productRegis.product_register_date)}) `
                                                                : '-'}
                                                              {' (คงเหลือ : ' + productRegis.total_remain + ' ตัน) '}
                                                              {productRegis.product_register_remark ? (
                                                                <span style={{ color: 'red' }}>
                                                                  {' '}
                                                                  ({productRegis.product_register_remark})
                                                                </span>
                                                              ) : (
                                                                ''
                                                              )}
                                                              <strong> ({onLoop.product_register_quantity} ตัน)</strong>
                                                            </MenuItem>
                                                          )
                                                      )}
                                                    </Select>
                                                  </FormControl>

                                                  <Grid sx={{ mt: 2 }}>
                                                    <InputLabel sx={{ mt: 1, mb: 1 }}>ประเภท</InputLabel>
                                                    <FormControlLabel
                                                      control={
                                                        <Checkbox
                                                          checked={typeSelect.some(
                                                            (item) =>
                                                              item.id == orderItem.item_id &&
                                                              item.product_register_id == onLoop.product_register_id &&
                                                              item.name === 'checked1' &&
                                                              item.value === 'on'
                                                          )}
                                                          onChange={handleChangeSelect(orderItem.item_id, 'checked1', onLoop)}
                                                          name="checked1"
                                                        />
                                                      }
                                                      label="ทุบปุ๋ย"
                                                    />
                                                    <FormControlLabel
                                                      control={
                                                        <Checkbox
                                                          // checked={typeSelect[orderItem.item_id]?.checked2 || false}
                                                          checked={typeSelect.some(
                                                            (item) =>
                                                              item.id == orderItem.item_id &&
                                                              item.product_register_id == onLoop.product_register_id &&
                                                              item.name === 'checked2' &&
                                                              item.value === 'on'
                                                          )}
                                                          onChange={handleChangeSelect(orderItem.item_id, 'checked2', onLoop)}
                                                          name="checked2"
                                                        />
                                                      }
                                                      label="เกี่ยวสลิง"
                                                    />
                                                    <FormControlLabel
                                                      control={
                                                        <Checkbox
                                                          // checked={typeSelect[orderItem.item_id]?.checked3 || false}
                                                          checked={typeSelect.some(
                                                            (item) =>
                                                              item.id == orderItem.item_id &&
                                                              item.product_register_id == onLoop.product_register_id &&
                                                              item.name === 'checked3' &&
                                                              item.value === 'on'
                                                          )}
                                                          onChange={handleChangeSelect(orderItem.item_id, 'checked3', onLoop)}
                                                          name="checked3"
                                                        />
                                                      }
                                                      label="เรียงสลิง"
                                                    />
                                                    <FormControlLabel
                                                      control={
                                                        <Checkbox
                                                          // checked={typeSelect[orderItem.item_id]?.checked4 || false}
                                                          checked={typeSelect.some(
                                                            (item) =>
                                                              item.id == orderItem.item_id &&
                                                              item.product_register_id == onLoop.product_register_id &&
                                                              item.name === 'checked4' &&
                                                              item.value === 'on'
                                                          )}
                                                          onChange={handleChangeSelect(orderItem.item_id, 'checked4', onLoop)}
                                                          name="checked4"
                                                        />
                                                      }
                                                      label="เกี่ยวจัมโบ้"
                                                    />
                                                  </Grid>

                                                  {typeSelect.some(
                                                    (item) =>
                                                      item.id == orderItem.item_id &&
                                                      item.product_register_id == onLoop.product_register_id &&
                                                      item.name === 'checked1' &&
                                                      item.value === 'on'
                                                  ) && (
                                                    <Grid item xs={12} md={12}>
                                                      <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                                        จำนวนทุบปุ๋ย : (สูงสุด{' '}
                                                        {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                                      </InputLabel>
                                                      <FormControl sx={{ width: '100%' }} size="small">
                                                        <OutlinedInput
                                                          size="small"
                                                          id={typeNumSelect[orderItem.item_id]}
                                                          type="number"
                                                          value={
                                                            typeNumSelect.find(
                                                              (item) =>
                                                                item.id == orderItem.item_id &&
                                                                item.product_register_id == onLoop.product_register_id &&
                                                                item.name === 'checked1'
                                                            )?.value || ''
                                                          }
                                                          onChange={(e) => {
                                                            handleChangeTypeNum(
                                                              orderItem.item_id,
                                                              'checked1',
                                                              e,
                                                              parseFloat((onLoop.product_register_quantity * 1).toFixed(3)),
                                                              onLoop
                                                            );
                                                          }}
                                                          placeholder="จำนวน"
                                                        />
                                                      </FormControl>
                                                    </Grid>
                                                  )}
                                                  {typeSelect.some(
                                                    (item) =>
                                                      item.id == orderItem.item_id &&
                                                      item.product_register_id == onLoop.product_register_id &&
                                                      item.name === 'checked2' &&
                                                      item.value === 'on'
                                                  ) && (
                                                    <Grid item xs={12} md={12}>
                                                      <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                                        จำนวนเกี่ยวสลิง : (สูงสุด{' '}
                                                        {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                                      </InputLabel>
                                                      <FormControl sx={{ width: '100%' }} size="small">
                                                        <OutlinedInput
                                                          size="small"
                                                          id={typeNumSelect[orderItem.item_id]}
                                                          type="number"
                                                          value={
                                                            typeNumSelect.find(
                                                              (item) =>
                                                                item.id == orderItem.item_id &&
                                                                item.product_register_id == onLoop.product_register_id &&
                                                                item.name === 'checked2'
                                                            )?.value || ''
                                                          }
                                                          // onChange={(e) => {
                                                          //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                                          // }}
                                                          onChange={(e) => {
                                                            handleChangeTypeNum(
                                                              orderItem.item_id,
                                                              'checked2',
                                                              e,
                                                              parseFloat(onLoop.product_register_quantity),
                                                              onLoop
                                                            );
                                                          }}
                                                          placeholder="จำนวน"
                                                        />
                                                      </FormControl>
                                                    </Grid>
                                                  )}
                                                  {typeSelect.some(
                                                    (item) =>
                                                      item.id == orderItem.item_id &&
                                                      item.product_register_id == onLoop.product_register_id &&
                                                      item.name === 'checked3' &&
                                                      item.value === 'on'
                                                  ) && (
                                                    <Grid item xs={12} md={12}>
                                                      <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                                        จำนวนเรียงสลิง : (สูงสุด{' '}
                                                        {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                                      </InputLabel>
                                                      <FormControl sx={{ width: '100%' }} size="small">
                                                        <OutlinedInput
                                                          size="small"
                                                          id={typeNumSelect[orderItem.item_id]}
                                                          type="number"
                                                          value={
                                                            typeNumSelect.find(
                                                              (item) =>
                                                                item.id == orderItem.item_id &&
                                                                item.product_register_id == onLoop.product_register_id &&
                                                                item.name === 'checked3'
                                                            )?.value || ''
                                                          }
                                                          // onChange={(e) => {
                                                          //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                                          // }}
                                                          onChange={(e) => {
                                                            handleChangeTypeNum(
                                                              orderItem.item_id,
                                                              'checked3',
                                                              e,
                                                              parseFloat(onLoop.product_register_quantity),
                                                              onLoop
                                                            );
                                                          }}
                                                          placeholder="จำนวน"
                                                        />
                                                      </FormControl>
                                                    </Grid>
                                                  )}
                                                  {typeSelect.some(
                                                    (item) =>
                                                      item.id == orderItem.item_id &&
                                                      item.product_register_id == onLoop.product_register_id &&
                                                      item.name === 'checked4' &&
                                                      item.value === 'on'
                                                  ) && (
                                                    <Grid item xs={12} md={12}>
                                                      <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                                        จำนวนเกี่ยวจัมโบ้ : (สูงสุด{' '}
                                                        {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                                      </InputLabel>
                                                      <FormControl sx={{ width: '100%' }} size="small">
                                                        <OutlinedInput
                                                          size="small"
                                                          id={typeNumSelect[orderItem.item_id]}
                                                          type="number"
                                                          value={
                                                            typeNumSelect.find(
                                                              (item) =>
                                                                item.id == orderItem.item_id &&
                                                                item.product_register_id == onLoop.product_register_id &&
                                                                item.name === 'checked4'
                                                            )?.value || ''
                                                          }
                                                          // onChange={(e) => {
                                                          //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                                          // }}
                                                          onChange={(e) => {
                                                            handleChangeTypeNum(
                                                              orderItem.item_id,
                                                              'checked4',
                                                              e,
                                                              parseFloat(onLoop.product_register_quantity),
                                                              onLoop
                                                            );
                                                          }}
                                                          placeholder="จำนวน"
                                                        />
                                                      </FormControl>
                                                    </Grid>
                                                  )}
                                                </MainCard>
                                              )
                                          )}
                                        </Grid>
                                      </>
                                    ))}
                                  </Grid>
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </Grid>
                      {queues.company_name === '9999999' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body">
                              <strong>ชื่อผู้ขับ :</strong> {queues.driver_name}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="body">
                              <strong>ทะเบียนรถ :</strong> {queues.registration_no}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="body">
                              <strong>เลขที่บัตรประชาชน :</strong> {queues.id_card_no}
                              {'-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="body">
                              <strong>เลขที่ใบขับขี่ :</strong> {queues.license_no}{' '}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <InputLabel>โกดังสินค้า</InputLabel>
                            <FormControl sx={{ width: '100%' }} size="small">
                              <Select
                                displayEmpty
                                variant="outlined"
                                disabled={warehouseId && 'disabled'}
                                value={warehouseId}
                                onChange={(e) => {
                                  handleChangeWarehouse(e);
                                }}
                                placeholder="เลือกโกดังสินค้า"
                              >
                                <MenuItem disabled value="">
                                  เลือกโกดังสินค้า
                                </MenuItem>
                                {warehousesList.length > 0 &&
                                  warehousesList.map((warehouses) => (
                                    <MenuItem key={warehouses.warehouse_id} value={warehouses.warehouse_id}>
                                      {warehouses.description}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <InputLabel>หัวจ่าย</InputLabel>
                            <FormControl sx={{ width: '100%' }} size="small">
                              <Select
                                displayEmpty
                                variant="outlined"
                                disabled={stationsId && 'disabled'}
                                value={stationsId == null ? '' : stationsId}
                                onChange={(e) => {
                                  handleChangeStation(e);
                                }}
                                placeholder="เลือกหัวจ่าย"
                              >
                                <MenuItem disabled value="">
                                  เลือกหัวจ่าย
                                </MenuItem>
                                {stationsList.length > 0 &&
                                  stationsList.map((station) => (
                                    <MenuItem key={station.station_id} value={station.station_id}>
                                      {station.station_description}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <InputLabel>ทีมรับสินค้า</InputLabel>
                            <FormControl sx={{ width: '100%' }} size="small">
                              <Select
                                displayEmpty
                                disabled={teamId !== null && teamId && 'disabled'}
                                variant="outlined"
                                value={teamId == null ? '' : teamId}
                                onChange={(e) => {
                                  handleChangeTeam(e.target.value);
                                }}
                                placeholder="เลือกทีมรับสินค้า"
                              >
                                <MenuItem disabled value="">
                                  เลือกทีมรับสินค้า
                                </MenuItem>
                                {teamloadingList.length > 0 &&
                                  teamloadingList.map((teamload) => (
                                    <MenuItem key={teamload.team_id} value={teamload.team_id}>
                                      {teamload.team_name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <InputLabel>สายแรงงาน</InputLabel>
                            <FormControl sx={{ width: '100%' }} size="small">
                              <Select
                                displayEmpty
                                variant="outlined"
                                value={contractorId == null ? '' : contractorId}
                                onChange={(e) => {
                                  handleChangeContractor(e);
                                  setcontractorId(e.target.value);
                                }}
                                placeholder="เลือกสายแรงงาน"
                              >
                                <MenuItem disabled value="">
                                  เลือกสายแรงงาน
                                </MenuItem>
                                {contractorList.length > 0 &&
                                  contractorList.map((contractorList) => (
                                    <MenuItem key={contractorList.contractor_id} value={contractorList.contractor_id}>
                                      {contractorList.contractor_name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6} sx={{ display: 'none' }}>
                            <InputLabel>หมายเลขสาย</InputLabel>
                            <FormControl sx={{ width: '100%' }} size="small">
                              <Select
                                displayEmpty
                                variant="outlined"
                                value={labor_line_id == null ? '' : labor_line_id}
                                onChange={(e) => {
                                  handleChangeLaborLine(e);
                                }}
                                placeholder="เลือกหมายเลขสาย"
                              >
                                <MenuItem disabled value="">
                                  เลือกหมายเลขสาย
                                </MenuItem>
                                {layborLineList.length > 0 &&
                                  layborLineList.map((layborLine) => (
                                    <MenuItem key={layborLine.labor_line_id} value={layborLine.labor_line_id}>
                                      {layborLine.labor_line_name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          {orders.length > 0 && (
                            <Grid item xs={12}>
                              <Grid item xs={12}>
                                <Typography variant="h5">
                                  <strong>ข้อมูลกองสินค้า:</strong>
                                </Typography>
                              </Grid>
                              {orders.map((ordersItems, orderId) => (
                                <div key={orderId}>
                                  {ordersItems.product_brand_id !== null && ordersItems.product_company_id && (
                                    <Grid container spacing={2}>
                                      {ordersItems.items.map((orderItem, orderIndex) => (
                                        <>
                                          <Grid item xs={12} md={12} key={orderIndex}>
                                            <InputLabel sx={{ mt: 1, mb: 1 }}>กองสินค้า : {orderItem.name}</InputLabel>
                                            <InputLabel sx={{ mt: 1, mb: 1 }}>
                                              จำนวน : <strong>{orderItem.quantity}</strong> (ตัน)
                                            </InputLabel>
                                            {loopSelect.map(
                                              (onLoop, index) =>
                                                onLoop.order_id == orderItem.order_id &&
                                                onLoop.item_id == orderItem.item_id && (
                                                  <MainCard key={index} sx={{ mb: 2 }}>
                                                    <FormControl sx={{ width: '100%' }} size="small">
                                                      <Select
                                                        displayEmpty
                                                        variant="outlined"
                                                        value={onLoop.product_register_id}
                                                        onChange={(e) => {
                                                          handleChangeProduct(e, orderItem.item_id, orderItem);
                                                          onLoop.product_register_id = e.target.value;

                                                          // ข้อมูลกองเก่า
                                                          orderItem.product_register_id = e.target.value;
                                                        }}
                                                      >
                                                        <MenuItem disabled value="">
                                                          เลือกกองสินค้า
                                                        </MenuItem>

                                                        {orderItem.productRegis.map(
                                                          (productRegis) =>
                                                            productRegis.product_register_id === onLoop.product_register_id && (
                                                              <MenuItem
                                                                key={productRegis.product_register_id}
                                                                value={productRegis.product_register_id}
                                                                disabled
                                                              >
                                                                {'โกดัง : ' + productRegis.warehouse_name + ' '}
                                                                {productRegis.product_register_name}
                                                                {productRegis.product_register_date
                                                                  ? ` (${moment(productRegis.product_register_date.slice(0, 10)).format(
                                                                      'DD/MM/YY'
                                                                    )}) `
                                                                  : '-'}
                                                                {productRegis.product_register_date
                                                                  ? ` (${calculateAge(productRegis.product_register_date)}) `
                                                                  : '-'}
                                                                {productRegis.product_register_remark ? (
                                                                  <span style={{ color: 'red' }}>
                                                                    {' '}
                                                                    ({productRegis.product_register_remark})
                                                                  </span>
                                                                ) : (
                                                                  ''
                                                                )}
                                                                <strong> ({onLoop.product_register_quantity} ตัน)</strong>
                                                              </MenuItem>
                                                            )
                                                        )}
                                                      </Select>
                                                    </FormControl>

                                                    <Grid sx={{ mt: 2 }}>
                                                      <InputLabel sx={{ mt: 1, mb: 1 }}>ประเภท</InputLabel>
                                                      <FormControlLabel
                                                        control={
                                                          <Checkbox
                                                            checked={typeSelect.some(
                                                              (item) =>
                                                                item.id == orderItem.item_id &&
                                                                item.product_register_id == onLoop.product_register_id &&
                                                                item.name === 'checked1' &&
                                                                item.value === 'on'
                                                            )}
                                                            onChange={handleChangeSelect(orderItem.item_id, 'checked1', onLoop)}
                                                            name="checked1"
                                                          />
                                                        }
                                                        label="ทุบปุ๋ย"
                                                      />
                                                      <FormControlLabel
                                                        control={
                                                          <Checkbox
                                                            // checked={typeSelect[orderItem.item_id]?.checked2 || false}
                                                            checked={typeSelect.some(
                                                              (item) =>
                                                                item.id == orderItem.item_id &&
                                                                item.product_register_id == onLoop.product_register_id &&
                                                                item.name === 'checked2' &&
                                                                item.value === 'on'
                                                            )}
                                                            onChange={handleChangeSelect(orderItem.item_id, 'checked2', onLoop)}
                                                            name="checked2"
                                                          />
                                                        }
                                                        label="เกี่ยวสลิง"
                                                      />
                                                      <FormControlLabel
                                                        control={
                                                          <Checkbox
                                                            // checked={typeSelect[orderItem.item_id]?.checked3 || false}
                                                            checked={typeSelect.some(
                                                              (item) =>
                                                                item.id == orderItem.item_id &&
                                                                item.product_register_id == onLoop.product_register_id &&
                                                                item.name === 'checked3' &&
                                                                item.value === 'on'
                                                            )}
                                                            onChange={handleChangeSelect(orderItem.item_id, 'checked3', onLoop)}
                                                            name="checked3"
                                                          />
                                                        }
                                                        label="เรียงสลิง"
                                                      />
                                                      <FormControlLabel
                                                        control={
                                                          <Checkbox
                                                            // checked={typeSelect[orderItem.item_id]?.checked4 || false}
                                                            checked={typeSelect.some(
                                                              (item) =>
                                                                item.id == orderItem.item_id &&
                                                                item.product_register_id == onLoop.product_register_id &&
                                                                item.name === 'checked4' &&
                                                                item.value === 'on'
                                                            )}
                                                            onChange={handleChangeSelect(orderItem.item_id, 'checked4', onLoop)}
                                                            name="checked4"
                                                          />
                                                        }
                                                        label="เกี่ยวจัมโบ้"
                                                      />
                                                    </Grid>

                                                    {typeSelect.some(
                                                      (item) =>
                                                        item.id == orderItem.item_id &&
                                                        item.product_register_id == onLoop.product_register_id &&
                                                        item.name === 'checked1' &&
                                                        item.value === 'on'
                                                    ) && (
                                                      <Grid item xs={12} md={12}>
                                                        <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                                          จำนวนทุบปุ๋ย : (สูงสุด{' '}
                                                          {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                                        </InputLabel>
                                                        <FormControl sx={{ width: '100%' }} size="small">
                                                          <OutlinedInput
                                                            size="small"
                                                            id={typeNumSelect[orderItem.item_id]}
                                                            type="number"
                                                            value={
                                                              typeNumSelect.find(
                                                                (item) =>
                                                                  item.id == orderItem.item_id &&
                                                                  item.product_register_id == onLoop.product_register_id &&
                                                                  item.name === 'checked1'
                                                              )?.value || ''
                                                            }
                                                            onChange={(e) => {
                                                              handleChangeTypeNum(
                                                                orderItem.item_id,
                                                                'checked1',
                                                                e,
                                                                parseFloat((onLoop.product_register_quantity * 1).toFixed(3)),
                                                                onLoop
                                                              );
                                                            }}
                                                            placeholder="จำนวน"
                                                          />
                                                        </FormControl>
                                                      </Grid>
                                                    )}
                                                    {typeSelect.some(
                                                      (item) =>
                                                        item.id == orderItem.item_id &&
                                                        item.product_register_id == onLoop.product_register_id &&
                                                        item.name === 'checked2' &&
                                                        item.value === 'on'
                                                    ) && (
                                                      <Grid item xs={12} md={12}>
                                                        <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                                          จำนวนเกี่ยวสลิง : (สูงสุด{' '}
                                                          {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                                        </InputLabel>
                                                        <FormControl sx={{ width: '100%' }} size="small">
                                                          <OutlinedInput
                                                            size="small"
                                                            id={typeNumSelect[orderItem.item_id]}
                                                            type="number"
                                                            value={
                                                              typeNumSelect.find(
                                                                (item) =>
                                                                  item.id == orderItem.item_id &&
                                                                  item.product_register_id == onLoop.product_register_id &&
                                                                  item.name === 'checked2'
                                                              )?.value || ''
                                                            }
                                                            // onChange={(e) => {
                                                            //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                                            // }}
                                                            onChange={(e) => {
                                                              handleChangeTypeNum(
                                                                orderItem.item_id,
                                                                'checked2',
                                                                e,
                                                                parseFloat(onLoop.product_register_quantity),
                                                                onLoop
                                                              );
                                                            }}
                                                            placeholder="จำนวน"
                                                          />
                                                        </FormControl>
                                                      </Grid>
                                                    )}
                                                    {typeSelect.some(
                                                      (item) =>
                                                        item.id == orderItem.item_id &&
                                                        item.product_register_id == onLoop.product_register_id &&
                                                        item.name === 'checked3' &&
                                                        item.value === 'on'
                                                    ) && (
                                                      <Grid item xs={12} md={12}>
                                                        <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                                          จำนวนเรียงสลิง : (สูงสุด{' '}
                                                          {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                                        </InputLabel>
                                                        <FormControl sx={{ width: '100%' }} size="small">
                                                          <OutlinedInput
                                                            size="small"
                                                            id={typeNumSelect[orderItem.item_id]}
                                                            type="number"
                                                            value={
                                                              typeNumSelect.find(
                                                                (item) =>
                                                                  item.id == orderItem.item_id &&
                                                                  item.product_register_id == onLoop.product_register_id &&
                                                                  item.name === 'checked3'
                                                              )?.value || ''
                                                            }
                                                            // onChange={(e) => {
                                                            //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                                            // }}
                                                            onChange={(e) => {
                                                              handleChangeTypeNum(
                                                                orderItem.item_id,
                                                                'checked3',
                                                                e,
                                                                parseFloat(onLoop.product_register_quantity),
                                                                onLoop
                                                              );
                                                            }}
                                                            placeholder="จำนวน"
                                                          />
                                                        </FormControl>
                                                      </Grid>
                                                    )}
                                                    {typeSelect.some(
                                                      (item) =>
                                                        item.id == orderItem.item_id &&
                                                        item.product_register_id == onLoop.product_register_id &&
                                                        item.name === 'checked4' &&
                                                        item.value === 'on'
                                                    ) && (
                                                      <Grid item xs={12} md={12}>
                                                        <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                                          จำนวนเกี่ยวจัมโบ้ : (สูงสุด{' '}
                                                          {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                                        </InputLabel>
                                                        <FormControl sx={{ width: '100%' }} size="small">
                                                          <OutlinedInput
                                                            size="small"
                                                            id={typeNumSelect[orderItem.item_id]}
                                                            type="number"
                                                            value={
                                                              typeNumSelect.find(
                                                                (item) =>
                                                                  item.id == orderItem.item_id &&
                                                                  item.product_register_id == onLoop.product_register_id &&
                                                                  item.name === 'checked4'
                                                              )?.value || ''
                                                            }
                                                            // onChange={(e) => {
                                                            //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                                            // }}
                                                            onChange={(e) => {
                                                              handleChangeTypeNum(
                                                                orderItem.item_id,
                                                                'checked4',
                                                                e,
                                                                parseFloat(onLoop.product_register_quantity),
                                                                onLoop
                                                              );
                                                            }}
                                                            placeholder="จำนวน"
                                                          />
                                                        </FormControl>
                                                      </Grid>
                                                    )}
                                                  </MainCard>
                                                )
                                            )}
                                          </Grid>
                                        </>
                                      ))}
                                    </Grid>
                                  )}
                                </div>
                              ))}
                            </Grid>
                          )}
                          {teamLoading.length > 0 && (
                            <Grid item xs={12}>
                              <Grid item xs={12}>
                                <Typography variant="h5">
                                  <strong>ข้อมูลทีมขึ้นสินค้า:</strong>
                                </Typography>
                              </Grid>
                              <TableContainer>
                                <Table
                                  aria-labelledby="tableTitle"
                                  size="small"
                                  sx={{
                                    '& .MuiTableCell-root:first-of-type': {
                                      pl: 2
                                    },
                                    '& .MuiTableCell-root:last-of-type': {
                                      pr: 3
                                    }
                                  }}
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center">ลำดับ</TableCell>
                                      <TableCell align="left">รายชื่อ</TableCell>
                                      <TableCell align="left">ตำแหน่ง</TableCell>
                                    </TableRow>
                                  </TableHead>

                                  {teamLoading ? (
                                    <TableBody>
                                      {teamLoading.map((item, index) => (
                                        <TableRow key={index}>
                                          <TableCell align="center">{index + 1}</TableCell>
                                          <TableCell align="left">
                                            {item.manager_name && item.manager_name}
                                            {item.checker_name && item.checker_name}
                                            {item.forklift_name && item.forklift_name}
                                          </TableCell>
                                          <TableCell align="left">
                                            {item.manager_name && 'หัวหน้าโกดัง'}
                                            {item.checker_name && 'พนักงานจ่ายสินค้า'}
                                            {item.forklift_name && 'โฟล์คลิฟท์'}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={13} align="center">
                                        ไม่พบข้อมูล
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </Table>
                              </TableContainer>
                            </Grid>
                          )}
                        </>
                      )}
                    </Grid>
                  </MainCard>
                  <DialogContentText>{/* ต้องการ {textnotify} ID:{id_update} หรือไม่? */}</DialogContentText>
                </DialogContent>
              </>
            ) : (
              <>
                <DialogTitle id="responsive-dialog-title" align="center">
                  <Typography variant="h5">{'ยกเลิกคิวรับสินค้า'}</Typography>
                </DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    ต้องการ <strong> {textnotify} </strong> คิวหมายเลข :{' '}
                    <QueueTag id={queues.product_company_id || ''} token={queues.token} /> หรือไม่?
                  </DialogContentText>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      defaultValue={stationStatus == '' ? 'Y' : 'N'}
                      onChange={(e) => handleSelectCloseStation(e.target.value)}
                    >
                      <FormControlLabel value="Y" control={<Radio />} label={'แก้ไขรายการคำสั่งซื้อ'} />
                      <FormControlLabel value="N" control={<Radio />} label={'ยกเลิกเข้าหัวจ่าย'} />
                    </RadioGroup>
                  </FormControl>
                </DialogContent>
              </>
            )}
            <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
              <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
                ยกเลิก
              </Button>
              <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
                ยืนยัน
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Grid>
          <TableContainer
            sx={{
              width: '100%',
              overflowX: 'auto',
              position: 'relative',
              display: 'block',
              maxWidth: '100%',
              '& td, & th': { whiteSpace: 'nowrap' }
            }}
          >
            <Table aria-labelledby="tableTitle">
              <QueueTableHead />
              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      <CircularProgress />
                      <Typography variant="body1">Loading....</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {items.length > 0 &&
                    items.map((row, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell align="center">
                            <Typography>
                              <strong>{index + 1}</strong>
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {moment(row.queue_date.slice(0, 10)).format('DD/MM/YY')}
                            {row.queue_time ? ' - ' + row.queue_time.slice(0, 5) + 'น.' : ''}
                          </TableCell>
                          <TableCell align="center">
                            <QueueTag id={row.product_company_id || ''} token={row.token} />
                            {moment(row.queue_date.slice(0, 10)).format('DD/MM/YYYY') != moment(new Date()).format('DD/MM/YYYY') && (
                              <span style={{ color: 'red' }}> (คิวค้าง)</span>
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {row.description ? <strong style={{ color: 'red' }}>{row.description}</strong> : '-'}
                          </TableCell>
                          <TableCell align="center">
                            <Chip color="primary" sx={{ width: '122px' }} label={row.registration_no} />
                          </TableCell>
                          <TableCell align="left">
                            <Typography sx={{ width: '160px' }}>{row.station_description}</Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography sx={{ width: '240px' }}>
                              {row.company_name} ({row.count_car_id} คิว)
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{row.driver_name}</TableCell>
                          <TableCell align="left">{row.driver_mobile}</TableCell>
                          <TableCell align="left">{row.start_time ? row.start_time.slice(11, 19) : '-'}</TableCell>
                          <TableCell align="center">
                            {row.recall_status == 'Y' ? <Chip color="error" sx={{ width: '80px' }} label={'ทวนสอบ'} /> : '-'}
                          </TableCell>
                          <TableCell align="center">
                            {status == 'waiting' && <Chip color="warning" sx={{ width: '95px' }} label={'รอขึ้นสินค้า'} />}
                            {status == 'processing' && <Chip color="success" sx={{ width: '95px' }} label={'ขึ้นสินค้า'} />}
                          </TableCell>
                          {status == 'processing' && (
                            <TableCell align="center">
                              <Tooltip title="เรียกคิว">
                                <span>
                                  <Button
                                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                    variant="contained"
                                    size="small"
                                    align="center"
                                    color="info"
                                    disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                    onClick={() => handleCallQueue(row)}
                                  >
                                    <SoundOutlined />
                                  </Button>
                                </span>
                              </Tooltip>
                            </TableCell>
                          )}

                          {status == 'waiting' && (
                            <TableCell align="center">
                              <FormControl sx={{ minWidth: 140 }} size="small">
                                <Select
                                  size="small"
                                  labelId={`station-select-label-${row.step_id}`}
                                  disabled
                                  value={selectedStations[row.step_id] || row.reserve_station_id} // ใช้สถานีที่ถูกเลือกในแต่ละแถวหรือสถานีที่ถูกจองเริ่มต้น
                                  onChange={(event) => handleStationChange(event, row)}
                                >
                                  {stations.map((station) => (
                                    <MenuItem key={station.station_id} value={station.station_id}>
                                      {station.station_description}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                          )}

                          <TableCell align="right" width="120" sx={{ width: 120, maxWidth: 120 }}>
                            <ButtonGroup aria-label="button group" sx={{ alignItems: 'center' }}>
                              {status == 'waiting' && (
                                <Tooltip title="เรียกคิว">
                                  {/* <Button
                                    // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                    variant="contained"
                                    size="small"
                                    color="info"
                                    disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                    onClick={handleClickOpentest}
                                  >
                                    ทดสอบ
                                  </Button> */}
                                  <Button
                                    // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                    variant="contained"
                                    size="small"
                                    color="info"
                                    disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                    onClick={() =>
                                      handleClickOpen(
                                        row.step_id,
                                        'call',
                                        row.queue_id,
                                        selectedStations[row.step_id] || row.reserve_station_id,
                                        row
                                      )
                                    }
                                    endIcon={<RightSquareOutlined />}
                                  >
                                    เรียกคิว
                                  </Button>
                                </Tooltip>
                              )}

                              {status == 'processing' && (
                                <div>
                                  <Tooltip title="ยกเลิก">
                                    <Button
                                      // startIcon={<ArrowBackIosIcon />}
                                      variant="contained"
                                      size="small"
                                      disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                      onClick={() => handleClickOpen(row.step_id, 'cancel', row.queue_id, row.station_id, row)}
                                      color="error"
                                    >
                                      ยกเลิก
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title="ปิดคิว">
                                    <span>
                                      <Button
                                        size="small"
                                        variant="contained"
                                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                        onClick={() => handleClickOpen(row.step_id, 'close', row.queue_id, row.station_id, row)}
                                      >
                                        ปิดคิว
                                      </Button>
                                    </span>
                                  </Tooltip>
                                </div>
                              )}
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {items.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        ไม่พบข้อมูล
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </>
  );
};
