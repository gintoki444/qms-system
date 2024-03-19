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

export const putReserveTeamData = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatereservedata/' + id, requestOptions);

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

export const getAllManager = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allmanagers/', requestOptions);

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

export const putTeamManager = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updateteammanager/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const putManagerWareHouse = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatewarehousemanager/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const deleteManagerWareHouse = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deletewarehousemanager/${id}`, requestOptions);

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

// ==============================|| Checkers : (สำหรับข้อมูล พนักงานจ่ายสินค้า) ||============================== //
export const getAllCheckers = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allcheckers/', requestOptions);

  const result = await response.json();
  return result;
};

export const getCheckerById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/checker/${id}`, requestOptions);

  const result = await response.json();
  return result.checker;
};

export const addChecker = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addchecker/', requestOptions);

  return await response.text();
};

export const putChecker = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatechecker/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const deleteChecker = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deleteteamchecker/${id}`, requestOptions);

  const result = await response.text();
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

export const deleteTeamChecker = async (id) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/deleteteamchecker/' + id, requestOptions);
  return await response.text();
};

// ==============================|| Forklifts: (สำหรับข้อมูล โฟร์คลิฟท์) ||============================== //
export const getAllForklifts = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allforklifts/', requestOptions);

  const result = await response.json();
  return result;
};

export const getForkliftById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/forklift/${id}`, requestOptions);

  const result = await response.json();
  return result.forklift;
};

export const addForklifts = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);
  console.log(data);
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addforklift/', requestOptions);

  return await response.text();
};

export const addTeamForklifts = async (data) => {
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

export const deleteTeamForklift = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deleteteamforklift/${id}`, requestOptions);

  const result = await response.text();
  return result;
};

export const putForklifts = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updateforklift/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const deleteForklifts = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deleteforklift/${id}`, requestOptions);

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
export const getAllLoadingTeamByStation = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/loadingteamsbystation/`, requestOptions);

  const result = await response.json();
  return result;
};

export const getLoadingTeamByIdwh = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/loadingteamsbywh/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const getLoadingTeamById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/loadingteambyid/${id}`, requestOptions);
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

// ==============================|| Product Register: (สำหรับข้อมูล จัดการกองสินค้า) ||============================== //
export const getAllProductRegister = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allproductregister/', requestOptions);

  const result = await response.json();
  return result;
};
