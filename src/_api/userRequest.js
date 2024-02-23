// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

export const getAlluser = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/allusers', requestOptions);

  const result = await response.json();
  return result;
};

export const getAlluserId = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/user/' + id, requestOptions);

  const result = await response.json();
  return result.user;
};

export const getRoleUsers = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/roles', requestOptions);

  const result = await response.json();
  return result;
};

export const putUsers = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  console.log(id);
  console.log(data);

  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/updateuser/' + id, requestOptions);

  const result = await response.json();
  return result;
};
