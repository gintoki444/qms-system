// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
// const apiUrl = process.env.REACT_APP_API_URL_WWS;

// ==============================|| รายงาน getCompanyCounts ||============================== //
export const getCompanyCounts = async (startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/queues/companycount/?startDate=' + startDate + '&endDate=' + endDate, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงาน getCompanyCounts ||============================== //
export const getQueuesSummary = async (startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/queues/summary/?startDate=' + startDate + '&endDate=' + endDate, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงาน getQueuesSummaryTime ||============================== //
export const getQueuesSummaryTime = async (startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/queues/summarytime?start_date=' + startDate + '&end_date=' + endDate, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงาน getQueuesSummaryTime step2 ||============================== //
export const getQueuesSummaryTimeStep2 = async (startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/queues/summarytimestep2?start_date=' + startDate + '&end_date=' + endDate, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงาน progress truck Loading ||============================== //
export const fetchProgressTruckLoading = async (date) => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/progress-truck-loading?date=${date}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in fetchAvgLoadingTime:', error);
    throw error;
  }
};

// ==============================|| รายงาน Average Loading Time by Company ||============================== //
export const fetchAvgLoadingTime = async (date) => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/avg-loading-time-company?date=${date}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in fetchAvgLoadingTime:', error);
    throw error;
  }
};

// ==============================|| รายงาน Loading Volume By Hour ||============================== //
export const fetchLoadingVolumeByHour = async (date) => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/loading-volume-by-hour?date=${date}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in fetchAvgLoadingTime:', error);
    throw error;
  }
};

export const fetchDeliveryLoadingByHour = async (date) => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/delivery-loading-by-hour?date=${date}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in fetchAvgLoadingTime:', error);
    throw error;
  }
};

// ==============================|| รายงาน Top Items ||============================== //
export const fetchTopItems = async (date) => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/top-items-by-company?date=${date}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in fetchAvgLoadingTime:', error);
    throw error;
  }
};

// ==============================|| รายงาน Average Loading Time ||============================== //
export const fetchAvgLoadingTimeStats = async (date) => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/loading-volume-by-hour?date=${date}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in fetchAvgLoadingTime:', error);
    throw error;
  }
};

// ==============================|| รายงาน progress truck Loading ||============================== //
export const fetchLoadingVolumeCompany = async (date) => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/loading-volume-company?date=${date}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in fetchAvgLoadingTime:', error);
    throw error;
  }
};

// ==============================|| รายงาน progress truck Loading ||============================== //
export const fetchLoadingVolumeWarehouse = async (date) => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(`${apiUrl}/loading-volume-warehouse?date=${date}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in fetchAvgLoadingTime:', error);
    throw error;
  }
};
