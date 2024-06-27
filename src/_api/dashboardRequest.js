// Link api url
const apiUrl = process.env.REACT_APP_API_URL;

// ==============================|| รายงาน getCompanyCounts ||============================== //
export const getCompanyCounts = async (startDate, endDate) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const response = await fetch(apiUrl + '/queues/companycount/?startDate=' + startDate + '&endDate=' + endDate, requestOptions);
    const result = await response.json();
    return result;
};

// ==============================|| รายงาน getCompanyCounts ||============================== //
export const getQueuesSummary = async (startDate, endDate) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const response = await fetch(apiUrl + '/queues/summary/?startDate=' + startDate + '&endDate=' + endDate, requestOptions);
    const result = await response.json();
    return result;
};

// ==============================|| รายงาน getQueuesSummaryTime ||============================== //
export const getQueuesSummaryTime = async (startDate, endDate) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const response = await fetch(apiUrl + '/queues/summarytime?start_date=' + startDate + '&end_date=' + endDate, requestOptions);
    const result = await response.json();
    return result;
};

// ==============================|| รายงาน getQueuesSummaryTime step2 ||============================== //
export const getQueuesSummaryTimeStep2 = async (startDate, endDate) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const response = await fetch(apiUrl + '/queues/summarytimestep2?start_date=' + startDate + '&end_date=' + endDate, requestOptions);
    const result = await response.json();
    return result;
};