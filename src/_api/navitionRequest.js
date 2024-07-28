const apiUrl = process.env.REACT_APP_API_URL;
const proxyUrl = 'https://asia-southeast1-icp-qms-api.cloudfunctions.net/apia2/navproxy';

// ==============================|| Reserve: (สำหรับข้อมูล ทีมรับสินค้า และ โกดัง) ||============================== //
export const getItemFers = async () => {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', 'Basic bmRhZG1pbjpOZXdkYXduOTk5');

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(proxyUrl + "/DynamicsNAV100/ODataV4/Company('ICP%20International')/OdataItemInter", requestOptions);
  const result = await response.json();
  return result.value;
};

export const getProductRegisID = async (description) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ description: description });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/itemsfilter', requestOptions);
  const result = await response.json();
  console.log(result);
  if (!result.error) {
    return result[0]; // Return product_id only
  }
};
