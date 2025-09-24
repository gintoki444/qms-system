import { useState, useCallback } from 'react';
import { Step2ApiService } from '../services/Step2ApiService';

export const useWarehouseManagement = () => {
  const [warehouseId, setWarehouseId] = useState('');
  const [warehousesList, setWarehousesList] = useState([]);
  const [stationsId, setStationsId] = useState('');
  const [stationsList, setStationsList] = useState([]);

  const getWarehouses = useCallback(async () => {
    try {
      const result = await Step2ApiService.getAllWarehouses();
      setWarehousesList(result);
    } catch (error) {
      console.error('Error getting warehouses:', error);
    }
  }, []);

  const getStationById = useCallback(async (id) => {
    try {
      const response = await Step2ApiService.getStationsByWarehouse(id);
      setStationsList(response);
    } catch (error) {
      console.error('Error getting stations by warehouse:', error);
    }
  }, []);

  const handleChangeWarehouse = useCallback((e) => {
    setStationsId('');
    setWarehouseId(e.target.value);
    getStationById(e.target.value);
  }, [getStationById]);

  const handleChangeStation = useCallback((e) => {
    setStationsId(e.target.value);
  }, []);

  return {
    warehouseId,
    warehousesList,
    stationsId,
    stationsList,
    setWarehouseId,
    setWarehousesList,
    setStationsId,
    setStationsList,
    getWarehouses,
    getStationById,
    handleChangeWarehouse,
    handleChangeStation
  };
};


