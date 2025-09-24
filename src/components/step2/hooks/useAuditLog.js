import { useCallback } from 'react';
import * as functionAddLogs from 'components/Function/AddLog';
import { Step2Utils } from '../utils/Step2Utils';

export const useAuditLog = () => {
  const addAuditLog = useCallback(async (data) => {
    try {
      await functionAddLogs.AddAuditLog(data);
    } catch (error) {
      console.error('Error adding audit log:', error);
      throw error;
    }
  }, []);

  const createAuditLog = useCallback((userId, action, systemId, system, screen, description) => {
    return Step2Utils.createAuditLogData(userId, action, systemId, system, screen, description);
  }, []);

  const logStockSelection = useCallback(async (userId, systemId, loopSelect) => {
    const data = createAuditLog(
      userId,
      'A',
      systemId,
      'step2',
      'เลือกกองสินค้า',
      JSON.stringify(loopSelect)
    );
    await addAuditLog(data);
  }, [addAuditLog, createAuditLog]);

  const logCallQueue = useCallback(async (userId, systemId) => {
    const data = createAuditLog(
      userId,
      'I',
      systemId,
      'step2',
      'ข้อมูลขึ้นสินค้า',
      'เรียกขึ้นสินค้า'
    );
    await addAuditLog(data);
  }, [addAuditLog, createAuditLog]);

  const logCloseQueue = useCallback(async (userId, systemId, loopSelect) => {
    const data = createAuditLog(
      userId,
      'A',
      systemId,
      'step2',
      'ปิดคิวครับสินค้า :ข้อมูลกองสินค้า',
      JSON.stringify(loopSelect)
    );
    await addAuditLog(data);
  }, [addAuditLog, createAuditLog]);

  const logSaveData = useCallback(async (userId, systemId) => {
    const data = createAuditLog(
      userId,
      'U',
      systemId,
      'step2',
      'ข้อมูลขึ้นสินค้า',
      'บันทึกข้อมูลขึ้นสินค้า'
    );
    await addAuditLog(data);
  }, [addAuditLog, createAuditLog]);

  const logCancelStockSelection = useCallback(async (userId, reserveId) => {
    const data = createAuditLog(
      userId,
      'D',
      reserveId,
      'step2',
      'ข้อมูลการจอง',
      'ยกเลิกการเลือกกองสินค้า'
    );
    await addAuditLog(data);
  }, [addAuditLog, createAuditLog]);

  const logCancelTeam = useCallback(async (userId, reserveId) => {
    const data = createAuditLog(
      userId,
      'D',
      reserveId,
      'step2',
      'ข้อมูลการจอง',
      'ยกเลิกทีมขึ้นสินค้า'
    );
    await addAuditLog(data);
  }, [addAuditLog, createAuditLog]);

  const logCancelOrder = useCallback(async (userId, systemId) => {
    const data = createAuditLog(
      userId,
      'D',
      systemId,
      'step2',
      'ข้อมูลขึ้นสินค้า',
      'ยกเลิกการคำสั่งซื้อ'
    );
    await addAuditLog(data);
  }, [addAuditLog, createAuditLog]);

  return {
    addAuditLog,
    createAuditLog,
    logStockSelection,
    logCallQueue,
    logCloseQueue,
    logSaveData,
    logCancelStockSelection,
    logCancelTeam,
    logCancelOrder
  };
};


