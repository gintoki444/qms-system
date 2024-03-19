// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| Cars: (ข้อมูลประเภทรถ) ||============================== //
export const getAllCarType = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allcarstype/', requestOptions);

  const result = await response.json();
  return result;
};
