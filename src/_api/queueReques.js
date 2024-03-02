// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| ข้อมูล รอเรียกคิว step1 ||============================== //
export const getQueueDetailID = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/queue/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล รอเรียกคิว step1 ||============================== //
export const getAllqueueByDate = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allqueuesbyqueuedate?queue_date=${date}`, requestOptions);
  const result = await response.json();
  console.log(result)
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
