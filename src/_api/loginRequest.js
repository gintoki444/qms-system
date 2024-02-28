// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

export const authUser = async (access_token) => {
  // const replaceStr = access_token.replaceAll('"', '');
  const replaceStr = access_token;
  const tokens = `Bearer ${replaceStr}`;

  const response = await fetch(apiUrl + '/authen', {
    method: 'post',
    maxBodyLength: Infinity,
    headers: {
      Authorization: tokens
    }
  });

  let result = await response.json();
  return result;
};
