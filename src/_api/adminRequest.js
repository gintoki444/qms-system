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
  const response = await fetch(apiUrl + `/deletechecker/${id}`, requestOptions);

  const result = await response.text();
  return result;
};

export const getAllTeamCheckers = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allteamcheckers/`, requestOptions);

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

export const getAllTeamForklifts = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allteamforklifts/`, requestOptions);

  const result = await response.json();
  return result;
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

// ==============================|| LaborLines: (สำหรับข้อมูล สายแรงงาน) ||============================== //
export const getAllLaborLines = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/alllaborlines/', requestOptions);

  const result = await response.json();
  return result;
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
export const getLoadingTeamByAll = async () => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(apiUrl + `/loadingteamsbyall/`, requestOptions);

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching all teams:', error);
    return [];
  }

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
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(apiUrl + `/loadingteambyid/${id}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching loadingteambyid:', error);
    return [];
  }
};

export const getLoadingTeamAll = async () => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(apiUrl + `/loadingteamdetails`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching loadingteambyid:', error);
    return [];
  }
};

// ==============================|| Company contractors: (สำหรับข้อมูล บริษัทสายรายงาน) ||============================== //
export const getAllCompanyContractors = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allcontractorscompany/', requestOptions);

  const result = await response.json();
  return result;
};

export const AddCompanyContractors = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addcontractorcompany/', requestOptions);
  return await response.json();
};

export const putCompanyContractors = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatecontractorcompany/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const deleteCompanyContractors = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deletecontractorcompany/${id}`, requestOptions);

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
  try {
    const response = await fetch(apiUrl + `/contractors/${id}`, requestOptions);

    const result = await response.json();
    return result;
  } catch (e) { console.log(e) }
};

export const getContractorsById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/contractor/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const AddContractors = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addcontractor/', requestOptions);

  return await response.json();
};

export const putContractor = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatecontractor/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const deleteContractorById = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deletecontractor/${id}`, requestOptions);

  const result = await response.json();
  return result;
};
// ==============================|| Product Register: (สำหรับข้อมูล จัดการกองสินค้า) ||============================== //
export const getAllProductRegister = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allproductregister2/', requestOptions);

  const result = await response.json();
  return result;
};

export const getAllProducts = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allproducts/', requestOptions);

  const result = await response.json();
  return result;
};

export const getProductRegisterById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  // const response = await fetch(apiUrl + '/productregisterbyid/' + id, requestOptions);
  const response = await fetch(apiUrl + '/productregisterbyid2/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const getProductsById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/product/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const getProductReceiveById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/productreceivebyid/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const AddProductRegister = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addproductregister/', requestOptions);

  return await response.json();
};

export const AddProducts = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addproduct/', requestOptions);

  return await response.json();
};

export const putProductRegisterById = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updateproductregister/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const deteteProductRegister = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deleteproductregister/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const putProductById = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updateproduct/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const AddProductsReceive = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addreceiveproduct/', requestOptions);

  return await response.json();
};

export const deleteProductReceive = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deletereceiveproduct/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const deleteProducts = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deleteproduct/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const getCutOffProductById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/productcutoffbyid/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const AddCutOffProduct = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addcutoffproduct/', requestOptions);

  return await response.json();
};

export const deleteCutOffProduct = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deletecutoffproduct/${id}`, requestOptions);

  const result = await response.json();
  return result;
};

export const getOrdersProductsByIdRegister = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  // const response = await fetch(apiUrl + '/ordersproductsbyregisterid?product_register_id=' + id, requestOptions);
  const response = await fetch(apiUrl + '/ordersproductsbyregisterid2?product_register_id=' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const getAllProductHistory = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allproductregisterzero/', requestOptions);

  const result = await response.json();
  return result;
};

export const AddAuditLogs = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addauditlogs/', requestOptions);
  const result = await response.text();
  console.log('result ', result);

  return result;
};
