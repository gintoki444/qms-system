import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material/index';
import * as stepRequest from '_api/queueReques';

function QueueNow({ productComId }) {

    const [queueData, setQueueData] = useState({});
    useEffect(() => {
        if (productComId) {
            getStep2();
        }
    }, [productComId]);

    const getStep2 = () => {
        try {
            stepRequest.getStep2Processing().then((response) => {
                const data = response.filter(queue => queue.product_company_id === productComId);
                const lastdata = data.length > 0 ? data[data.length - 1] : null;

                console.log('lastdata :', lastdata);
                setQueueData(lastdata);
            })
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Typography variant="h4">คิวปัจจุบัน : {' '}
            <span style={{ color: 'red' }}>{queueData ? queueData.token : '-'}</span>
        </Typography>
    )
}

export default QueueNow;