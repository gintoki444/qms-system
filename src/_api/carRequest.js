// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| Cars: (เพิ่มข้อมูลรถ) ||============================== //
export const getAllCars = async (userID) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allcars/` + userID, requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| Cars: (เพิ่มข้อมูลรถ) ||============================== //
export const AddCar = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/addcar', requestOptions);

  return await response.json();
};

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

// ==============================|| Cars: (ข้อมูลจังหวัด รถ) ||============================== //
export const getAllProvinces = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/allprovinces/', requestOptions);

  const result = await response.json();
  return result;
};
