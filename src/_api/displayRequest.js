// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| (สำหรับข้อความแสดงหน้าจอ คิว) ||============================== //

export const getTextDisplay = async () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const response = await fetch(apiUrl + '/systemconfig/', requestOptions);
  
    const result = await response.json();
    return result;
  };

export const putTextDisplay = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatesystemconfig/' + id, requestOptions);

  const result = await response.json();
  return result;
};
