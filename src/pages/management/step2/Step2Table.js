import React, { useState, useEffect } from 'react';
import { Grid, Box, Table, TableContainer, Typography, Backdrop, CircularProgress } from '@mui/material';

// Link api queues
import * as adminRequest from '_api/adminRequest';
import * as getQueues from '_api/queueReques';
import * as stepRequest from '_api/StepRequest';
import * as reserveRequest from '_api/reserveRequest';
const apiUrl = process.env.REACT_APP_API_URL;

import moment from 'moment/min/moment-with-locales';
import { useSnackbar } from 'notistack';

// Sound Call
import SoundCall from 'components/@extended/SoundCall';

import * as functionCancleTeam from 'components/Function/CancleTeamStation';
import * as functionAddLogs from 'components/Function/AddLog';
import checkProductQuantities from 'components/Function/checkProductQuantities';

// Import new components
import QueueTableHead from 'components/step2/QueueTableHead';
import QueueTableBody from 'components/step2/QueueTableBody';
import CallQueueDialog from 'components/step2/CallQueueDialog';
import CloseQueueDialog from 'components/step2/CloseQueueDialog';
import CancelQueueDialog from 'components/step2/CancelQueueDialog';

export const Step2Table = ({ status, title, onStatusChange, onFilter, permission }) => {
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
  const { enqueueSnackbar } = useSnackbar();

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
      getWarehouses();
      getAllContractor();

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
          setItems(response.filter((x) => x.team_id !== null && x.reserve_station_id !== 1 && parseFloat(x.total_quantity) > 0));
        } else {
          setItems(
            response.filter(
              (x) =>
                x.product_company_id == onFilter && x.team_id !== null && x.reserve_station_id !== 1 && parseFloat(x.total_quantity) > 0
            ) || []
          );
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
                // lineNotify(queue_id, token);
                telegramNotify(queue_id, token);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }
        }
      }

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
            waitingGet();
            processingGet();
            getStepCount(2, 'processing');
            setLoading(false);

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
    const currentDate = await stepRequest.getCurrentDate();

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
        response?.reserve.map((result) => {
          getStationById(result.warehouse_id);
          getTeamloadingByIdwh(result.warehouse_id);

          if (result.contractor_id) {
            getLaborLine(result.contractor_id);
          }

          if (result.team_id !== null) {
            if (result.team_data) {
              getTeamloadingByIds(result.team_id);
            } else if (result.team_data.length > 0) {
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

  useEffect(() => {}, [orders]);
  const getOrderOfReserve = async (id, status) => {
    try {
      await reserveRequest.getOrderByReserveId(id).then(async (response) => {
        if (response.length > 0) {
          const getAllProductRegis = await getProductRegisters(status); // หรือ 'อื่นๆ' ตามที่คุณต้องการ

          console.log('getAllProductRegis :', getAllProductRegis);
          for (let result of response) {
            const allProductRegis = await getItemsRegisByOrder(result.order_id);

            // const getAllProductRegis = await getProductRegistersComBrand(result.product_company_id, result.product_brand_id);
            if (result.product_company_id && result.product_brand_id) {
              for (let data of result.items) {
                // เพิ่มพารามิเตอร์ status ในการเรียก getProductRegisters

                const getProductRegis = getAllProductRegis.filter(
                  (x) =>
                    x.product_id == data.product_id &&
                    x.product_brand_id == result.product_brand_id &&
                    x.product_company_id == result.product_company_id
                );

                data.productRegis = getProductRegis;
                console.log('data :', data);
                if (allProductRegis.length > 0) {
                  setLoopSelect((prevState) => {
                    const updatedOptions = [...prevState];
                    allProductRegis.map((x) => {
                      if (x.order_id === data.order_id && x.item_id === data.item_id) {
                        x.quantity = parseFloat(data.quantity);
                        x.product_register_quantity = parseFloat(x.product_register_quantity);
                        updatedOptions.push(x);
                      }
                    });

                    console.log('updatedOptions :', updatedOptions);
                    return updatedOptions;
                  });
                } else if (allProductRegis.length === 0 && status === 'call') {
                  const selectedOption = {
                    id: `${data.order_id}${data.item_id}${allProductRegis.length}`,
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
              }
            }
          }
          // }
          setOrders(response);
          setOnClickSubmit(false);
          // setLoadOrder(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //  แสดงข้อมูลสินค้าทั้งหมด
  const getProductRegisters = async (status) => {
    try {
      let allRespon;

      if (status === 'call') {
        // ดึงข้อมูลเฉพาะจาก getAllProductRegister
        const response = await adminRequest.getAllProductRegister();
        allRespon = [...response];
      } else {
        // ดึงข้อมูลจากทั้ง getAllProductRegister และ getAllProductHistory
        const [response, response0] = await Promise.all([adminRequest.getAllProductRegister(), adminRequest.getAllProductHistory()]);
        allRespon = [...response, ...response0];
      }

      // กรองข้อมูลตาม onFilter ถ้ามี
      if (onFilter) {
        return allRespon.filter((x) => x.product_company_id == onFilter);
      } else {
        return allRespon;
      }
    } catch (error) {
      console.log(error);
      return []; // ส่งกลับ array ว่างในกรณีที่เกิด error
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

      const index = updatedOptions.findIndex((option) => option.order_id === items.order_id && option.item_id === items.item_id);
      const indexProId = updatedOptions.filter(
        (option) => option.order_id === items.order_id && option.item_id === items.item_id && option.product_register_id !== e.target.value
      );
      const checkStockSelect = updatedOptions.filter((x) => x.order_id === items.order_id && x.item_id === items.item_id);
      const indexKey = updatedOptions.findIndex((option) => option.id === key);

      if (parseFloat(stockItem) <= parseFloat(items.quantity) && indexKey === -1) {
        if (checkStockSelect.length > 0) {
          checkStockSelect.map((x) => {
            const totalQuantity = parseFloat(items.quantity);
            selectedStock.stockQuetity = totalQuantity - x.stockQuetity.toFixed(3);
          });
        }
        updatedOptions.push(selectedStock);
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length === 0) {
        updatedOptions[index] = selectedStock;
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length !== 0) {
        const filterindex = updatedOptions.filter((option) => option.order_id === items.order_id && option.item_id === items.item_id);
        filterindex.map(
          (x) =>
            (selectedStock.stockQuetity =
              selectedStock.stockQuetity > x.stockQuetity
                ? selectedStock.stockQuetity - x.stockQuetity
                : x.stockQuetity - selectedStock.stockQuetity)
        );
        if (selectedStock.stockQuetity <= 0 && indexKey !== -1) {
          selectedStock.stockQuetity = parseFloat(items.quantity);

          let filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);

          filterRemove.push(selectedStock);
          updatedOptions = filterRemove;
        } else if (indexKey !== -1) {
          selectedStock.stockQuetity = parseFloat(items.quantity);

          const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
          if (checkStock.length > 0) {
            let totolIsSelect = 0;
            checkStock.map((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));

            if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
              let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
              selectedStock.stockQuetity = result;
            }
          }
          updatedOptions[index] = selectedStock;
        } else {
          updatedOptions.push(selectedStock);
        }
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey === -1) {
        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);

        if (checkStock.length > 0) {
          let totolIsSelect = 0;
          checkStock.map((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));

          if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);
          } else if (parseFloat(stockItem) === totolIsSelect + selectedStock.stockQuetity && checkStockSelect.length > 0) {
            let result = (parseFloat(stockItem) - selectedStock.stockQuetity).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);
          }
        } else if (checkStockSelect.length > 0) {
          checkStockSelect.map((x) => {
            selectedStock.stockQuetity = selectedStock.stockQuetity - x.stockQuetity;
          });
        }
        updatedOptions.push(selectedStock);
      } else {
        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
        if (checkStock.length > 0) {
          let totolIsSelect = 0;
          checkStock.map((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));

          if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);
          }
        }

        updatedOptions[index] = selectedStock;
      }
      return updatedOptions;
    });

    // console.log('*************** Loop select  ***************');
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

      let checkSum = sumSelectProductRegis(orderList);
      let checkSumNotSelect = sumSelectProductRegis(orderListNotSelect);
      checkSum = checkSum + selectedOptionNew.product_register_quantity;

      if (parseFloat(stockItem) < parseFloat(items.quantity) && indexKey !== -1) {
        const filterList = updatedOptions.filter(
          (option) => option.item_id == items.item_id && option.order_id == items.order_id && option.product_register_id === ''
        );

        if (orderList.length < 3 && orderList.length < items.productRegis.length && filterList.length === 0) {
          if (parseFloat(items.quantity) > checkSum || checkSumNotSelect === 0) {
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
          } else if (orderListNotSelect.length > 0) {
            orderListNotSelect.map((x) => {
              selectedOptionNew.product_register_quantity = parseFloat((x.quantity - x.product_register_quantity).toFixed(3));
            });
          }
        } else if (parseFloat(items.quantity) < checkSum) {
          let sumquatity = sumSelectProductRegis(orderList);

          selectedOptionNew.product_register_quantity =
            sumquatity > parseFloat(items.quantity)
              ? parseFloat((sumquatity - parseFloat(items.quantity)).toFixed(3))
              : parseFloat((parseFloat(items.quantity) - sumquatity).toFixed(3));
        }

        updatedOptions[indexKey] = selectedOptionNew;
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length !== 0) {
        const filterindex = updatedOptions.filter((option) => option.order_id === items.order_id && option.item_id === items.item_id);
        filterindex.map(
          (x) =>
            (selectedOptionNew.product_register_quantity =
              selectedOptionNew.product_register_quantity > x.product_register_quantity
                ? selectedOptionNew.product_register_quantity - x.product_register_quantity
                : x.product_register_quantity - selectedOptionNew.product_register_quantity)
        );

        if (selectedOptionNew.product_register_quantity <= 0 && indexKey !== -1) {
          selectedOptionNew.product_register_quantity = parseFloat(items.quantity);
          const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);

          filterRemove.push(selectedOptionNew);
          updatedOptions = filterRemove;
        } else if (indexKey !== -1) {
          const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value && x.id !== key);
          const checkNumSelect = updatedOptions.filter(
            (option) => option.item_id == items.item_id && option.order_id == items.order_id && option.product_register_id === ''
          );
          if (checkStock.length > 0) {
            let totolIsSelect = 0;
            checkStock.map((x) => (totolIsSelect = x.product_register_quantity + totolIsSelect));

            if (parseFloat(stockItem) < totolIsSelect + selectedOptionNew.product_register_quantity) {
              let result = parseFloat((parseFloat(stockItem) - totolIsSelect).toFixed(3));
              selectedOptionNew.product_register_quantity = parseFloat(result);

              if (selectedOptionNew.product_register_quantity < selectedOptionNew.quantity && checkNumSelect < 1) {
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
                updatedOptions.push(selectedOption);
              }
            } else if (parseFloat(stockItem) === totolIsSelect + selectedOptionNew.product_register_quantity && checkNumSelect.length > 0) {
              updatedOptions = updatedOptions.filter((x) => x.id !== checkNumSelect[0].id);
            } else if (totolIsSelect < selectedOptionNew.product_register_quantity) {
              selectedOptionNew.quantity = selectedOptionNew.product_register_quantity - totolIsSelect;
            }
          } else if (checkNumSelect.length > 0) {
            const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);

            updatedOptions = filterRemove;
            updatedOptions.push(selectedOptionNew);
          }

          const idKey = updatedOptions.findIndex((option) => option.id === key);
          updatedOptions[idKey] = selectedOptionNew;
        }
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length === 0) {
        const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);

        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
        if (checkStock.length > 0) {
          let totolIsSelect = 0;
          checkStock.map((x) => (totolIsSelect = x.product_register_quantity + totolIsSelect));

          if (parseFloat(stockItem) < totolIsSelect + selectedOptionNew.product_register_quantity) {
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedOptionNew.product_register_quantity = parseFloat(result);

            if (
              parseFloat(stockItem) > parseFloat(items.quantity) &&
              orderList.length < 3 &&
              orderList.length < items.productRegis.length
            ) {
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
      console.error(error);
      setLoading(false);
    }
  };

  const handleClickOpen = async (step_id, fr, queues_id, station_id, queuesData) => {
    //ข้อความแจ้งเตือน
    //call = เรียกคิว, close = ปิดคิว, cancel = ยกเลิกคิว
    if (fr === 'call') {
      setText('เรียกคิว');
      setMessage('ขึ้นสินค้า–STEP2 เรียกคิว');
      setOrderSelect([]);

      setSaveLoading(true);
      await Promise.all([
        // await getProductRegisters(),
        await getOrderOfReserve(queuesData.reserve_id, 'call'),
        await getReserveId(queuesData.reserve_id)
      ]).then(() => {
        setSaveLoading(false); // ปิดการแสดง Loading เมื่อข้อมูลทั้งหมดถูกโหลดเสร็จ
      });
    } else if (fr === 'close') {
      setMessage('ขึ้นสินค้า–STEP2 ปิดคิว');
      setTeamLoading([]);
      setOrderSelect([]);
      setTypeSelect([]);
      setTypeNumSelect([]);

      setSaveLoading(true);
      await Promise.all([
        // await getProductRegisters(),
        await getOrderOfReserve(queuesData.reserve_id, 'close'),
        await getReserveId(queuesData.reserve_id)
      ]).then(() => {
        setSaveLoading(false); // ปิดการแสดง Loading เมื่อข้อมูลทั้งหมดถูกโหลดเสร็จ
      });
      // getOrderOfReserve(queuesData.reserve_id, 'close');
      // getReserveId(queuesData.reserve_id);
      setText('ปิดคิว');
    } else {
      setSaveLoading(true);
      await Promise.all([
        // await getProductRegisters(),
        await getReserveId(queuesData.reserve_id),
        await getOrderOfReserve(queuesData.reserve_id, 'cancle')
      ]).then(() => {
        setSaveLoading(false); // ปิดการแสดง Loading เมื่อข้อมูลทั้งหมดถูกโหลดเสร็จ
      });
      // getOrderOfReserve(queuesData.reserve_id, 'cancle');
      setMessage('ขึ้นสินค้า–STEP2 ยกเลิกเรียกคิว');
      setText('ยกเลิก');
    }

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

    if (flag === 1) {
      setOnClickSubmit(true);
      if (fr === 'call') {
        setLoading(true);
        if (station_count < station_num) {
          if (station_id) {
            // ตัวเลขที่ต้องการค้นหา stations_id ที่เลือกไปแล้ว
            const foundItem = items2.find((item) => item.station_id === station_id);
            if (foundItem) {
              // พบ item ที่มี station_id ที่ต้องการ
              setLoading(false);
              setOnClickSubmit(false);
              alert("หัวจ่าย '" + foundItem.station_description + "' ไม่ว่าง");
              return;
            }

            if (!checkProductQuantities(loopSelect, enqueueSnackbar)) {
              setLoading(false);
              setOnClickSubmit(false);
              return;
            }
            // if (status === 9999) {
            setItems([]);
            setOpen(false);

            for (let x of loopSelect) {
              if (x.order_id && x.item_id && x.product_register_id) {
                const getItemsRegisData = await getItemsRegisByOrder(x.order_id);
                const checkItemsRegisData = getItemsRegisData.filter(
                  (i) => i.product_register_id === x.product_register_id && i.item_id === x.item_id && i.order_id === x.order_id
                );

                if (queues.recall_status === 'Y' && checkItemsRegisData.length > 0) {
                  updateItemsRegister(x.item_register_id, x);
                } else {
                  addItemsRegister(x);
                }
              }
            }

            // ตัดสต็อกสินค้าเมื่อเรียกคิว
            if (orderSelect.length > 0) {
              orderSelect.forEach((dataOrder) => {
                const setData = {
                  product_register_id: dataOrder.value,
                  smash_quantity: 0,
                  sling_hook_quantity: 0,
                  sling_sort_quantity: 0,
                  jumbo_hook_quantity: 0
                };
                updateRegisterItems(dataOrder.id, setData);
              });
            }
            // if (status === 9999) {
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
            orderSelect.forEach((dataOrder) => {
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
            setLoopSelect([]);
            enqueueSnackbar('เรียกคิวรับสินค้า สำเร็จ!', { variant: 'success' });
            // }
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
            // if (status === 9999) {
            setItems([]);
            setOpen(false);

            const dataLogStock = {
              audit_user_id: userId,
              audit_action: 'A',
              audit_system_id: id_update,
              audit_system: 'step2',
              audit_screen: 'ปิดคิวครับสินค้า :ข้อมูลกองสินค้า',
              audit_description: JSON.stringify(loopSelect)
            };
            AddAuditLogs(dataLogStock);

            // อัปเดตข้อมูลกองสินค้าที่เลือก
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
            getStepToken(id_update)
              .then(({ queue_id, token }) => {
                // lineNotify(queue_id, token);
                telegramNotify(queue_id, token);
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

            await updateLoadingTeams([id_update, id_update_next]);

            await updateTeamLoading();
            // await updateTeamData();
            await updateEndTime(id_update);
            await updateStartTime(id_update_next);

            // อัปเดตสถานะและข้อมูลของทั้งสองขั้นตอนใน API call เดียว
            const station_id2 = station_id;
            const currentDate = await stepRequest.getCurrentDate();
            // const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const updates = [
              { step_id: id_update, status: 'completed', station_id: station_id2, updated_at: currentDate },
              { step_id: id_update_next, status: 'waiting', station_id: 27, updated_at: currentDate }
            ];
            await updateMultipleStepStatus(updates);
            enqueueSnackbar('ปิดคิวรับสินค้า สำเร็จ!', { variant: 'success' });

            // await getProductRegisters();
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
          try {
            setLoading(true);
            setOpen(false);
            setItems([]);

            if (!stationStatus || stationStatus === 'R') {
              const data = {
                audit_user_id: userId,
                audit_action: 'D',
                audit_system_id: queues.reserve_id,
                audit_system: 'step2',
                audit_screen: 'ข้อมูลการจอง',
                audit_description: 'ยกเลิกการเลือกกองสินค้า'
              };
              AddAuditLogs(data);
              for (let x of loopSelect) {
                await removeItemsRegister(x.item_register_id);
              }

              contracOtherValue.contract_other_status = 'waiting';
              if (reservesData.contractor_other_id) {
                await updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
              }
              enqueueSnackbar('ยกเลิกข้อมูลกองสินค้า!', { variant: 'success' });
            } else if (stationStatus === 'N') {
              const data = {
                audit_user_id: userId,
                audit_action: 'D',
                audit_system_id: queues.reserve_id,
                audit_system: 'step2',
                audit_screen: 'ข้อมูลการจอง',
                audit_description: 'ยกเลิกทีมขึ้นสินค้า'
              };

              await AddAuditLogs(data);
              await updateCancleTeams(queues.reserve_id);

              contracOtherValue.contract_other_status = 'waiting';
              if (reservesData.contractor_other_id) {
                await updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
              }
            } else if (stationStatus === 'Y') {
              const data = {
                audit_user_id: userId,
                audit_action: 'D',
                audit_system_id: id_update,
                audit_system: 'step2',
                audit_screen: 'ข้อมูลขึ้นสินค้า',
                audit_description: 'ยกเลิกการคำสั่งซื้อ'
              };
              await AddAuditLogs(data);
              for (let x of loopSelect) {
                await removeItemsRegister(x.item_register_id);
              }

              orders.map(async (order) => {
                await deleteOrder(order.order_id, order.reserve_id);
              });

              contracOtherValue.contract_other_status = 'waiting';
              if (reservesData.contractor_other_id) {
                await updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
              }
              enqueueSnackbar('ยกเลิกข้อมูลคำสั่งซื้อสินค้า!', { variant: 'success' });
            }

            getStepToken(id_update)
              .then(({ queue_id, token }) => {
                // lineNotify(queue_id, token);
                telegramNotify(queue_id, token);
              })
              .catch((error) => {
                setOnClickSubmit(false);
                console.error('Error:', error);
              });

            // if (queues.contractor_id === 9999) {
            updateStation(station_id, 'waiting');
            updateContractor(queues.contractor_id, 'waiting');
            setStationCount(station_count - 1);
            await step1Update(id_update, 'waiting', 27);
            await updateStartTime(id_update);
            setStockSelect([]);
            setReservesData([]);
            setLoopSelect([]);
            // }
            setStationCount(station_count - 1);
            await step1Update(id_update, 'waiting', 27);
            await updateStartTime(id_update);

            setStationStatus('');
            setStockSelect([]);
            setReservesData([]);
            setLoopSelect([]);
          } catch (error) {
            console.error(' Handle click Cancle', error);
          }
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

  const getItemsRegisByOrder = async (id) => {
    // const startTime = performance.now(); // เริ่มจับเวลา
    try {
      const response = await stepRequest.getItemsRegisterOrderId(id);
      return response;
    } catch (error) {
      console.log(error);
      return []; // ส่งกลับ array ว่างในกรณีที่เกิด error
    }
    // finally {
    //   const endTime = performance.now(); // จบการจับเวลา
    //   const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2); // คำนวณเวลาเป็นวินาที
    //   console.log('เวลา getAllItemsRegis : ', timeInSeconds);
    // }
  };

  // เพิ่มข้อมูลกองสินค้า
  const addItemsRegister = async (data) => {
    await stepRequest.addItemRegister(data);
  };

  // ลบข้อมูลคำสั่งซื้อ
  const deleteOrder = async (orderId, regisId) => {
    try {
      await reserveRequest.deleteOrderId(orderId).then(() => updateReserveTotal(regisId));
    } catch (error) {
      console.log(error);
    }
  };

  const updateReserveTotal = async (id) => {
    try {
      await reserveRequest.getReserTotalByID(id);
    } catch (error) {
      console.log(error);
    }
  };
  // ลบข้อมูลกองสินค้า
  const removeItemsRegister = async (id) => {
    try {
      await stepRequest.deleteItemsRegister(id);
    } catch (error) {
      console.log(error);
    }
  };

  // แก้ไขข้อมูลกองสินค้า
  const updateItemsRegister = async (id, data) => {
    try {
      await stepRequest.putItemsRegister(id, data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateRegisterItems = async (id, data) => {
    await stepRequest.putRegisterItem(id, data);
  };

  // =============== บันทึกข้อมูล สายแรงงานใหม่ ===============//
  const updateContractorOthers = async (id, value) => {
    try {
      await adminRequest.putContractorOther(id, value);
    } catch (error) {
      console.log(error);
    }
  };

  //Update lineNotify Message
  // const lineNotify = (queue_id, token) => {
  //   const protocol = window.location.protocol;
  //   const hostname = window.location.hostname;
  //   const port = window.location.port;
  //   // if (queue_id === 99999) {
  //   var link = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  //   link = link + '/queues/detail/' + queue_id;

  //   const myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');

  //   const raw = JSON.stringify({
  //     message: message + ' หมายเลขคิว: ' + token + '\n' + link
  //   });

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow'
  //   };

  //   fetch(apiUrl + '/line-notify', requestOptions)
  //     .then((response) => response.text())
  //     .catch((error) => console.error(error));
  //   // }
  // };

  const telegramNotify = (queue_id, token) => {
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

    fetch(apiUrl + '/telegram-notify', requestOptions)
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
        const combinedData = [...result.team_managers, ...result.team_checkers, ...result.team_forklifts];
        setTeamLoading(combinedData);
      });
    } catch (error) {
      console.log(error);
    }
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

  // =============== Get Contractor and laybor Line ===============//
  const [labor_line_id, setLaborLineId] = useState([]);

  const getLaborLine = (id) => {
    try {
      adminRequest.getContractorById(id).then(() => {
        // setLayborLineList(result.labor_lines);
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
    functionCancleTeam.updateCancleTeamStation(reserveId);
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
          <CallQueueDialog
            open={open}
            onClose={handleClose}
            textnotify={textnotify}
            queues={queues}
            warehousesList={warehousesList}
            warehouseId={warehouseId}
            stationsList={stationsList}
            stationsId={stationsId}
            teamloadingList={teamloadingList}
            teamId={teamId}
            teamLoading={teamLoading}
            contractorList={contractorList}
            contractorId={contractorId}
            reservesData={reservesData}
            orders={orders}
            loopSelect={loopSelect}
            stockSelect={stockSelect}
            typeSelect={typeSelect}
            typeNumSelect={typeNumSelect}
            onclickSubmit={onclickSubmit}
            onProductChange={handleChangeProduct}
            onTypeSelect={handleChangeSelect}
            onTypeNumChange={handleChangeTypeNum}
            calculateAge={calculateAge}
            sumStock={sumStock}
            onCallQueue={handleCallQueue}
            onReset={() => {
              setLoopSelect([]);
              setStockSelect([]);
              setOrderSelect([]);
              getOrderOfReserve(queues.reserve_id, 'call');
            }}
            onConfirm={() => handleClose(1)}
          />
        )}

        {status == 'processing' && fr === 'close' && (
          <CloseQueueDialog
            open={open}
            onClose={handleClose}
            queues={queues}
            warehousesList={warehousesList}
            warehouseId={warehouseId}
            stationsList={stationsList}
            stationsId={stationsId}
            teamloadingList={teamloadingList}
            teamId={teamId}
            teamLoading={teamLoading}
            contractorList={contractorList}
            contractorId={contractorId}
            reservesData={reservesData}
            orders={orders}
            loopSelect={loopSelect}
            typeSelect={typeSelect}
            typeNumSelect={typeNumSelect}
            onProductChange={handleChangeProduct}
            onTypeSelect={handleChangeSelect}
            onTypeNumChange={handleChangeTypeNum}
            calculateAge={calculateAge}
          />
        )}

        {status == 'processing' && fr === 'cancel' && (
          <CancelQueueDialog
            open={open}
            onClose={handleClose}
            textnotify={textnotify}
            queues={queues}
            stationStatus={stationStatus}
            onSelectCloseStation={handleSelectCloseStation}
          />
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
              <QueueTableHead status={status} />
              <QueueTableBody
                loading={loading}
                items={items}
                status={status}
                permission={permission}
                selectedStations={selectedStations}
                stations={stations}
                onStationChange={handleStationChange}
                onCallQueue={handleCallQueue}
                onOpenDialog={handleClickOpen}
              />
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </>
  );
};
