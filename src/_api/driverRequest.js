// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| Drivers: (ข้อมูลคนรถ) ||============================== //
export const getAllDriver = async (userID) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/alldrivers/` + userID, requestOptions);

  const result = await response.json();
  return result;
};


// ==============================|| Cars: (เพิ่มข้อมูลรถ) ||============================== //
export const AddDriver = async (data) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const raw = JSON.stringify(data);
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    const response = await fetch(apiUrl + '/adddriver', requestOptions);
  
    return await response.json();
  };