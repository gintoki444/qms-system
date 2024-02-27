// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

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
