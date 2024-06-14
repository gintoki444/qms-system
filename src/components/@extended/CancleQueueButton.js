import { useState, useEffect } from 'react';
import {
    Tooltip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
} from '@mui/material';
import { WarningOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';

import * as reserveRequest from '_api/reserveRequest';
import * as stepRequest from '_api/StepRequest';
import * as queueReques from '_api/queueReques';

import { useSnackbar } from 'notistack';

function CancleQueueButton({ reserve_id, status, handleReload }) {

    useEffect(() => {

    }, [handleReload])

    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [notifytext, setNotifyText] = useState('');

    const handleClickOpen = () => {
        setNotifyText('ต้องการยกเลิกคิวนี้')
        setOpen(true);
    };
    const handleClose = (flag) => {
        if (flag === 1) {
            reserveRequest.getQueuesByIdReserve(reserve_id).then((response) => {
                const queueData = response.find((x) => x.reserve_id === reserve_id);
                if (response.length > 0 && queueData.step2_status !== "completed" && queueData.step2_status !== "processing") {
                    // if (queueData.queue_id === 99999) {
                    getQueueDetail(queueData.queue_id);
                    // }
                } else {
                    enqueueSnackbar('ไม่สามารถยกเลิกคิวนี้ได้! : เนื่องจากมีการรับสินค้าเรียบร้อย', { variant: 'error' });
                }
            });
            setOpen(false);
        } else if (flag === 0) {
            setOpen(false);
        }
    };

    const getQueueDetail = async (queueId) => {
        try {
            var currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const statusData = {
                status: 'cancle',
                station_id: 27,
                updated_at: currentDate
            };
            await queueReques.getAllStepById(queueId).then((response) => {
                response.map((x) => {
                    stepRequest.updateStatusStep(x.step_id, statusData);
                })
                cancleReserve(reserve_id);
            })
        } catch (error) {
            console.log(error)
        }
    }

    const cancleReserve = (reserve_id) => {
        try {
            const statusData = {
                status: 'cancle'
            };

            reserveRequest.putReserveStatus(reserve_id, statusData).then(() => {
                enqueueSnackbar('ยกเลิกคิวนี้สำเร็จ !', { variant: 'success' });
                handleReload(true)
            })
        } catch (error) {
            enqueueSnackbar('ยกเลิกคิวเกิดข้อผิดพลาด', { variant: 'warning' });
            console.log(error)
        }
    }
    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">
                    <Typography variant="h5">{'แจ้งเตือน'}</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{notifytext}</DialogContentText>
                </DialogContent>
                <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
                    <>
                        <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
                            ยกเลิก
                        </Button>
                        <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
                            ยืนยัน
                        </Button>
                    </>
                </DialogActions>
            </Dialog>

            <Tooltip title="ยกเลิก">
                <span>
                    <Button
                        variant="contained"
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        size="medium"
                        color="warning"
                        disabled={status === 'cancle' || status === 'waiting'}
                        // onClick={() => deleteDrivers(row.reserve_id)}
                        onClick={() => handleClickOpen(reserve_id, 'cancle')}
                    >
                        <WarningOutlined />
                    </Button>
                </span>
            </Tooltip>
        </>
    )
}

export default CancleQueueButton