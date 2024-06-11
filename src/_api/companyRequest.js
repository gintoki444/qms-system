// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| Company: (เพิ่มข้อมูลร้านค้า/บริษัท) ||============================== //
export const AddCompany = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addcompany', requestOptions);

  return await response.json();
};

// ==============================|| ข้อมูล ร้านค้า/บริษัท By userID ||============================== //
export const getAllCompanyByuserId = async (userId) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allcompany/' + userId, requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| แก้ไขข้อมูล ร้านค้า/บริษัท ||============================== //
export const updateCompany = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/updatecompany/' + id, requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล ร้านค้า/บริษัท By ID ||============================== //
export const getAllCompanyById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/company/' + id, requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล ร้านค้า/บริษัท By userID ||============================== //
export const deleteCompany = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/deletecompany/' + id, requestOptions);

  const result = await response.json();
  return result;
};
