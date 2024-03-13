// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| Reserve: (สำหรับข้อมูล ทีมรับสินค้า และ โกดัง) ||============================== //
export const putReserveTeam = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatereserveteam/' + id, requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| Warehouse: (สำหรับข้อมูล โกดัง) ||============================== //
export const getStationsByWareHouse = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/stationsbywarehouse/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const getAllWareHouse = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allwarehouses/', requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| Warehouse Manages: (สำหรับข้อมูล หัวหน้าโกดัง) ||============================== //
export const getAllWareHouseManager = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allwarehousemanagers/', requestOptions);

  const result = await response.json();
  return result;
};

export const getManagerWareHouse = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/warehousemanager/${id}`, requestOptions);

  const result = await response.json();
  return result.warehousemanager;
};

export const putManagerWareHouse = async (id, data) => {
  console.log(data)

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/warehousemanager/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const getTeamManager = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/teammanager/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const AddWareHouse = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addwarehousemanager/', requestOptions);

  return await response.text();
};

export const addTeamManager = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addteammanager/', requestOptions);

  return await response.text();
};

// ==============================|| Warehouse Manages: (สำหรับข้อมูล พนักงานจ่ายสินค้า) ||============================== //
export const getAllCheckers = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allcheckers/', requestOptions);

  const result = await response.json();
  return result;
};

export const getTeamChecker = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/teamchecker/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const addTeamChecker = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addteamchecker/', requestOptions);

  return await response.text();
};

// ==============================|| Warehouse Manages: (สำหรับข้อมูล โฟร์คลิฟท์) ||============================== //
export const getAllForklifts = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allforklifts/', requestOptions);

  const result = await response.json();
  return result;
};

export const getTeamForklift = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/teamforklift/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const addTeamForklift = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addteamforklift/', requestOptions);

  return await response.text();
};

// ==============================|| LoadingTeam: (สำหรับข้อมูล ทีมโหลดสินค้า) ||============================== //
export const getAllLoadingTeam = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allloadingteams/`, requestOptions);

  const result = await response.json();
  return result;
};

export const getLoadingTeamById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/loadingteamsbywh/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| Contractors: (สำหรับข้อมูล สายรายงาน) ||============================== //
export const getAllContractors = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allcontractors/', requestOptions);

  const result = await response.json();
  return result;
};

export const getContractorById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/contractors/${id}`, requestOptions);

  const result = await response.json();
  return result;
};
