// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| ข้อมูล Checkers   ||============================== //
export const getAllCheckers = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allcheckers`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Contractors  ||============================== //
export const getAllContractors = async () => {
  const requestOptions = {
    method: 'GET', 
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allcontractors`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Reportlines  ||============================== //
export const getAllReportlines = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allreportlines`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Reportlines  ||============================== //
export const getAllTeamLoading = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allloadingteams`, requestOptions);
  const result = await response.json();
  return result;
};
