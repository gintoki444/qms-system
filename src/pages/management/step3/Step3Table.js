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
  DialogActions,
  ButtonGroup,
  InputAdornment,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Input,
  OutlinedInput,
  Tooltip,
  Select,
  MenuItem
  // ButtonGroup
} from '@mui/material';

// Link api queues
import * as queueReques from '_api/queueReques';
import * as stepRequest from '_api/StepRequest';
const apiUrl = process.env.REACT_APP_API_URL;

// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';
import { RightSquareOutlined, SoundOutlined } from '@ant-design/icons';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { setStation } from 'store/reducers/station';

// Sound Call
import SoundCall from 'components/@extended/SoundCall';

import QueueTag from 'components/@extended/QueueTag';
import ChangeWeight from './ChangeWeight';

export const Step3Table = ({ status, title, onStatusChange, onFilter, permission }) => {
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
      width: '10%',
      label: 'สถานีบริการ'
    },
    {
      id: 'branName',
      align: 'left',
      disablePadding: false,
      width: '15%',
      label: 'ร้านค้า/บริษัท'
    },
    {
      id: 'driver',
      align: 'left',
      disablePadding: true,
      width: '10%',
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
      id: 'teamLoading',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'ทีมขึ้นสินค้า'
    },
    {
      id: 'times',
      align: 'left',
      disablePadding: false,
      width: '10%',
      label: 'เวลาเริ่ม'
    },
    {
      id: 'selectedStation',
      align: 'center',
      disablePadding: false,
      width: '5%',
      label: 'สถานะ'
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
      <TableHead key={status + '01'}>
        <TableRow>
          {headCells.map((headCell) => (
            <>
              {(status === 'waiting' && headCell.id === 'soundCall') || (
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
  const [open, setOpen] = React.useState(false);
  const [id_update, setUpdate] = useState(0);
  const [id_update_next, setUpdateNext] = useState(0);
  const [fr, setFrom] = useState('');
  const [textnotify, setText] = useState('');
  const [loading, setLoading] = useState(true); // สร้าง state เพื่อติดตามสถานะการโหลด
  const [team_id, setTeamId] = useState(0);
  const [message, setMessage] = useState('');
  //เพิ่ม function get จำนวนสถานีของ step 1
  const station_num = 2;

  const station_count = useSelector((state) => state.station.station_count);
  const dispatch = useDispatch();

  useEffect(() => {
    getStation();
    fetchData();
  }, [status, onStatusChange, onFilter, permission]);

  const fetchData = async () => {
    try {
      // Use different API functions based on the status
      if (status === 'waiting') {
        await waitingGet();
      } else if (status === 'processing') {
        await processingGet();
      }
      // await getStepCount(3, 'processing');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors if needed
    }
  };

  const waitingGet = async () => {
    try {
      await queueReques.getStep3Waitting().then((response) => {
        if (onFilter == 0) {
          setItems(response);
        } else {
          setItems(response.filter((x) => x.product_company_id == onFilter) || []);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  //ข้อมูล รอเรียกคิว step
  const processingGet = async () => {
    try {
      await queueReques.getStep3Processing().then((response) => {
        const step3 = response;
        queueReques.getStep1Processing().then((response) => {
          if (response.length > 0) {
            response.map((x) => {
              step3.push(x);
            });
          }
          setItems(step3);
          dispatch(setStation({ station_count: step3.length }));
        });
        // setItems(response);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const initialData = '';
  const [weight, setWeight] = useState(initialData);

  const handleChange = (value) => {
    setWeight(parseFloat(value));
  };

  const [queuesDetial, setQueuesDetial] = useState([]);
  const getQueuesDetial = (id) => {
    try {
      queueReques.getAllStepById(id).then((response) => {
        setQueuesDetial(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const step1Update = (step_id, statusupdate, station_id) => {
    var currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

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
      .then(async (result) => {
        if (result['status'] === 'ok') {
          await waitingGet();
          await processingGet();
          //3=Step ชั่งหนัก
          // await getStepCount(3, 'processing');
          // resolve(); // ส่งคืนเมื่อการอัปเดตสำเร็จ
        }
      })
      .catch((error) => console.log('error', error));
  };

  const step2Update = (id, statusupdate, station_id) => {
    var currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
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

    fetch(apiUrl + '/updatestepstatus/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result['status'] === 'ok') {
          //alert("Upadte next step was completed")
        }
      })
      .catch((error) => console.log('error', error));
  };

  // const getStepCount = (steps_order, steps_status) => {
  //   return new Promise((resolve, reject) => {
  //     var requestOptions = {
  //       method: 'GET',
  //       redirect: 'follow'
  //     };

  //     fetch(apiUrl + '/stepcount/' + steps_order + '/' + steps_status, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         if (result.length > 0) {
  //           setStationCount(result[0]['step_count']);
  //         } else {
  //           setStationCount(0);
  //         }
  //         resolve(); // ส่งคืนเมื่อการเรียก API เสร็จสมบูรณ์
  //       })
  //       .catch((error) => {
  //         console.error('error', error);
  //         reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
  //       });
  //   });
  // };

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

  //Update ทีมขึ้นสินค้าสำหรับ step3
  const updateLoadingTeam = (step_id) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      team_id: team_id
    });

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
          console.log('updateLoadingTeam is ok');
        } else {
          console.log('not update LoadingTeam');
        }
      })
      .catch((error) => console.error(error));
  };

  //Update start_time of step
  const updateStartTime = (step_id) => {
    //alert("updateStartTime")

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
            resolve(result);

            // Reload
            onStatusChange(status === 'waiting' ? 'processing' : 'waiting');
            fetchData();
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
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
          //console.log(result)
          if (result['status'] === 'ok') {
            console.log('updateEndTime is ok');
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            console.log('not update updateEndTime');
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  const updateWeight2 = (step_id) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        weight2: weight
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updateweight2/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          //console.log(result)
          if (result['status'] === 'ok') {
            setWeight('');
            resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
          } else {
            reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
          }
        })
        .catch((error) => console.error(error));
    });
  };

  /* แจ้งเตือน Line Notify */

  const lineNotify = (queue_id, token) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    var link = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    link = link + '/queues/detail/' + queue_id;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      message: message + ' หมายเลขคิว: ' + token + '\n' + 'น้ำหนักชั่งหนัก: ' + weight + ' ตัน' + '\n' + link
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

  const updateRecall = (step_id, queue_id, queues) => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const recallData = {
      step_id: step_id,
      recall_data: queues,
      created_date: currentDate,
      remark: txtDetail,
      queue_id: queue_id
    };

    try {
      stepRequest.addRecallProcess(recallData).then((response) => {
        if (response.status == 'ok') fetchData();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkStations = (id) => {
    return new Promise((resolve, reject) => {
      queueReques
        .getStep3Processing()
        .then((response) => {
          const step3Check = response;

          queueReques.getStep1Processing().then((response) => {
            const step1Check = response;

            if (id == 23) {
              const countStep1 = step1Check.filter((x) => x.station_id == 2).length;
              const countStep3 = step3Check.filter((x) => x.station_id == id).length;

              const count = countStep3 + countStep1;
              resolve(count);
            } else {
              const countStep1 = step1Check.filter((x) => x.station_id == 29).length;
              const countStep3 = step3Check.filter((x) => x.station_id == id).length;

              const count = countStep3 + countStep1;
              resolve(count);
            }
          });
        })
        .catch((error) => {
          console.error(error);
          reject(error); // Reject with error if there's an error
        });
    });
  };

  // =============== Get Reserve ===============//
  const [reserves, setreserves] = useState([]);
  const getReserveId = async (id) => {
    stepRequest.getReserveById(id).then((response) => {
      if (response) {
        setreserves(response.reserve);
      }
    });
  };

  const [queues, setQueues] = useState([]);
  const handleClickOpen = (step_id, fr, queue_id, team_id, queuesData) => {
    if (fr === 'call') {
      setMessage('ชั่งหนัก–STEP3 เรียกคิว');
      setText('เรียกคิว');
    } else {
      if (fr === 'close') {
        setMessage('ชั่งหนัก–STEP3 ปิดคิว');
        setText('ปิดคิว');
        getQueuesDetial(queue_id);
        getReserveId(queuesData.reserve_id);
      } else {
        setMessage('ชั่งหนัก–STEP3 ยกเลิกเรียกคิว');
        setText('ยกเลิก');
      }
    }

    setFrom(fr);
    setUpdate(step_id);
    setTeamId(team_id);
    getStepId(4, queue_id);
    setQueues(queuesData);
    setOpen(true);
  };

  // ตรวจสอบค่าว่าง
  const isEmpty = (obj) => {
    return Object.entries(obj).length === 0;
  };

  const handleClose = async (flag) => {
    // flag = 1 = ยืนยัน
    if (flag === 1) {
      if (fr === 'call') {
        setLoading(true);
        const checkstation = await checkStations(selectedStations[id_update]);
        if (checkstation > 0) {
          alert('สถานีบริการนี้กำลังใช้งานอยู่');
          return;
        }
        if (isEmpty(selectedStations)) {
          alert('กรุณาเลือกสถานีชั่งหนัก!');
          return;
        }

        setWeight('');
        if (station_count < station_num) {
          setItems([]);
          setOpen(false);

          // การใช้งาน Line Notify
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          // handleCallQueue(queues);
          step1Update(id_update, 'processing', selectedStations[id_update]);
          updateStartTime(id_update);
        } else {
          alert('สถานีบริการเต็ม');
          setLoading(false);
        }
      } else {
        if (fr === 'close') {
          setLoading(true);
          //ปิดคิว: Update waiting Step2 ตามหมายเลขคิว
          if (weight <= 0 || weight === '') {
            alert('กรุณาใสน้ำหนักจากการชั่งหนัก');
            setLoading(false);
            return;
          } else if (weight < parseFloat(reserves[0].total_quantity) + parseFloat(queuesDetial[0].weight1)) {
            alert('น้ำหนักจากการชั่งหนักต้องไม่น้อยกว่า น้ำหนักชั่งเบา + น้ำหนักสินค้า');
            setLoading(false);
            return;
          } else if (typeSelect && typeSelect.checked1 == true && txtDetail == '') {
            alert('กรุณาใสรายละเอียดการทวนสอบ');
            setLoading(false);
            return;
          } else {
            if (typeSelect && typeSelect.checked1 == true) {
              // const queu = weight;
              updateRecall(id_update, queues.queue_id, queues);

              setOpen(false);
              setLoading(false);
            } else {
              setLoading(true);
              setItems([]);
              setOpen(false);
              // if (weight === 99999) {
              // การใช้งาน Line Notify
              getStepToken(id_update)
                .then(({ queue_id, token }) => {
                  lineNotify(queue_id, token);
                })
                .catch((error) => {
                  console.error('Error:', error);
                  // ทำอะไรกับข้อผิดพลาด
                });

              updateLoadingTeam(id_update_next, team_id);
              updateLoadingTeam(id_update, team_id);
              step2Update(id_update_next, 'processing', 27);
              step1Update(id_update, 'completed', queues.station_id);
              updateEndTime(id_update);
              updateWeight2(id_update);
              updateStartTime(id_update_next);
              // setStationCount(0);

              // }
            }
          }
        } else {
          //ยกเลิก
          setLoading(true);
          setItems([]);
          setOpen(false);
          setWeight('');
          // การใช้งาน Line Notify
          getStepToken(id_update)
            .then(({ queue_id, token }) => {
              lineNotify(queue_id, token);
            })
            .catch((error) => {
              console.error('Error:', error);
              // ทำอะไรกับข้อผิดพลาด
            });

          step1Update(id_update, 'waiting', 27);
          updateStartTime(id_update);
        }
      }
    } else if (flag === 0) {
      setLoading(false);
      setOpen(false);
    }
    setQueuesDetial([]);
    setreserves([]);
    setSelectedStations({});
    setTxtDetail('');
    setTypeSelect([]);
    // setStationCount(0);
    setWeight('');
  };

  const [typeSelect, setTypeSelect] = useState();
  const handleChangeSelect = () => (event) => {
    const { name, checked } = event.target;
    setTypeSelect((prevState) => ({
      ...prevState,
      [name]: checked ? checked || true : false
    }));
  };

  const [txtDetail, setTxtDetail] = useState('');
  const handleChangeTxtDetial = (e) => {
    setTxtDetail(e.target.value);
  };

  const handleCallQueue = (queues) => {
    let detialTxt = '';

    if (queues.station_description == 'รอเรียกคิว' && isEmpty(selectedStations)) {
      if (isEmpty(selectedStations)) {
        detialTxt = `เข้าสถานีชั่งหนัก`;
      } else {
        const getStations = stations.filter((x) => x.station_id === selectedStations[queues.step_id]);
        const textStation = getStations[0].station_description;
        const updatedText = textStation.replace(/ชั่งหนักที่ /g, '');
        detialTxt = `เข้าสถานีชั่งหนัก ช่องที่${updatedText}`;
      }
    } else {
      if (isEmpty(selectedStations)) {
        const updatedText = queues.station_description.replace(/ชั่งหนักที่ /g, '');
        detialTxt = `เข้าสถานีชั่งหนัก ช่องที่${updatedText}`;
      } else {
        const getStations = stations.filter((x) => x.station_id === selectedStations[queues.step_id]);
        const textStation = getStations[0].station_description;
        const updatedText = textStation.replace(/ชั่งหนักที่ /g, '');
        detialTxt = `เข้าสถานีชั่งหนัก ช่องที่${updatedText}`;
      }
    }

    const cleanedToken = queues.token.split('').join(' ');
    const titleTxt = `ขอเชิญคิวหมายเลขที่ ${cleanedToken}`;
    // ==== แยกตัวอักษรป้ายทะเบียนรถ ====
    const titleTxtCar = queues.registration_no;
    // const cleanedString = titleTxtCar.replace(/[^\u0E00-\u0E7F\d\s]/g, '');
    const cleanedString = titleTxtCar;
    const spacedString = cleanedString.split('').join(' ').replace(/-/g, 'ขีด').replace(/\//g, 'ทับ').replace(/,/g, 'พ่วง');

    SoundCall(`${titleTxt} ทะเบียน ${spacedString} ${detialTxt}`);

    // const titleTxt = `คิวหมายเลขที่ ${queues.token}`;
    // const detialTxt = `เข้าสถานีชั่งหนัก`;
    // // ==== แยกตัวอักษรป้ายทะเบียนรถ ====
    // const titleTxtCar = queues.registration_no;
    // const cleanedString = titleTxtCar.replace(/[^\u0E00-\u0E7F\d\s]/g, '');
    // const spacedString = cleanedString.split('').join(' ');

    // SoundCall(`${titleTxt} ทะเบียน ${spacedString} ${detialTxt}`);
  };

  const [stations, setStations] = useState([]); // ใช้ state สำหรับการเก็บสถานีที่ถูกเลือกในแต่ละแถว
  const getStation = () => {
    try {
      stepRequest.getAllStations().then((response) => {
        if (response) {
          setStations(response.filter((x) => x.station_group_id == 4));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedStations, setSelectedStations] = useState({}); // ใช้ state สำหรับการเก็บสถานีที่ถูกเลือกในแต่ละแถว
  const handleStationChange = (event, row) => {
    const { value } = event.target;
    setSelectedStations((prevState) => ({
      ...prevState,
      [row.step_id]: value // เก็บค่าสถานีที่ถูกเลือกในแต่ละแถวโดยใช้ step_id เป็น key
    }));
  };

  useEffect(() => {
  }, [queuesDetial])
  const handleChangeWeight1 = (data) => {
    setQueuesDetial(data);
  }
  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
          {fr === 'close' ? (
            <>
              <DialogTitle id="responsive-dialog-title" align="center">
                <Typography variant="h5">
                  ต้องการ {textnotify} เลขที่ {queues && queues.token} หรือไม่?
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ width: 350, mt: 2 }}>
                <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
                  <Grid item xs={12}>
                    {/* <Typography variant="body1" sx={{ fontSize: 16 }}>
                      น้ำหนักชั่งเบา : <strong>{queuesDetial.length > 0 ? parseFloat(queuesDetial[0].weight1) : '-'}</strong> ตัน
                    </Typography> */}
                    {queuesDetial.length > 0 &&
                      <ChangeWeight weight1={parseFloat(queuesDetial[0].weight1)} queueId={queuesDetial[0]?.queue_id} changeWeight={handleChangeWeight1} />
                    }
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontSize: 16 }}>
                      น้ำหนักสินค้า : <strong>{reserves.length > 0 ? parseFloat(reserves[0].total_quantity) : '-'}</strong> ตัน
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel sx={{ fontSize: 16 }}>น้ำหนักชั่งหนัก</InputLabel>
                    <FormControl variant="standard" sx={{ width: '100%', fontFamily: 'kanit' }}>
                      <Input
                        id="standard-adornment-weight"
                        endAdornment={<InputAdornment position="end">ตัน</InputAdornment>}
                        aria-describedby="standard-weight-helper-text"
                        inputProps={{
                          type: 'number',
                          'aria-label': 'weight',
                          min: 0.1
                        }}
                        placeholder="ระบุน้ำหนัก"
                        value={weight || ''}
                        onChange={(e) => handleChange(e.target.value)}
                      />
                      {/* <FormHelperText id="standard-weight-helper-text">น้ำหนักชั่งหนัก</FormHelperText> */}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      sx={{ fontWeight: 600 }}
                      control={
                        <Checkbox checked={typeSelect?.checked1 || false} onChange={handleChangeSelect('checked1')} name="checked1" />
                      }
                      label="ทวนสอบ"
                    />
                  </Grid>

                  {typeSelect?.checked1 && (
                    <>
                      <Grid item xs={12} md={12}>
                        <InputLabel sx={{ mb: 1.5, fontWeight: 600 }}>รายละเอียด</InputLabel>
                        <FormControl sx={{ width: '100%' }} size="small">
                          <OutlinedInput
                            size="small"
                            type="text"
                            value={txtDetail}
                            onChange={handleChangeTxtDetial}
                            placeholder="รายละเอียด"
                            fullWidth
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                </Grid>
              </DialogContent>
            </>
          ) : (
            <>
              <DialogTitle id="responsive-dialog-title" align="center">
                <Typography variant="h5">
                  ต้องการ {textnotify} เลขที่ {queues && queues.token} หรือไม่?
                </Typography>
              </DialogTitle>

              {fr === 'call' && (
                <DialogContent sx={{ width: 350 }}>
                  <Grid container justifyContent="flex-end" spacing={2}>
                    <Grid item xs={12}>
                      <InputLabel>เครื่องชั่งหนัก</InputLabel>
                      <FormControl sx={{ width: '100%' }} size="small">
                        <Select
                          displayEmpty
                          size="small"
                          value={selectedStations[queues.step_id] || ''}
                          onChange={(event) => handleStationChange(event, queues)}
                        >
                          <MenuItem disabled value="">
                            เลือกเครื่องชั่งหนัก
                          </MenuItem>
                          {stations.map((station) => (
                            <MenuItem key={station.station_id} value={station.station_id}>
                              {station.station_description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </DialogContent>
              )}
            </>
          )}

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
            <Table
              aria-labelledby="tableTitle"
              sx={{
                '& .MuiTableCell-root:first-of-type': {
                  pl: 2
                },
                '& .MuiTableCell-root:last-of-type': {
                  pr: 3
                }
              }}
            >
              <QueueTableHead />
              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={status == 'processing' ? 13 : 12} align="center">
                      <CircularProgress />
                      <Typography variant="body1">Loading....</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {items.map((row, index) => {
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
                          <Typography sx={{ width: '240px' }}>{row.company_name}</Typography>
                        </TableCell>

                        <TableCell align="left">{row.driver_name}</TableCell>

                        <TableCell align="left">{row.driver_mobile}</TableCell>

                        <TableCell align="left"> {row.team_name ? row.team_name : '-'}</TableCell>

                        <TableCell align="left">
                          {/* {row.start_time ? moment(row.start_time).format('LT') : '-'} */}
                          {row.start_time ? row.start_time.slice(11, 19) : '-'}
                        </TableCell>

                        <TableCell align="center">
                          {status == 'waiting' && <Chip color="warning" sx={{ width: '95px' }} label={'รอคิวชั่งหนัก'} />}
                          {status == 'processing' && row.station_id !== 2 && row.station_id !== 29 && (
                            <Chip color="success" sx={{ width: '95px' }} label={'กำลังชั่งหนัก '} />
                          )}
                          {(row.station_id === 2 || row.station_id === 29) && (
                            <Chip color="success" sx={{ width: '95px' }} label={'กำลังชั่งเบา '} />
                          )}
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
                                  disabled={
                                    ((row.station_id === 2 || row.station_id === 29) &&
                                      permission !== 'manage_everything' &&
                                      permission !== 'add_edit_delete_data') ||
                                    (permission !== 'manage_everything' && permission !== 'add_edit_delete_data') ||
                                    row.station_id === 2 ||
                                    row.station_id === 29
                                  }
                                  color="info"
                                  onClick={() => handleCallQueue(row)}
                                >
                                  <SoundOutlined />
                                </Button>
                              </span>
                            </Tooltip>
                          </TableCell>
                        )}

                        <TableCell align="right" width="120" sx={{ width: 120, maxWidth: 120 }}>
                          <ButtonGroup aria-label="button group" sx={{ alignItems: 'center' }}>
                            {status == 'waiting' && (
                              <Button
                                variant="contained"
                                size="small"
                                color="info"
                                disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                                onClick={() => handleClickOpen(row.step_id, 'call', row.queue_id, row.team_id, row)}
                                endIcon={<RightSquareOutlined />}
                              >
                                เรียกคิว
                              </Button>
                            )}
                            {status == 'processing' && (
                              <div>
                                <Button
                                  disabled={
                                    ((row.station_id === 2 || row.station_id === 29) &&
                                      permission !== 'manage_everything' &&
                                      permission !== 'add_edit_delete_data') ||
                                    (permission !== 'manage_everything' && permission !== 'add_edit_delete_data') ||
                                    row.station_id === 2 ||
                                    row.station_id === 29
                                  }
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleClickOpen(row.step_id, 'cancel', row.queue_id, row.team_id, row)}
                                  color="error"
                                >
                                  ยกเลิก
                                </Button>
                                <Button
                                  disabled={
                                    ((row.station_id === 2 || row.station_id === 29) &&
                                      permission !== 'manage_everything' &&
                                      permission !== 'add_edit_delete_data') ||
                                    (permission !== 'manage_everything' && permission !== 'add_edit_delete_data') ||
                                    row.station_id === 2 ||
                                    row.station_id === 29
                                  }
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleClickOpen(row.step_id, 'close', row.queue_id, row.team_id, row)}
                                >
                                  ปิดคิว
                                </Button>
                              </div>
                            )}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {items.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={status == 'processing' ? 13 : 12} align="center">
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
