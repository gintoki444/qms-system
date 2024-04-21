// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| ข้อมูล Reserve ทั้งหมด ||============================== //
export const getAllReserveByUrl = async (url) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + url, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Product Company ||============================== //
export const getAllproductCompanys = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allproductcompany`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Product Brand ด้วย id ||============================== //
export const getProductBrandById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/productbrand/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Order ||============================== //
export const getOrderByReserveId = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/orders/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

export const getProductByIdComAndBrandId = async (idcom, idbrand) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/productscompany?product_company_id=${idcom}&product_brand_id=${idbrand}`, requestOptions);
  const result = await response.json();
  return result;
};

export const deleteOrderId = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deleteorderitem/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| Update การจองคิว ||============================== //
export const putReserById = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + `/updatereserve/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| Update การจองคิว ||============================== //
export const deleteReserById = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deletereserve/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูลการจองคิว By url ||============================== //
export const getReserByUrl = async (url) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `${url}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูลการจองคิว ||============================== //
export const getReserDetailID = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/reserve/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูลคิวด้วย Id reserve ||============================== //
export const getQueuesByIdReserve = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/queuebyreserveid/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูลการจองคิว ||============================== //
export const putReserveStatus = async (id, data) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + `/updatereservestatus/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

export const getReserTotalByID = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/updatereservetotal/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

export const putQueueRemainByID = async (id, data) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + `/updatequeueremain/${id}`, requestOptions);
  const result = await response.json();
  return result;
};
