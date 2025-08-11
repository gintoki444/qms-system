import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material/index';
import * as stepRequest from '_api/queueReques';
// import * as queueRequest from '_api/queueReques'

// import moment from 'moment';

function QueueNow({ productComId }) {
  const [queueData, setQueueData] = useState(null);
  useEffect(() => {
    if (productComId) {
      getQueueNows();
    }
  }, [productComId]);

  const getQueueNows = () => {
    try {
      stepRequest.getStep2Processing().then((response) => {
        const data = response.filter((queue) => queue.product_company_id === productComId);
        const lastdata = data.length > 0 ? data[data.length - 1] : null;

        setQueueData(lastdata);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
      {queueData ? queueData.token : '-'}
    </Typography>
  );
}

export default QueueNow;
