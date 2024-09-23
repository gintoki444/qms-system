// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| ข้อมูล All Product Company   ||============================== //
export const getAllStations = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allstations`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล All Product Company   ||============================== //
export const getAllProductCompany = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allproductcompany`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Step 0   ||============================== //
export const getAllStep0 = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/step0reserves`, requestOptions);
  const result = await response.json();
  return result;
};

export const getAllStep0ByDate = async (startDate, endDate) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/step0reservesbydate?pickup_date1=${startDate}&pickup_date2=${endDate}`, requestOptions);
  const result = await response.json();
  return result;
};

// แก้ไขสถานะ หัวจ่าย
export const putStationStatus = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatestationstatus/' + id, requestOptions);

  const result = await response.json();
  return result;
};
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

// แก้ไขสถานะ สายแรงงาน
export const putContractorStatus = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updatecontractstatus/' + id, requestOptions);

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

export const getLoadingTeamById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/loadingteambyid/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Reserve  ||============================== //
export const getReserveById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/reserve/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Reserve  ||============================== //
export const getProductRegister = async (product_company_id, product_brand_id, product_id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(
    apiUrl + `/productregister?product_company_id=${product_company_id}&product_brand_id=${product_brand_id}&product_id=${product_id}`,
    requestOptions
  );
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Step Count  ||============================== //
export const getStepCountByIdStatus = async (id, status) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/stepcount/${id}/${status}`, requestOptions);
  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Step 2  ||============================== //
// แสดงข้อมูล กองสินค้าทั้งหมด
export const getAllItemsRegister = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/allitemsregister`, requestOptions);
  const result = await response.json();
  return result;
};

// แสดงข้อมูล กองสินค้า ด้วย ID
export const getAllItemsRegisterById = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/itemsregister/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// แสดงข้อมูล กองสินค้า ด้วย ID
export const getItemsRegisterOrderId = async (id) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/itemsregisterbyorder/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// เพิ่มข้อมูล กองสินค้า
export const addItemRegister = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/additemsregister/', requestOptions);
  return await response.json();
};

// ลบข้อมูล กองสินค้า
export const deleteItemsRegister = async (id) => {
  const requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + `/deleteitemsregister/${id}`, requestOptions);
  const result = await response.json();
  return result;
};

// แก้ไขข้อมูล กองสินค้า
export const putItemsRegister = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updateitemsregister/' + id, requestOptions);

  const result = await response.json();
  return result;
};

export const putRegisterItem = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  const response = await fetch(apiUrl + '/updateregisteritem/' + id, requestOptions);

  const result = await response.json();
  return result;
};

// ==============================|| ข้อมูล Step 3  ||============================== //

// แก้ไขน้ำหนักชั่งเบา
export const updateStatusStep = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/updatestepstatus/' + id, requestOptions);
  return await response.json();
};

// เพิ่มข้อมูล Recall
export const addRecallProcess = async (data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/updaterecallprocess/', requestOptions);
  return await response.json();
};

// แก้ไขน้ำหนักชั่งเบา
export const updateWeight1 = async (id, data) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(apiUrl + '/updateweight1/' + id, requestOptions);
  return await response.json();
};

// แสดงข้อมูล กองสินค้าทั้งหมด
export const getCurrentDate = () => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(apiUrl + '/current-date', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        resolve(result.currentDate);
      })
      .catch((error) => {
        console.error(error);
        reject(error); // ส่งคืนเมื่อเกิดข้อผิดพลาดในการเรียก API
      });
  });
};
