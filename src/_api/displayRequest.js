// Link api url
const apiUrl = process.env.REACT_APP_API_URL;
// const apiUrlWWS = process.env.REACT_APP_API_URL_WWS;
const apiUrlWWS2 = process.env.REACT_APP_API_URL_WWS2;

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

// ==============================|| (สำหรับข้อความแสดงหน้าจอสายแรงงาน) ||============================== //

export const getContractorTV = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const wssurl = apiUrlWWS2;
    const ws = new WebSocket(wssurl);

    ws.onopen = () => {
      const requestMessage = JSON.stringify({
        type: 'getContractors',
        payload: {
          start_date: startDate,
          end_date: endDate
        }
      });
      // console.log('Sending WebSocket request:', requestMessage);
      ws.send(requestMessage);
    };

    ws.onmessage = (event) => {
      // console.log('Received message from WebSocket:', event.data);
      try {
        const result = JSON.parse(event.data);
        // console.log('Parsed WebSocket result:', result);
        resolve(result);
      } catch (error) {
        console.error('Error parsing WebSocket response:', error.message);
        reject(`Error parsing response: ${error.message}`);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket encountered an error:', error.message);
      reject(`WebSocket error: ${error.message}`);
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  });
};
