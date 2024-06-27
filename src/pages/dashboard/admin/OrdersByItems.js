import React, {
    useState,
    useEffect
    // , useRef
} from 'react';

import * as reportRequest from '_api/reportRequest';

// material-ui
import {
    Stack,
    Button,
    CircularProgress,
    Typography
} from '@mui/material';

function OrdersByItems({ productId, productReId, dates, onClick }) {
    useEffect(() => {
        if (onClick === true) {
            getOrderSumQty();
        }
    }, [productId, productReId, dates, onClick]);

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    // const fetchData = async () => {
    //     getOrderSumQty();
    // };

    const getOrderSumQty = () => {
        setLoading(true);

        reportRequest
            .getOrdersProductItems(productId, productReId, dates).then((resporne) => {
                setItems(resporne);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    };


    const [onclickShow, setOnClickShow] = useState(false);
    const handleClickShow = () => {
        if (onclickShow == false) {
            setOnClickShow(true);
            getOrderSumQty();
        } else {
            setOnClickShow(false);
        }
    }
    return (
        <>
            <Stack flexDirection="row" alignItems="center" >
                {onClick !== true &&
                    <div style={{ marginRight: '10px' }}>
                        <Button color={!onclickShow ? 'info' : 'error'} variant='outlined' onClick={handleClickShow}>
                            {!onclickShow ? 'รายละเอียด' : 'ยกเลิก'}
                        </Button>
                    </div>
                }
                { }
                {(onclickShow || onClick === true) && (
                    <>
                        {!loading ? (
                            <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px', width: '100%' }}>
                                <div>
                                    <table border={'0'}>
                                        <thead></thead>
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <strong>คิว</strong>
                                                </td>
                                                {items.map((item, index) => (
                                                    <td key={index} align="center">
                                                        {item.token}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <strong>ตัน</strong>
                                                </td>
                                                {items.map((item, index) => (
                                                    <td key={index} align="center">
                                                        {parseFloat((item.total_products * 1).toFixed(3))}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <>
                                <CircularProgress />
                                <Typography variant="body1">Loading....</Typography>
                            </>
                        )}
                    </>
                )}
            </Stack>
        </>
    )
}

export default OrdersByItems