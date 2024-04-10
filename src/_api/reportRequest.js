// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| รายงาน ordersproductssum ||============================== //
export const getOrdersProductSummary = async (startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/ordersproducts2?start_date=' + startDate + '&end_date=' + endDate, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงาน OrderTable ||============================== //
export const getOrdersProduct = async (startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/ordersproducts?start_date=' + startDate + '&end_date=' + endDate, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงานจำนวน QTY ||============================== //
export const getDataChart = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/queuechart?start_date=' + date + '&end_date=' + date, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงานจำนวน QTY ||============================== //
export const getOrderSumQty = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/ordersproducts?start_date=' + date + '&end_date=' + date, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงานจำนวนคิวค่าเฉลี่ยประจำวัน ||============================== //
export const getQueuesAverageTime = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/queues/queuesaveragetime?start_date=' + date + '&end_date=' + date, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงานจำนวนคิวประจำวัน ||============================== //
export const getQueuesCounts = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/queues/count?start_date=' + date + '&end_date=' + date, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| รายงานจำนวนคิวประจำวันที่สำเร็จ||============================== //
export const getQueuesCountCompleted = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/queues/countcompleted?start_date=' + date + '&end_date=' + date, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล รอเรียกคิว step1 ||============================== //
export const getOrdersProducts = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/ordersproducts?start_date=${date}&end_date=${date}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| Report Step Completed ||============================== //
export const getStepCompleted = async (id, startdate, enddate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/stepcompleted/${id}?s_end_time=${startdate}&e_end_time=${enddate}`, requestOptions);
  const result = await response.json();
  return result;
};

export const getAvgStepCompleted = async (id, startdate, enddate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/stepcompletedavg/${id}?s_end_time=${startdate}&e_end_time=${enddate}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| Report Steps Recall ||============================== //
export const getStepsRecall = async (startdate, enddate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allstepsrecall?start_date=${startdate}&end_date=${enddate}`, requestOptions);
  const result = await response.json();
  return result;
};
