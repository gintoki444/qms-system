import { useState, useCallback } from 'react';
import { Step2ApiService } from '../services/Step2ApiService';
import { Step2Utils } from '../utils/Step2Utils';
import checkProductQuantities from 'components/Function/checkProductQuantities';
import * as functionCancleTeam from 'components/Function/CancleTeamStation';

export const useStep2BusinessLogic = () => {
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [reservesData, setReservesData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [onclickSubmit, setOnClickSubmit] = useState(false);

  // Get waiting data
  const getWaitingData = useCallback(async (onFilter) => {
    try {
      const response = await Step2ApiService.getStep2Waiting();
      const filteredItems = Step2Utils.filterItemsByCompany(response, onFilter);
      setItems(filteredItems);
      
      // Also get processing data for station checking
      const processingResponse = await Step2ApiService.getStep2Processing();
      setItems2(processingResponse);
    } catch (error) {
      console.error('Error getting waiting data:', error);
    }
  }, []);

  // Get processing data
  const getProcessingData = useCallback(async () => {
    try {
      const response = await Step2ApiService.getStep2Processing();
      setItems(response);
      setItems2(response);
    } catch (error) {
      console.error('Error getting processing data:', error);
    }
  }, []);

  // Get reserve data
  const getReserveData = useCallback(async (reserveId) => {
    try {
      const response = await Step2ApiService.getReserveById(reserveId);
      if (response?.reserve) {
        const result = response.reserve[0];
        setReservesData(result);
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error getting reserve data:', error);
      return null;
    }
  }, []);

  // Get order data
  const getOrderData = useCallback(async (reserveId, status) => {
    try {
      const response = await Step2ApiService.getOrderByReserveId(reserveId);
      if (response.length > 0) {
        setOrders(response);
        return response;
      }
      return [];
    } catch (error) {
      console.error('Error getting order data:', error);
      return [];
    }
  }, []);

  // Get product registers
  const getProductRegisters = useCallback(async (status, onFilter) => {
    try {
      let allResponse;

      if (status === 'call') {
        const response = await Step2ApiService.getAllProductRegister();
        allResponse = [...response];
      } else {
        const [response, response0] = await Promise.all([
          Step2ApiService.getAllProductRegister(),
          Step2ApiService.getAllProductHistory()
        ]);
        allResponse = [...response, ...response0];
      }

      if (onFilter) {
        return allResponse.filter((x) => x.product_company_id === onFilter);
      } else {
        return allResponse;
      }
    } catch (error) {
      console.error('Error getting product registers:', error);
      return [];
    }
  }, []);

  // Process order items
  const processOrderItems = useCallback(async (response, status, onFilter, setLoopSelect, setOrderSelect) => {
    if (response.length > 0) {
      const getAllProductRegis = await getProductRegisters(status, onFilter);

      for (let result of response) {
        const allProductRegis = await Step2ApiService.getItemsRegisterOrderId(result.order_id);

        if (result.product_company_id && result.product_brand_id) {
          for (let data of result.items) {
            const getProductRegis = getAllProductRegis.filter(
              (x) =>
                x.product_id === data.product_id &&
                x.product_brand_id === result.product_brand_id &&
                x.product_company_id === result.product_company_id
            );

            data.productRegis = getProductRegis;

            if (allProductRegis.length > 0) {
              setLoopSelect((prevState) => {
                const updatedOptions = [...prevState];
                allProductRegis.forEach((x) => {
                  if (x.order_id === data.order_id && x.item_id === data.item_id) {
                    x.quantity = parseFloat(data.quantity);
                    x.product_register_quantity = parseFloat(x.product_register_quantity);
                    updatedOptions.push(x);
                  }
                });
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
    }
  }, [getProductRegisters]);

  // Handle call queue
  const handleCallQueue = useCallback(async (
    stationId,
    stationCount,
    stationNum,
    items2,
    loopSelect,
    enqueueSnackbar,
    queues,
    reservesData,
    orderSelect,
    userId,
    idUpdate,
    setItems,
    setOpen,
    setOnClickSubmit,
    setLoading,
    updateStation,
    updateContractor,
    setStationCount,
    step1Update,
    updateStartTime,
    setLoopSelect,
    updateContractorOthers,
    updateRegisterItems,
    logStockSelection,
    logCallQueue
  ) => {
    setLoading(true);
    
    if (stationCount < stationNum) {
      if (stationId) {
        const foundItem = items2.find((item) => item.station_id === stationId);
        if (foundItem) {
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

        setItems([]);
        setOpen(false);

        // Process loop select items
        for (let x of loopSelect) {
          if (x.order_id && x.item_id && x.product_register_id) {
            const getItemsRegisData = await Step2ApiService.getItemsRegisterOrderId(x.order_id);
            const checkItemsRegisData = getItemsRegisData.filter(
              (i) => i.product_register_id === x.product_register_id && i.item_id === x.item_id && i.order_id === x.order_id
            );

            if (queues.recall_status === 'Y' && checkItemsRegisData.length > 0) {
              await Step2ApiService.updateItemsRegister(x.item_register_id, x);
            } else {
              await Step2ApiService.addItemRegister(x);
            }
          }
        }

        // Log stock selection
        await logStockSelection(userId, idUpdate, loopSelect);

        // Update register items
        orderSelect.forEach((dataOrder) => {
          const setData = Step2Utils.createRegisterItemData(dataOrder.value);
          updateRegisterItems(dataOrder.id, setData);
        });

        // Log call queue
        await logCallQueue(userId, idUpdate);

        // Update contractor others
        if (reservesData.contractor_other_id) {
          const contracOtherValue = Step2Utils.createContractorOtherValue(reservesData, new Date(), 'working');
          await updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
        }

        // Update station and contractor
        await updateStation(stationId, 'working');
        await updateContractor(queues.contractor_id, 'working');
        setStationCount(stationCount + 1);
        
        // Update step status
        await step1Update(idUpdate, 'processing', stationId);
        await updateStartTime(idUpdate);
        
        setLoopSelect([]);
        enqueueSnackbar('เรียกคิวรับสินค้า สำเร็จ!', { variant: 'success' });
      } else {
        setOnClickSubmit(false);
        alert('กรุณาเลือกหัวจ่าย');
      }
    } else {
      setOnClickSubmit(false);
      alert('สถานีบริการเต็ม');
    }
  }, []);

  // Handle close queue
  const handleCloseQueue = useCallback(async (
    teamId,
    contractorId,
    orders,
    typeSelect,
    typeNumSelect,
    loopSelect,
    orderSelect,
    userId,
    idUpdate,
    setItems,
    setOpen,
    setOnClickSubmit,
    setLoading,
    updateStation,
    updateContractor,
    setStationCount,
    stationId,
    updateLoadingTeams,
    updateTeamLoading,
    updateEndTime,
    updateStartTime,
    idUpdateNext,
    updateMultipleStepStatus,
    setStockSelect,
    setLoopSelect,
    enqueueSnackbar,
    logCloseQueue,
    logSaveData,
    updateContractorOthers,
    reservesData,
    sendNotificationWithToken,
    message
  ) => {
    setLoading(true);

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

    const { countSelectError, countSelectErrorNum } = Step2Utils.validateTypeSelection(typeSelect, typeNumSelect);

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
      setItems([]);
      setOpen(false);

      // Log close queue
      await logCloseQueue(userId, idUpdate, loopSelect);

      // Update items register
      loopSelect.forEach((x) => {
        if (
          x.item_register_id &&
          (x.order_id !== null || x.order_id !== undefined) &&
          (x.item_id !== null || x.item_id !== undefined) &&
          (x.product_register_id !== null || x.product_register_id !== undefined)
        ) {
          Step2ApiService.updateItemsRegister(x.item_register_id, x);
        }
      });

      if (orderSelect.length > 0 || typeSelect.length !== 0) {
        orders.forEach((order) => {
          order.items.forEach((items) => {
            const checkOrderSelect = orderSelect.filter((x) => x.id === items.item_id);
            const filterNumSelect = typeNumSelect.filter((x) => x.id === items.item_id);

            if (checkOrderSelect.length > 0) {
              checkOrderSelect.forEach((dataOrder) => {
                if (filterNumSelect.length > 0) {
                  const setData = Step2Utils.createRegisterItemData(dataOrder.value);
                  filterNumSelect.forEach((x) => {
                    if (x.name === 'checked1') setData.smash_quantity = x.value;
                    if (x.name === 'checked2') setData.sling_hook_quantity = x.value;
                    if (x.name === 'checked3') setData.sling_sort_quantity = x.value;
                    if (x.name === 'checked4') setData.jumbo_hook_quantity = x.value;
                  });
                  updateRegisterItems(dataOrder.id, setData);
                } else {
                  const setData = Step2Utils.createRegisterItemData(items.product_register_id);
                  updateRegisterItems(items.item_id, setData);
                }
              });
            } else {
              if (filterNumSelect.length > 0) {
                const setData = Step2Utils.createRegisterItemData(items.product_register_id);
                filterNumSelect.forEach((x) => {
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

      // Send notification
      await sendNotificationWithToken(idUpdate, message);

      // Update contractor others
      const contracOtherValue = Step2Utils.createContractorOtherValue(reservesData, new Date(), 'completed');
      if (reservesData.contractor_other_id) {
        await updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
      }

      // Log save data
      await logSaveData(userId, idUpdate);

      // Update station and contractor
      setStationCount(stationCount - 1);
      await updateStation(stationId, 'waiting');
      await updateContractor(queues.contractor_id, 'waiting');

      // Update loading teams
      await updateLoadingTeams(teamId, [idUpdate, idUpdateNext]);
      await updateTeamLoading();

      // Update times
      await updateEndTime(idUpdate);
      await updateStartTime(idUpdateNext);

      // Update multiple step status
      const currentDate = await Step2ApiService.getCurrentDate();
      const updates = Step2Utils.createStepUpdates(idUpdate, idUpdateNext, stationId, currentDate);
      await updateMultipleStepStatus(updates);

      enqueueSnackbar('ปิดคิวรับสินค้า สำเร็จ!', { variant: 'success' });

      setStockSelect([]);
      setLoopSelect([]);
    } catch (error) {
      console.error('Error in close queue:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setStockSelect([]);
      setReservesData([]);
      setLoopSelect([]);
    }
  }, []);

  // Handle cancel queue
  const handleCancelQueue = useCallback(async (
    stationStatus,
    loopSelect,
    queues,
    reservesData,
    orders,
    userId,
    setLoading,
    setOpen,
    setItems,
    setStationCount,
    stationId,
    step1Update,
    updateStartTime,
    setStockSelect,
    setReservesData,
    setLoopSelect,
    setStationStatus,
    logCancelStockSelection,
    logCancelTeam,
    logCancelOrder,
    updateContractorOthers,
    sendNotificationWithToken,
    message,
    idUpdate
  ) => {
    try {
      setLoading(true);
      setOpen(false);
      setItems([]);

      if (!stationStatus || stationStatus === 'R') {
        await logCancelStockSelection(userId, queues.reserve_id);
        
        for (let x of loopSelect) {
          await Step2ApiService.removeItemsRegister(x.item_register_id);
        }

        const contracOtherValue = Step2Utils.createContractorOtherValue(reservesData, new Date(), 'waiting');
        if (reservesData.contractor_other_id) {
          await updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
        }
        enqueueSnackbar('ยกเลิกข้อมูลกองสินค้า!', { variant: 'success' });
      } else if (stationStatus === 'N') {
        await logCancelTeam(userId, queues.reserve_id);
        await functionCancleTeam.updateCancleTeamStation(queues.reserve_id);

        const contracOtherValue = Step2Utils.createContractorOtherValue(reservesData, new Date(), 'waiting');
        if (reservesData.contractor_other_id) {
          await updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
        }
      } else if (stationStatus === 'Y') {
        await logCancelOrder(userId, idUpdate);
        
        for (let x of loopSelect) {
          await Step2ApiService.removeItemsRegister(x.item_register_id);
        }

        orders.forEach(async (order) => {
          await Step2ApiService.deleteOrderId(order.order_id);
        });

        const contracOtherValue = Step2Utils.createContractorOtherValue(reservesData, new Date(), 'waiting');
        if (reservesData.contractor_other_id) {
          await updateContractorOthers(reservesData.contractor_other_id, contracOtherValue);
        }
        enqueueSnackbar('ยกเลิกข้อมูลคำสั่งซื้อสินค้า!', { variant: 'success' });
      }

      // Send notification
      await sendNotificationWithToken(idUpdate, message);

      // Update station and contractor
      await updateStation(stationId, 'waiting');
      await updateContractor(queues.contractor_id, 'waiting');
      setStationCount(stationCount - 1);
      await step1Update(idUpdate, 'waiting', 27);
      await updateStartTime(idUpdate);

      setStationStatus('');
      setStockSelect([]);
      setReservesData([]);
      setLoopSelect([]);
    } catch (error) {
      console.error('Error in cancel queue:', error);
    }
  }, []);

  return {
    items,
    items2,
    reservesData,
    orders,
    loading,
    saveLoading,
    onclickSubmit,
    setItems,
    setItems2,
    setReservesData,
    setOrders,
    setLoading,
    setSaveLoading,
    setOnClickSubmit,
    getWaitingData,
    getProcessingData,
    getReserveData,
    getOrderData,
    getProductRegisters,
    processOrderItems,
    handleCallQueue,
    handleCloseQueue,
    handleCancelQueue
  };
};


