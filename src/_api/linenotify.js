// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

export const sendLinenotify = async (message) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    message: message
  });
  // const raw = {
  //   message: message
  // };

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/line-notify', requestOptions);
  return response.text();
};
