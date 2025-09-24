import moment from 'moment/min/moment-with-locales';

export const Step2Utils = {
  // Calculate age from registration date
  calculateAge: (registrationDate) => {
    if (!registrationDate) return '-';

    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const regDate = moment(registrationDate).format('YYYY-MM-DD');

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
  },

  // Sum selected product registers
  sumSelectProductRegis: (data) => {
    let sumData = 0;
    data.forEach((x) => {
      if (x.product_register_quantity) {
        sumData = x.product_register_quantity + sumData;
      }
    });
    return sumData;
  },

  // Calculate stock sum
  sumStock: (stockSelect, producrReId, onStock) => {
    const setStock = stockSelect.filter((x) => x.product_register_id === producrReId);
    let total = 0;

    if (setStock.length > 0) {
      setStock.forEach((x) => (total = parseFloat(x.stockQuetity) + total));
    }
    total = parseFloat(onStock) - total;
    return total;
  },

  // Format token for display
  formatToken: (token) => {
    return token.split('').join(' ');
  },

  // Format registration number for audio
  formatRegistrationForAudio: (registrationNo) => {
    return registrationNo
      .split('')
      .join(' ')
      .replace(/-/g, 'ขีด')
      .replace(/\//g, 'ทับ')
      .replace(/,/g, 'พ่วง');
  },

  // Clean station description
  cleanStationDescription: (stationDescription) => {
    return stationDescription.replace(/^A\d\/\d\s*/g, '');
  },

  // Validate product quantities
  validateProductQuantities: (loopSelect, enqueueSnackbar) => {
    if (!loopSelect || loopSelect.length === 0) {
      enqueueSnackbar('กรุณาเลือกกองสินค้า', { variant: 'error' });
      return false;
    }

    const hasValidSelection = loopSelect.some(item => 
      item.product_register_id && 
      item.product_register_id !== '' &&
      item.product_register_quantity > 0
    );

    if (!hasValidSelection) {
      enqueueSnackbar('กรุณาเลือกกองสินค้าที่ถูกต้อง', { variant: 'error' });
      return false;
    }

    return true;
  },

  // Check if station is available
  isStationAvailable: (stationId, items2) => {
    return !items2.find((item) => item.station_id === stationId);
  },

  // Get warehouse data by station
  getWarehouseDataByStation: (stationId, stationsList, warehousesList) => {
    if (stationId === 27) {
      const stationData = stationsList.find((x) => x.station_id === stationId);
      if (stationData) {
        return warehousesList.find((x) => x.warehouse_id === stationData.warehouse_id);
      }
    }
    return null;
  },

  // Get station description
  getStationDescription: (stationId, stationsList, queues) => {
    if (stationId === 27) {
      const stationData = stationsList.find((x) => x.station_id === queues.reserve_station_id);
      return stationData?.station_description || '';
    }
    return queues.station_description || '';
  },

  // Combine team data
  combineTeamData: (teamData) => {
    if (!teamData) return [];
    
    return [
      ...(teamData.team_managers || []),
      ...(teamData.team_checkers || []),
      ...(teamData.team_forklifts || [])
    ];
  },

  // Filter items by company
  filterItemsByCompany: (items, companyId) => {
    if (!companyId || companyId === 0) {
      return items.filter((x) => 
        x.team_id !== null && 
        x.reserve_station_id !== 1 && 
        parseFloat(x.total_quantity) > 0
      );
    }
    
    return items.filter((x) =>
      x.product_company_id === companyId &&
      x.team_id !== null &&
      x.reserve_station_id !== 1 &&
      parseFloat(x.total_quantity) > 0
    );
  },

  // Create audit log data
  createAuditLogData: (userId, action, systemId, system, screen, description) => {
    return {
      audit_user_id: userId,
      audit_action: action,
      audit_system_id: systemId,
      audit_system: system,
      audit_screen: screen,
      audit_description: description
    };
  },

  // Create contractor other value
  createContractorOtherValue: (reservesData, currentDate, status = 'working') => {
    return {
      reserve_id: reservesData.reserve_id,
      contractor_id: reservesData.contractor_id_to_other,
      contract_other_status: status,
      contract_other_update: currentDate
    };
  },

  // Create team value
  createTeamValue: (teamId, contractorId, laborLineId) => {
    return {
      team_id: teamId,
      contractor_id: contractorId,
      labor_line_id: laborLineId
    };
  },

  // Create register item data
  createRegisterItemData: (productRegisterId, quantities = {}) => {
    return {
      product_register_id: productRegisterId,
      smash_quantity: quantities.smash_quantity || 0,
      sling_hook_quantity: quantities.sling_hook_quantity || 0,
      sling_sort_quantity: quantities.sling_sort_quantity || 0,
      jumbo_hook_quantity: quantities.jumbo_hook_quantity || 0
    };
  },

  // Validate type selection
  validateTypeSelection: (typeSelect, typeNumSelect) => {
    let countSelectError = 0;
    let countSelectErrorNum = 0;

    if (typeSelect.length > 0) {
      typeSelect.forEach((checked) => {
        if (checked.value === 'on') {
          const finNumSelect = typeNumSelect.filter(
            (x) => x.id === checked.id && x.name === checked.name
          );
          
          if (finNumSelect.length === 0 || finNumSelect[0].value === '') {
            countSelectError++;
          } else if (finNumSelect.length > 0 && parseFloat(finNumSelect[0].value) <= 0) {
            countSelectErrorNum++;
          }
        }
      });
    }

    return { countSelectError, countSelectErrorNum };
  },

  // Count total items in orders
  countTotalItems: (orders) => {
    let count = 0;
    orders.forEach((orderData) => {
      count += orderData.items.length;
    });
    return count;
  },

  // Create step updates array
  createStepUpdates: (idUpdate, idUpdateNext, stationId, currentDate) => {
    return [
      { 
        step_id: idUpdate, 
        status: 'completed', 
        station_id: stationId, 
        updated_at: currentDate 
      },
      { 
        step_id: idUpdateNext, 
        status: 'waiting', 
        station_id: 27, 
        updated_at: currentDate 
      }
    ];
  }
};

