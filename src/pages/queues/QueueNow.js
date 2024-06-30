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
            // const currentDate = moment(new Date()).format('YYYY-MM-DD');
            // queueRequest.getQueueNowByComId(currentDate, currentDate, productComId).then((result) => {
            //     console.log(result)
            //     setQueueData(result);
            // });
            stepRequest.getStep2Processing().then((response) => {
                const data = response.filter(queue => queue.product_company_id === productComId);
                const lastdata = data.length > 0 ? data[data.length - 1] : null;

                // console.log('lastdata :', lastdata);
                setQueueData(lastdata);
            })
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Typography variant="h4">คิวปัจจุบัน : {' '}
            <span style={{ color: 'red' }}>{queueData ? queueData.token : '-'}</span>
            {/* <span style={{ color: 'red' }}>{queueData ? queueData.product_company_code + queueData.queue_count_company_code : '-'}</span> */}
        </Typography>
    )
}

export default QueueNow;