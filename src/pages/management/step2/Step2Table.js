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
import { Stack } from '../../../../node_modules/@mui/material/index';

export const Step2Table = ({ status, title, onStatusChange, onFilter }) => {
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
  saveLoading;
  const [message, setMessage] = useState('');

  //เพิ่ม function get จำนวนสถานีของ step 1
  const station_num = 20;
  const [station_id, setStationId] = useState(0);

  const [loopSelect, setLoopSelect] = useState([]);

  useEffect(() => {
    fetchData();
    getWarehouses();
    getAllContractor();
    getWareHouseManager();
    getAllItemsRegisters();
  }, [status, onStatusChange, onFilter, loopSelect]);

  const fetchData = async () => {
    try {
      // Use different API functions based on the status
      if (status === 'waiting') {
        await waitingGet();
      } else if (status === 'processing') {
        await processingGet();
      }
      await getStation();
      await getStepCount(2, 'processing');
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

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

  const cleckStations = async () => {
    try {
      getQueues.getStep2Processing().then((response) => {
        setItems2(response);
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

  const getStation = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise((resolve, reject) => {
      fetch(apiUrl + '/allstations', requestOptions)
        .then((response) => response.json())
        .then((result) => {
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

  const updateLoadingTeam = (step_id) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        team_id: teamId,
        contractor_id: contractorId,
        labor_line_id: labor_line_id
      });

      // updateTeamLoading(queues.reserve_id, teamValue);
      // updateTeamData(queues.reserve_id, teamData);

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updateloadigteam/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
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
  const step1Update = (step_id, statusupdate, stations_id) => {
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
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        status: statusupdate,
        station_id: stations_id,
        updated_at: currentDate
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

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
    });
  };

  //Update ข้อมูลรอเรียกคิวสถานีถัดไป
  const step2Update = (step_id, statusupdate, station_id) => {
    return new Promise((resolve, reject) => {
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        status: statusupdate,
        station_id: station_id,
        updated_at: currentDate
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updatestepstatus/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => {
          console.error('error', error);
          reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
        });
    });
  };

  //Update start_time of step
  const [queues, setQueues] = useState([]);
  const updateStartTime = (step_id) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

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
  const updateEndTime = (step_id) => {
    //alert("updateEndTime")
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

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
  const getReserveId = async (id) => {
    stepRequest.getReserveById(id).then((response) => {
      if (response) {
        response.reserve.map((result) => {
          getStationById(result.warehouse_id);
          getTeamloadingByIdwh(result.warehouse_id);

          if (result.contractor_id) {
            getLaborLine(result.contractor_id);
          }

          if (result.team_id !== null) {
            if (result.team_data === null || result.team_data.team_id === null) {
              getTeamloadingByIds(result.team_id);
            } else if (result.team_data.team_data && result.team_data.team_data.team_id === null) {
              getTeamloadingByIds(result.team_id);
            } else if (result.team_data.length > 0 || result.team_data) {
              setTeamData(result.team_data);

              const combinedData = [
                ...result.team_data.team_managers,
                ...result.team_data.team_checkers,
                ...result.team_data.team_forklifts
              ];
              setTeamLoading(combinedData);
            }
          }

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
  const [loadOrders, setLoadOrder] = useState(false);

  // const [productRegister, setProductRegister] = useState([]);
  const getOrderOfReserve = async (id) => {
    setLoadOrder(true);
    await reserveRequest.getOrderByReserveId(id).then((response) => {
      if (response.length > 0) {
        response.map((result) => {
          if (result.product_company_id && result.product_brand_id) {
            result.items.map((data) => {
              const getProductRegis = productList.filter(
                (x) =>
                  x.product_id == data.product_id &&
                  x.product_brand_id == result.product_brand_id &&
                  x.product_company_id == result.product_company_id
              );
              // ####################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################
              data.productRegis = getProductRegis;

              const getItemsRegisData = allItemsRegister.filter(
                (option) => option.order_id === data.order_id && option.item_id === data.item_id
              );
              console.log('getItemsRegisData :', getItemsRegisData);

              const selectedOption = {
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
              if (getItemsRegisData.length > 0) {
                getItemsRegisData.map((x) => {
                  setLoopSelect((prevState) => {
                    const updatedOptions = [...prevState];
                    updatedOptions.push(x);

                    console.log('updatedOptions :', updatedOptions);
                    return updatedOptions;
                  });
                });
              } else {
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
        setLoadOrder(false);
      }
    });
  };

  const [productList, setProductList] = useState([]);
  const getWareHouseManager = async () => {
    try {
      adminRequest.getAllProductRegister().then((response) => {
        if (onFilter) {
          setProductList(response.filter((x) => x.product_company_id == onFilter));
        } else {
          setProductList(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [orderSelect, setOrderSelect] = useState([]);
  // const [orderSelectNew, setOrderSelectNew] = useState([]);
  const handleChangeProduct = (e, id, items) => {
    // const { value } = e.target;
    // ####################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################
    const selectedOption = { id: id, value: e.target.value };

    const stockItem = items.productRegis.find((x) => x.product_register_id === e.target.value)?.total_remain;
    const orderList = loopSelect.filter(
      (option) => option.item_id == items.item_id && option.order_id == items.order_id && option.product_register_id === e.target.value
    );

    const selectedOptionNew = {
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

    // console.log('items ', items);
    // console.log('e.target.value ', e.target.value);
    // console.log('indexList ', indexList);
    // console.log('indexList.length ', indexList.length);
    // console.log('orderList ', orderList);

    if (parseFloat(stockItem) < parseFloat(items.quantity) && orderList.length < 3 && orderList.length < items.productRegis.length) {
      const selectedOption = {
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
      setLoopSelect((prevState) => {
        const updatedOptions = [...prevState];
        updatedOptions.push(selectedOption);
        return updatedOptions;
      });
    } else if (orderList.length > 0) {
      setLoopSelect((prevState) => {
        const updatedOptions = [...prevState];

        return updatedOptions.filter(
          (x) =>
            (x.item_id == id && x.order_id == items.order_id && x.product_register_id !== '' && x.product_register_quantity !== 0) ||
            x.item_id !== id
        );
      });
    }

    setLoopSelect((prevState) => {
      let updatedOptions = [...prevState];
      const index = updatedOptions.findIndex(
        (option) =>
          option.item_id == id &&
          option.order_id == items.order_id &&
          (option.product_register_id == e.target.value || option.product_register_id == '')
      );

      console.log('updatedOptions filter length:', updatedOptions.filter((x) => x.product_register_id == e.target.value).length);
      console.log(
        'updatedOptions filter:',
        updatedOptions.filter((x) => x.product_register_id)
      );

      if (updatedOptions.filter((x) => x.product_register_id === e.target.value).length > 1) {
        const removeDuplicates = (arr) => {
          const uniqueIds = {};
          return arr.filter((obj) => {
            if (!uniqueIds[obj.product_register_id]) {
              uniqueIds[obj.product_register_id] = true;
              return true;
            }
            return false;
          });
        };
        updatedOptions = removeDuplicates(updatedOptions);
        updatedOptions[index] = selectedOptionNew;
      }

      const orderLists = updatedOptions.filter((option) => option.item_id === items.item_id && option.order_id === items.order_id);
      console.log('orderLists:', orderLists);
      if (orderLists.length > 1) {
        let sumQuantity = 0;
        orderLists.map((x) => {
          sumQuantity = x.product_register_quantity + sumQuantity;
        });

        if (sumQuantity <= parseFloat(items.quantity) && selectedOptionNew.product_register_quantity >= parseFloat(items.quantity)) {
          selectedOptionNew.product_register_quantity = parseFloat(items.quantity) - sumQuantity;
        }
        // else if (sumQuantity >= parseFloat(items.quantity)) {
        //   selectedOptionNew.product_register_quantity = parseFloat(items.quantity);
        // }
      }

      updatedOptions[index] = selectedOptionNew;

      console.log('updatedOptions New:', updatedOptions);
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
  const handleChangeSelect = (id, name) => (event) => {
    const { value, checked } = event.target;
    // setTypeSelect((prevState) => ({
    //   ...prevState,
    //   [id]: { ...prevState[id], [name]: checked ? value || true : false }
    // }));
    const selectedOption = { id: id, name: name, value: checked ? value || true : false };

    setTypeSelect((prevState) => {
      const updatedOptions = [...prevState];

      const index = updatedOptions.findIndex((option) => option.id === id && option.name === name);
      if (index !== -1) {
        updatedOptions[index] = selectedOption;
      } else {
        updatedOptions.push(selectedOption);
      }
      return updatedOptions;
    });
  };

  const [typeNumSelect, setTypeNumSelect] = useState({});
  const handleChangeTypeNum = (id, name, e, maxNum) => {
    const selectedOption = { id: id, name: name, value: e.target.value };

    if (e.target.value > maxNum) {
      alert(`จำนวนสินค้าต้องไม่เกิน "${maxNum}" ตัน`);
      return;
    } else if (e.target.value < 0) {
      alert(`จำนวนสินค้าต้องมากกว่า "0" ตัน`);
      return;
    } else {
      setTypeNumSelect((prevState) => {
        const updatedOptions = [...prevState];

        const index = updatedOptions.findIndex((option) => option.id === id && option.name === name);
        if (index !== -1) {
          updatedOptions[index] = selectedOption;
        } else {
          updatedOptions.push(selectedOption);
        }
        return updatedOptions;
      });

      // setTypeNumSelect((prevState) => ({
      //   ...prevState,
      //   [id]: e.target.value
      // }));
    }
  };

  // =============== ปรับสถานะหัวจ่าย ===============//
  const updateStation = (id, status) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

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
        setMessage('ขึ้นสินค้า–STEP2 ยกเลิกเรียกคิว');
        setText('ยกเลิก');
      }
    }

    //กดปุ่มมาจากไหน
    setFrom(fr);
    setUpdate(step_id);
    setStationId(station_id);
    getStepId(3, queues_id);
    setQueues(queuesData);
    setOpen(true);
  };

  // ####################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################
  const handleClose = async (flag) => {
    //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
    if (flag === 1) {
      if (fr === 'call') {
        if (station_count < station_num) {
          if (station_id) {
            let countItem = 0;
            orders.map((orderData) => {
              countItem = countItem + orderData.items.length;
            });

            let checkCountItemLoop = 0;
            loopSelect.map((orderData) => {
              if (!orderData.product_register_quantity) checkCountItemLoop = checkCountItemLoop + 1;
            });

            if (checkCountItemLoop > 0) {
              alert('กรุณาระบุกองสินค้าให้ครบถ้วน');
              return;
            } else if (orderSelect.length != countItem) {
              alert('กรุณาระบุกองสินค้าให้ครบถ้วน');
              return;
            } else {
              setLoading(true);
              setOpen(false);

              loopSelect.map((x) => {
                addItemsRegister(x);
              });

              // if (station_id == 99999) {
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

              updateStation(station_id, 'working');
              setStationCount(station_count + 1);
              await step1Update(id_update, 'processing', station_id);
              await updateStartTime(id_update);
              await getWareHouseManager();
              // }
              getAllItemsRegisters();
              setLoopSelect([]);
            }
          } else {
            alert('กรุณาเลือกหัวจ่าย');
          }
        } else {
          alert('สถานีบริการเต็ม');
        }
      } else {
        if (fr === 'close') {
          //ปิดคิว: Update waiting Step2 ตามหมายเลขคิว 27 = Station ว่าง
          if (teamId === '' || teamId === null) {
            alert('กรุณาเลือกทีมขึ้นสินค้า');
            return;
          }

          if (contractorId === '' || contractorId === null) {
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
            alert('กรุณาระบุจำนวนสินค้าให้ถูกต้อง');
            return;
          }
          if (countSelectErrorNum > 0) {
            alert('กรุณาระบุจำนวนสินค้าให้มากกว่า 0');
            return;
          }

          // if (id_update == 9999) {
          try {
            setLoading(true);
            setOpen(false);

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

            setStationCount(station_count - 1);
            updateStation(station_id, 'waiting');

            await updateLoadingTeam(id_update);
            await updateLoadingTeam(id_update_next);
            await updateTeamLoading();
            await updateTeamData();
            await step2Update(id_update_next, 'waiting', 27);
            await updateEndTime(id_update);
            await updateStartTime(id_update_next);
            await step1Update(id_update, 'completed', station_id);
            await getWareHouseManager();
            getAllItemsRegisters();
            setLoopSelect([]);
            setOpen(false);
          } catch (error) {
            console.error(error);
            // จัดการข้อผิดพลาดตามที่ต้องการ
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            setLoopSelect([]);
          }
          // }
        } else {
          // การใช้งาน Line Notify
          setLoading(true);
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          updateStation(station_id, 'waiting');
          setStationCount(station_count - 1);
          step1Update(id_update, 'waiting', 27);
          updateStartTime(id_update);
          setLoopSelect([]);
          getAllItemsRegisters();
          setOpen(false);
          // Trigger the parent to reload the other instance with the common status
        }
      }
    } else if (flag === 0) {
      setLoopSelect([]);
      setOrders([]);
      setOpen(false);
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

  const updateTeamData = async () => {
    await adminRequest.putReserveTeamData(queues.reserve_id, teamData);
  };

  // ####################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################

  const [allItemsRegister, setAllItemsRegister] = useState([]);
  const getAllItemsRegisters = () => {
    try {
      stepRequest.getAllItemsRegister().then((response) => {
        setAllItemsRegister(response);
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  // เพิ่มข้อมูลกองสินค้า

  const addItemsRegister = async (data) => {
    await stepRequest.addItemRegister(data);
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

  //Update lineNotify Message
  const lineNotify = (queue_id, token) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

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

  const [teamData, setTeamData] = useState([]);
  const [teamLoading, setTeamLoading] = useState([]);
  const getTeamloadingByIds = (id) => {
    try {
      adminRequest.getLoadingTeamById(id).then((result) => {
        setTeamData(result);
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
                      <Stack spacing={1}>
                        <Typography variant="h5">ข้อมูลกองสินค้า:</Typography>
                        <Typography variant="body1">บริษัท (สินค้า): {queues.product_company_name}</Typography>
                        <Typography variant="body1">ตรา (สินค้า): {queues.product_brand_name}</Typography>
                      </Stack>
                    </Grid>

                    {orders.map((ordersItems, orderId) => (
                      <div key={orderId}>
                        {ordersItems.product_brand_id !== null && ordersItems.product_company_id && (
                          <Grid container spacing={2} sx={{ mt: '0px' }}>
                            {ordersItems.items.map((orderItem, orderItemId) => (
                              <Grid item xs={12} md={12} key={orderItemId}>
                                <InputLabel sx={{ mt: 1, mb: 1 }}>สูตรสินค้า : {orderItem.name}</InputLabel>
                                <InputLabel sx={{ mt: 1, mb: 1 }}>
                                  จำนวน : <strong>{orderItem.quantity}</strong> (ตัน)
                                </InputLabel>
                                {/* #################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################### */}
                                {!loadOrders ? (
                                  <>
                                    {/* <FormControl sx={{ width: '100%' }} size="small">
                                      <Select
                                        displayEmpty
                                        variant="outlined"
                                        // value={orderSelect[orderItem.item_id]}
                                        value={orderSelect[orderItem.item_id] || orderItem.product_register_id || ''}
                                        onChange={(e) => {
                                          handleChangeProduct(e, orderItem.item_id, orderItem);
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
                                              productRegis.total_remain > 0 && (
                                                <MenuItem key={productRegis.product_register_id} value={productRegis.product_register_id}>
                                                  {'โกดัง : ' + productRegis.warehouse_name + ' '}
                                                  {productRegis.product_register_name}
                                                  {productRegis.product_register_date
                                                    ? ` (${moment(productRegis.product_register_date.slice(0, 10)).format('DD/MM/YY')}) `
                                                    : '-'}
                                                  {productRegis.product_register_date
                                                    ? ` (${calculateAge(productRegis.product_register_date)}) `
                                                    : '-'}
                                                  {productRegis.product_register_remark ? (
                                                    <span style={{ color: 'red' }}> ({productRegis.product_register_remark})</span>
                                                  ) : (
                                                    ''
                                                  )}
                                                  <strong> ({productRegis.total_remain} ตัน)</strong>
                                                </MenuItem>
                                              )
                                          )}
                                      </Select>
                                    </FormControl> */}
                                    {/* #################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################### */}

                                    {loopSelect.length > 0 &&
                                      loopSelect.map(
                                        (onLoop, index) =>
                                          onLoop.order_id == orderItem.order_id && (
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
                                                      productRegis.total_remain > 0 && (
                                                        <MenuItem
                                                          key={productRegis.product_register_id}
                                                          value={productRegis.product_register_id}
                                                          disabled={loopSelect.find(
                                                            (x) => x.product_register_id == productRegis.product_register_id && index > 0
                                                          )}
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
                                                            <span style={{ color: 'red' }}> ({productRegis.product_register_remark})</span>
                                                          ) : (
                                                            ''
                                                          )}
                                                          <strong> ({productRegis.total_remain} ตัน)</strong>
                                                        </MenuItem>
                                                      )
                                                  )}
                                              </Select>
                                            </FormControl>
                                          )
                                      )}
                                  </>
                                ) : (
                                  <CircularProgress />
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </div>
                    ))}
                  </Grid>
                </Grid>
              </MainCard>
            </DialogContent>
            <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
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
                        <Typography variant="h5">
                          <strong>ข้อมูลผู้ขับขี่:</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body">
                          <strong>ชื่อผู้ขับ :</strong> {queues.driver_name}{' '}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="body">
                          <strong>ทะเบียนรถ :</strong> {queues.registration_no}{' '}
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
                                  {/* #################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################### */}
                                  {ordersItems.items.map((orderItem, orderItemId) => (
                                    <>
                                      <Grid item xs={12} md={12} key={orderItemId}>
                                        <InputLabel sx={{ mt: 1, mb: 1 }}>กองสินค้า : {orderItem.name}</InputLabel>
                                        <InputLabel sx={{ mt: 1, mb: 1 }}>
                                          จำนวน : <strong>{orderItem.quantity}</strong> (ตัน)
                                        </InputLabel>
                                        {/* <FormControl sx={{ width: '100%' }} size="small">
                                          <Select
                                            displayEmpty
                                            variant="outlined"
                                            value={orderSelect[orderItem.item_id] || orderItem.product_register_id || ''}
                                            onChange={(e) => {
                                              handleChangeProduct(e, orderItem.item_id);
                                              orderItem.product_register_id = e.target.value;
                                            }}
                                          >
                                            <MenuItem disabled value="">
                                              เลือกกองสินค้า
                                            </MenuItem>
                                            {orderItem.productRegis !== undefined &&
                                              orderItem.productRegis.map(
                                                (productRegis, index) =>
                                                  productRegis.total_remain > 0 && (
                                                    <MenuItem key={index} value={productRegis.product_register_id}>
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
                                                        <span style={{ color: 'red' }}> ({productRegis.product_register_remark})</span>
                                                      ) : (
                                                        ''
                                                      )}
                                                      <strong> ({productRegis.total_remain} ตัน)</strong>
                                                    </MenuItem>
                                                  )
                                              )}
                                          </Select>
                                        </FormControl> */}

                                        {loopSelect.length > 0 &&
                                          loopSelect.map(
                                            (onLoop, index) =>
                                              onLoop.order_id == orderItem.order_id && (
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
                                                      orderItem.productRegis.map((productRegis) => (
                                                        // productRegis.total_remain > 0 &&
                                                        <MenuItem
                                                          key={productRegis.product_register_id}
                                                          value={productRegis.product_register_id}
                                                          disabled={loopSelect.find(
                                                            (x) => x.product_register_id == productRegis.product_register_id && index > 0
                                                          )}
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
                                                            <span style={{ color: 'red' }}> ({productRegis.product_register_remark})</span>
                                                          ) : (
                                                            ''
                                                          )}
                                                          <strong> ({productRegis.total_remain} ตัน)</strong>
                                                        </MenuItem>
                                                      ))}
                                                  </Select>
                                                </FormControl>
                                              )
                                          )}
                                      </Grid>
                                      <Grid item xs={12} md={12}>
                                        <InputLabel sx={{ mt: 1, mb: 1 }}>ประเภท</InputLabel>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={typeSelect.some(
                                                (item) => item.id == orderItem.item_id && item.name === 'checked1' && item.value === 'on'
                                              )}
                                              onChange={handleChangeSelect(orderItem.item_id, 'checked1')}
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
                                                (item) => item.id == orderItem.item_id && item.name === 'checked2' && item.value === 'on'
                                              )}
                                              onChange={handleChangeSelect(orderItem.item_id, 'checked2')}
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
                                                (item) => item.id == orderItem.item_id && item.name === 'checked3' && item.value === 'on'
                                              )}
                                              onChange={handleChangeSelect(orderItem.item_id, 'checked3')}
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
                                                (item) => item.id == orderItem.item_id && item.name === 'checked4' && item.value === 'on'
                                              )}
                                              onChange={handleChangeSelect(orderItem.item_id, 'checked4')}
                                              name="checked4"
                                            />
                                          }
                                          label="เกี่ยวจัมโบ้"
                                        />
                                      </Grid>
                                      {typeSelect.some(
                                        (item) => item.id == orderItem.item_id && item.name === 'checked1' && item.value === 'on'
                                      ) && (
                                        <Grid item xs={12} md={12}>
                                          <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                            จำนวนทุบปุ๋ย : (สูงสุด {parseFloat((orderItem.quantity * 1).toFixed(3)) + ' ตัน'})
                                          </InputLabel>
                                          <FormControl sx={{ width: '100%' }} size="small">
                                            <OutlinedInput
                                              size="small"
                                              id={typeNumSelect[orderItem.item_id]}
                                              type="number"
                                              value={
                                                typeNumSelect.find((item) => item.id == orderItem.item_id && item.name === 'checked1')
                                                  ?.value || ''
                                              }
                                              onChange={(e) => {
                                                handleChangeTypeNum(
                                                  orderItem.item_id,
                                                  'checked1',
                                                  e,
                                                  parseFloat((orderItem.quantity * 1).toFixed(3))
                                                );
                                              }}
                                              placeholder="จำนวน"
                                            />
                                          </FormControl>
                                        </Grid>
                                      )}
                                      {typeSelect.some(
                                        (item) => item.id == orderItem.item_id && item.name === 'checked2' && item.value === 'on'
                                      ) && (
                                        <Grid item xs={12} md={12}>
                                          <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                            จำนวนเกี่ยวสลิง : (สูงสุด {parseFloat((orderItem.quantity * 1).toFixed(3)) + ' ตัน'})
                                          </InputLabel>
                                          <FormControl sx={{ width: '100%' }} size="small">
                                            <OutlinedInput
                                              size="small"
                                              id={typeNumSelect[orderItem.item_id]}
                                              type="number"
                                              value={
                                                typeNumSelect.find((item) => item.id == orderItem.item_id && item.name === 'checked2')
                                                  ?.value || ''
                                              }
                                              // onChange={(e) => {
                                              //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                              // }}
                                              onChange={(e) => {
                                                handleChangeTypeNum(
                                                  orderItem.item_id,
                                                  'checked2',
                                                  e,
                                                  parseFloat((orderItem.quantity * 1).toFixed(3))
                                                );
                                              }}
                                              placeholder="จำนวน"
                                            />
                                          </FormControl>
                                        </Grid>
                                      )}
                                      {typeSelect.some(
                                        (item) => item.id == orderItem.item_id && item.name === 'checked3' && item.value === 'on'
                                      ) && (
                                        <Grid item xs={12} md={12}>
                                          <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                            จำนวนเรียงสลิง : (สูงสุด {parseFloat((orderItem.quantity * 1).toFixed(3)) + ' ตัน'})
                                          </InputLabel>
                                          <FormControl sx={{ width: '100%' }} size="small">
                                            <OutlinedInput
                                              size="small"
                                              id={typeNumSelect[orderItem.item_id]}
                                              type="number"
                                              value={
                                                typeNumSelect.find((item) => item.id == orderItem.item_id && item.name === 'checked3')
                                                  ?.value || ''
                                              }
                                              // onChange={(e) => {
                                              //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                              // }}
                                              onChange={(e) => {
                                                handleChangeTypeNum(
                                                  orderItem.item_id,
                                                  'checked3',
                                                  e,
                                                  parseFloat((orderItem.quantity * 1).toFixed(3))
                                                );
                                              }}
                                              placeholder="จำนวน"
                                            />
                                          </FormControl>
                                        </Grid>
                                      )}
                                      {typeSelect.some(
                                        (item) => item.id == orderItem.item_id && item.name === 'checked4' && item.value === 'on'
                                      ) && (
                                        <Grid item xs={12} md={12}>
                                          <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                            จำนวนเกี่ยวจัมโบ้ : (สูงสุด {parseFloat((orderItem.quantity * 1).toFixed(3)) + ' ตัน'})
                                          </InputLabel>
                                          <FormControl sx={{ width: '100%' }} size="small">
                                            <OutlinedInput
                                              size="small"
                                              id={typeNumSelect[orderItem.item_id]}
                                              type="number"
                                              value={
                                                typeNumSelect.find((item) => item.id == orderItem.item_id && item.name === 'checked4')
                                                  ?.value || ''
                                              }
                                              // onChange={(e) => {
                                              //   handleChangeTypeNum(e, orderItem.item_id, parseFloat((orderItem.quantity * 1).toFixed(3)));
                                              // }}
                                              onChange={(e) => {
                                                handleChangeTypeNum(
                                                  orderItem.item_id,
                                                  'checked4',
                                                  e,
                                                  parseFloat((orderItem.quantity * 1).toFixed(3))
                                                );
                                              }}
                                              placeholder="จำนวน"
                                            />
                                          </FormControl>
                                        </Grid>
                                      )}
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
                          <TableCell align="left">
                            {row.start_datetime ? row.start_datetime.slice(11, 19) : row.start_time.slice(11, 19)}
                          </TableCell>
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
                                  <Button
                                    // sx={{ minWidth: '33px!important', p: '6px 0px' }}
                                    variant="contained"
                                    size="small"
                                    color="info"
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
