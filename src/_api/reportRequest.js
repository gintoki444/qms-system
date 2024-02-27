// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| ข้อมูล รอเรียกคิว step1 ||============================== //
export const getOrdersProducts = async (date) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/ordersproducts?start_date=${date}&end_date=${date}`, requestOptions);
  const result = await response.json();
  console.log(result);
  return result;
};
