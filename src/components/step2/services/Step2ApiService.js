import * as adminRequest from '_api/adminRequest';
import * as getQueues from '_api/queueReques';
import * as stepRequest from '_api/StepRequest';
import * as reserveRequest from '_api/reserveRequest';

const apiUrl = process.env.REACT_APP_API_URL;

export const Step2ApiService = {
  // Get data functions
  getStep2Waiting: async () => {
    try {
      return await getQueues.getStep2Waitting();
    } catch (error) {
      console.error('Error getting step2 waiting:', error);
      return [];
    }
  },

  getStep2Processing: async () => {
    try {
      return await getQueues.getStep2Processing();
    } catch (error) {
      console.error('Error getting step2 processing:', error);
      return [];
    }
  },

  getAllStations: async () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise((resolve, reject) => {
      fetch(apiUrl + '/allstations', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          resolve(result.filter((x) => x.station_group_id === 3));
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  getStepCount: async (step_order, step_status) => {
    try {
      return await stepRequest.getStepCountByIdStatus(step_order, step_status);
    } catch (error) {
      console.error('Error getting step count:', error);
      return [];
    }
  },

  getStepId: async (steps_order, queues_id) => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise((resolve, reject) => {
      fetch(apiUrl + '/stepbyqueueid/' + steps_order + '/' + queues_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          resolve(result[0]?.step_id);
        })
        .catch((error) => {
          console.error('Error getting step id:', error);
          reject(error);
        });
    });
  },

  // Update functions
  updateStepStatus: async (step_id, statusupdate, stations_id) => {
    const newCurrentDate = await stepRequest.getCurrentDate();
    
    return new Promise((resolve, reject) => {
      if (stations_id === '') {
        reject('กรุณาเลือกหัวจ่าย');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        status: statusupdate,
        station_id: stations_id,
        updated_at: newCurrentDate
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + '/updatestepstatus/' + step_id, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result['status'] === 'ok') {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  updateMultipleStepStatus: async (updates) => {
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
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  updateStartTime: async (step_id) => {
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

      fetch(apiUrl + '/updatestarttime/' + step_id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result['status'] === 'ok') {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  updateEndTime: async (step_id) => {
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
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  // Station and contractor updates
  updateStation: async (id, status) => {
    const currentDate = await stepRequest.getCurrentDate();

    try {
      const data = {
        station_status: status,
        time_update: currentDate
      };
      return await stepRequest.putStationStatus(id, data);
    } catch (error) {
      console.error('Error updating station:', error);
      throw error;
    }
  },

  updateContractor: async (id, status) => {
    const currentDate = await stepRequest.getCurrentDate();

    try {
      const data = {
        contract_status: status,
        contract_update: currentDate
      };
      return await stepRequest.putContractorStatus(id, data);
    } catch (error) {
      console.error('Error updating contractor:', error);
      throw error;
    }
  },

  // Reserve and order functions
  getReserveById: async (id) => {
    try {
      return await stepRequest.getReserveById(id);
    } catch (error) {
      console.error('Error getting reserve:', error);
      return null;
    }
  },

  getOrderByReserveId: async (id) => {
    try {
      return await reserveRequest.getOrderByReserveId(id);
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  // Product register functions
  getAllProductRegister: async () => {
    try {
      return await adminRequest.getAllProductRegister();
    } catch (error) {
      console.error('Error getting product registers:', error);
      return [];
    }
  },

  getAllProductHistory: async () => {
    try {
      return await adminRequest.getAllProductHistory();
    } catch (error) {
      console.error('Error getting product history:', error);
      return [];
    }
  },

  getItemsRegisterOrderId: async (id) => {
    try {
      return await stepRequest.getItemsRegisterOrderId(id);
    } catch (error) {
      console.error('Error getting items register:', error);
      return [];
    }
  },

  // Item register operations
  addItemRegister: async (data) => {
    try {
      return await stepRequest.addItemRegister(data);
    } catch (error) {
      console.error('Error adding item register:', error);
      throw error;
    }
  },

  updateItemsRegister: async (id, data) => {
    try {
      return await stepRequest.putItemsRegister(id, data);
    } catch (error) {
      console.error('Error updating items register:', error);
      throw error;
    }
  },

  deleteItemsRegister: async (id) => {
    try {
      return await stepRequest.deleteItemsRegister(id);
    } catch (error) {
      console.error('Error deleting items register:', error);
      throw error;
    }
  },

  updateRegisterItems: async (id, data) => {
    try {
      return await stepRequest.putRegisterItem(id, data);
    } catch (error) {
      console.error('Error updating register items:', error);
      throw error;
    }
  },

  // Warehouse and station functions
  getAllWarehouses: async () => {
    try {
      return await adminRequest.getAllWareHouse();
    } catch (error) {
      console.error('Error getting warehouses:', error);
      return [];
    }
  },

  getStationsByWarehouse: async (id) => {
    try {
      return await adminRequest.getStationsByWareHouse(id);
    } catch (error) {
      console.error('Error getting stations:', error);
      return [];
    }
  },

  // Team functions
  getLoadingTeamByIdwh: async (warehouse_id) => {
    try {
      return await adminRequest.getLoadingTeamByIdwh(warehouse_id);
    } catch (error) {
      console.error('Error getting loading team:', error);
      return [];
    }
  },

  getLoadingTeamById: async (id) => {
    try {
      return await adminRequest.getLoadingTeamById(id);
    } catch (error) {
      console.error('Error getting loading team by id:', error);
      return null;
    }
  },

  // Contractor functions
  getAllContractors: async () => {
    try {
      return await adminRequest.getAllContractors();
    } catch (error) {
      console.error('Error getting contractors:', error);
      return [];
    }
  },

  getContractorById: async (id) => {
    try {
      return await adminRequest.getContractorById(id);
    } catch (error) {
      console.error('Error getting contractor:', error);
      return null;
    }
  },

  // Reserve team functions
  putReserveTeam: async (reserve_id, teamValue) => {
    try {
      return await adminRequest.putReserveTeam(reserve_id, teamValue);
    } catch (error) {
      console.error('Error updating reserve team:', error);
      throw error;
    }
  },

  putContractorOther: async (id, value) => {
    try {
      return await adminRequest.putContractorOther(id, value);
    } catch (error) {
      console.error('Error updating contractor other:', error);
      throw error;
    }
  },

  // Order functions
  deleteOrderId: async (orderId) => {
    try {
      return await reserveRequest.deleteOrderId(orderId);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  getReserTotalByID: async (id) => {
    try {
      return await reserveRequest.getReserTotalByID(id);
    } catch (error) {
      console.error('Error getting reserve total:', error);
      throw error;
    }
  },

  // Notification functions
  getStepToken: async (step_id) => {
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
          console.error('Error getting step token:', error);
          reject(error);
        });
    });
  },

  telegramNotify: async (queue_id, token, message) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    const link = `${protocol}//${hostname}${port ? `:${port}` : ''}` + '/queues/detail/' + queue_id;

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

    try {
      const response = await fetch(apiUrl + '/telegram-notify', requestOptions);
      return await response.text();
    } catch (error) {
      console.error('Error sending telegram notification:', error);
      throw error;
    }
  },

  // Loading teams update
  updateLoadingTeams: async (team_id, step_ids) => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        team_id: team_id,
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
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }
};

