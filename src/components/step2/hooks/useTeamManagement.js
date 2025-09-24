import { useState, useCallback } from 'react';
import { Step2ApiService } from '../services/Step2ApiService';
import { Step2Utils } from '../utils/Step2Utils';

export const useTeamManagement = () => {
  const [teamId, setTeamId] = useState([]);
  const [teamLoadingList, setTeamLoadingList] = useState([]);
  const [teamLoading, setTeamLoading] = useState([]);

  const getTeamLoadingByIdwh = useCallback(async (warehouseId) => {
    try {
      const result = await Step2ApiService.getLoadingTeamByIdwh(warehouseId);
      setTeamLoadingList(result);
    } catch (error) {
      console.error('Error getting team loading by warehouse:', error);
    }
  }, []);

  const getTeamLoadingByIds = useCallback(async (id) => {
    try {
      const result = await Step2ApiService.getLoadingTeamById(id);
      if (result) {
        const combinedData = Step2Utils.combineTeamData(result);
        setTeamLoading(combinedData);
      }
    } catch (error) {
      console.error('Error getting team loading by id:', error);
    }
  }, []);

  const handleChangeTeam = useCallback((e) => {
    setTeamLoading([]);
    setTeamId(e);
    getTeamLoadingByIds(e);
  }, [getTeamLoadingByIds]);

  const updateTeamLoading = useCallback(async (reserveId, teamId, contractorId, laborLineId) => {
    try {
      const teamValue = Step2Utils.createTeamValue(teamId, contractorId, laborLineId);
      return await Step2ApiService.putReserveTeam(reserveId, teamValue);
    } catch (error) {
      console.error('Error updating team loading:', error);
      throw error;
    }
  }, []);

  const updateLoadingTeams = useCallback(async (teamId, stepIds) => {
    try {
      return await Step2ApiService.updateLoadingTeams(teamId, stepIds);
    } catch (error) {
      console.error('Error updating loading teams:', error);
      throw error;
    }
  }, []);

  return {
    teamId,
    teamLoadingList,
    teamLoading,
    setTeamId,
    setTeamLoadingList,
    setTeamLoading,
    getTeamLoadingByIdwh,
    getTeamLoadingByIds,
    handleChangeTeam,
    updateTeamLoading,
    updateLoadingTeams
  };
};


