// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| แสดงข้อมูล Token และ ID ของคิว ||============================== //
export const getQueueTokenByIdCom = async (id, startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(
    apiUrl + `/queues/countcompanycode?start_date=${startDate}&end_date=${endDate}&company_id=${id}`,
    requestOptions
  );
  const result = await response.json();
  return result;
};
// ==============================|| ข้อมูลคิว แสดงข้อมูลคิวด้วย ID ||============================== //
export const getQueueDetailID = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/queue/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

export const getQueueNowByComId = async (stateDate, endDate, id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  // console.log(stateDate);
  // console.log(endDate);
  const response = await fetch(
    apiUrl + `/queues/countcompanycode?start_date=${stateDate}&end_date=${endDate}&company_id=${id}`,
    requestOptions
  );
  // const response = await fetch(apiUrl + `/queues/countcompanycode?start_date=2024-06-29&end_date=2024-06-29&company_id=${id}`, requestOptions);
  const result = await response.json();
  return result;
};
// ==============================|| ข้อมูลทุกสเตป ด้วย ID คิว ||============================== //
export const getAllStepById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/stepbyqueueidonly/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล รายการคิว ตามวันที่ ||============================== //
export const getAllqueueByDate = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allqueuesbyqueuedate?queue_date=${date}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล รายการคิว ทั้งหมด ||============================== //
export const getAllqueueByDateV2 = async (startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allqueuesbyqueuedate2?queue_date1=${startDate}&queue_date2=${endDate}`, requestOptions);
  const result = await response.json();
  return result;
};

export const getAllqueueUserByDate = async (id, startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allqueuesbyuserid?user_id=${id}&queue_date1=${startDate}&queue_date2=${endDate}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล รอเรียกคิว step1 ||============================== //
export const getStep1Waitting = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/step1waiting/', requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล กำลังรับบริการ step1 ||============================== //
export const getStep1Processing = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/step1processing/', requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล รอเรียกคิว step2 ||============================== //
export const getStep2Waitting = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/step2waiting/', requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล กำลังรับบริการ step2 ||============================== //
export const getStep2Processing = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/step2processing/', requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล รอเรียกคิว step3 ||============================== //
export const getStep3Waitting = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/step3waiting/', requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล กำลังรับบริการ step3 ||============================== //
export const getStep3Processing = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/step3processing/', requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล รอเรียกคิว step4 ||============================== //
export const getStep4Waitting = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/step4waiting/', requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล กำลังรับบริการ step4 ||============================== //
export const getStep4Processing = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/step4processing/', requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Step By Queue Id   ||============================== //
export const getStepByQueueId = async (number, id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/stepbyqueueid/${number}/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Queue Count   ||============================== //
export const getQueueCount = async (id, status) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/queuecount/${id}/${status}`, requestOptions);
  const result = await response.json();
  return result;
};
export const getStepsByQueueId = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/stepbyqueueidonly/${id}`, requestOptions);
  const result = await response.json();
  return result;
};
// export const getStepsByQueueId = async (queueId) => {
//   try {
//     const response = await fetch(`${apiUrl}/stepbyqueueidonly/${queueId}`);
//     const data = await response.json();
//     if (data.status === 'ok') {
//       return data.data;
//     } else {
//       throw new Error('Failed to fetch steps');
//     }
//   } catch (error) {
//     console.error(`Error fetching steps for queue ${queueId}:`, error);
//     return [];
//   }
// };
