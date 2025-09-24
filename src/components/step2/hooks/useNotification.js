import { useCallback } from 'react';
import { Step2ApiService } from '../services/Step2ApiService';
import { Step2Utils } from '../utils/Step2Utils';
import SoundCall from 'components/@extended/SoundCall';

export const useNotification = () => {
  const sendTelegramNotification = useCallback(async (queueId, token, message) => {
    try {
      return await Step2ApiService.telegramNotify(queueId, token, message);
    } catch (error) {
      console.error('Error sending telegram notification:', error);
      throw error;
    }
  }, []);

  const getStepToken = useCallback(async (stepId) => {
    try {
      return await Step2ApiService.getStepToken(stepId);
    } catch (error) {
      console.error('Error getting step token:', error);
      throw error;
    }
  }, []);

  const handleCallQueue = useCallback(async (queues, stationsList, warehousesList) => {
    const cleanedToken = Step2Utils.formatToken(queues.token);
    const titleTxt = `ขอเชิญคิวหมายเลขที่ ${cleanedToken}`;
    const detailTxt = `เข้าโกดัง`;
    
    let titleTxtStation = '';
    let getWarehouseData = '';

    if (queues.station_id === 27) {
      const getStationData = stationsList.filter((x) => x.station_id === queues.reserve_station_id);
      if (getStationData.length > 0) {
        getWarehouseData = warehousesList.filter((x) => x.warehouse_id === getStationData[0].warehouse_id);
        titleTxtStation = getStationData[0].station_description;
      }
    } else {
      getWarehouseData = warehousesList.filter((x) => x.warehouse_id === queues.warehouse_id);
      titleTxtStation = queues.station_description;
    }

    const cleanedStringStation = Step2Utils.cleanStationDescription(titleTxtStation);
    const spacedString = Step2Utils.formatRegistrationForAudio(queues.registration_no);

    const audioMessage = `${titleTxt} ทะเบียน ${spacedString} ${detailTxt} ${getWarehouseData[0]?.warehouse_name || ''} ${cleanedStringStation}`;
    
    SoundCall(audioMessage);
  }, []);

  const sendNotificationWithToken = useCallback(async (stepId, message) => {
    try {
      const { queue_id, token } = await getStepToken(stepId);
      await sendTelegramNotification(queue_id, token, message);
    } catch (error) {
      console.error('Error sending notification with token:', error);
      throw error;
    }
  }, [getStepToken, sendTelegramNotification]);

  return {
    sendTelegramNotification,
    getStepToken,
    handleCallQueue,
    sendNotificationWithToken
  };
};


