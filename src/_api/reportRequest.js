// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

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
  console.log(result);
  return result;
};
