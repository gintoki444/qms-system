// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| Page Permissions ||============================== //
export const getPagesPermissionByRole = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/page_permissions_role/' + id, requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| Group Page Permissions ||============================== //
export const getAllGroupPagesPermission = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/pagegroups/', requestOptions);

  const result = await response.json();
  return result;
};
