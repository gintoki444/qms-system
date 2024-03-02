// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

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
  