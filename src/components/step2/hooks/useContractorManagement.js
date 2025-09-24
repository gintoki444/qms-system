import { useState, useCallback } from 'react';
import { Step2ApiService } from '../services/Step2ApiService';

export const useContractorManagement = () => {
  const [contractorId, setContractorId] = useState([]);
  const [contractorList, setContractorList] = useState([]);
  const [laborLineId, setLaborLineId] = useState([]);
  const [laborLineList, setLaborLineList] = useState([]);

  const getAllContractors = useCallback(async () => {
    try {
      const result = await Step2ApiService.getAllContractors();
      setContractorList(result);
    } catch (error) {
      console.error('Error getting contractors:', error);
    }
  }, []);

  const getLaborLine = useCallback(async (id) => {
    try {
      const result = await Step2ApiService.getContractorById(id);
      if (result) {
        setLaborLineList(result.labor_lines || []);
      }
    } catch (error) {
      console.error('Error getting labor line:', error);
    }
  }, []);

  const handleChangeContractor = useCallback((e) => {
    getLaborLine(e.target.value);
    setContractorId(e.target.value);
  }, [getLaborLine]);

  const handleChangeLaborLine = useCallback((e) => {
    setLaborLineId(e.target.value);
  }, []);

  const updateContractor = useCallback(async (id, status) => {
    try {
      return await Step2ApiService.updateContractor(id, status);
    } catch (error) {
      console.error('Error updating contractor:', error);
      throw error;
    }
  }, []);

  const updateContractorOthers = useCallback(async (id, value) => {
    try {
      return await Step2ApiService.putContractorOther(id, value);
    } catch (error) {
      console.error('Error updating contractor others:', error);
      throw error;
    }
  }, []);

  return {
    contractorId,
    contractorList,
    laborLineId,
    laborLineList,
    setContractorId,
    setContractorList,
    setLaborLineId,
    setLaborLineList,
    getAllContractors,
    getLaborLine,
    handleChangeContractor,
    handleChangeLaborLine,
    updateContractor,
    updateContractorOthers
  };
};


