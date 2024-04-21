// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| Drivers: (ข้อมูลคนรถ) ||============================== //
export const getAllContractorsCompany = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allcontractorscompany/`, requestOptions);

  const result = await response.json();
  return result;
};
