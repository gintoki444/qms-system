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
// import moment from 'moment-timezone';

import * as reserveRequest from '_api/reserveRequest';
import * as adminRequest from '_api/adminRequest';
import * as functionAddLogs from 'components/Function/AddLog';
// import * as queueReques from '_api/queueReques';

// import { useSnackbar } from 'notistack';

function CancleTeamStation({ reserveId, handleReload, reserveData }) {
    const userId = localStorage.getItem('user_id');
    useEffect(() => {
    }, [handleReload])

    // const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [notifytext, setNotifyText] = useState('');

    const handleClickOpen = () => {
        setNotifyText('ต้องการยกเลิกหัวจ่ายนี้')
        setOpen(true);
    };

    // =============== บันทึกข้อมูล ===============//
    const updateTeamLoading = (values) => {
        try {
            adminRequest.putReserveTeam(reserveId, values);
        } catch (error) {
            console.log(error);
        }
    };
    const updateTeamData = (values) => {
        try {
            adminRequest.putReserveTeamData(reserveId, values).then(() => handleReload(true));
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = (flag) => {
        if (flag === 1) {

            reserveData.warehouse_id = 1;
            reserveData.reserve_station_id = 1;
            reserveData.team_id = null;
            reserveData.contractor_id = null;
            reserveData.labor_line_id = null;
            reserveData.team_data = null;
            reserveData.description = reserveData.r_description;
            const teamValue = {
                team_id: null,
                contractor_id: null,
                labor_line_id: null
            };
            // if (reserveId === 9999) {
            reserveRequest.putReserById(reserveId, reserveData).then((result) => {
                if (result.status === 'ok') {
                    const data = {
                        audit_user_id: userId,
                        audit_action: "D",
                        audit_system_id: reserveId,
                        audit_system: "step0",
                        audit_screen: "ข้อมูลทีมขึ้นสินค้า",
                        audit_description: "ยกเลิกทีมขึ้นสินค้า"
                    }
                    AddAuditLogs(data);
                    updateTeamLoading(teamValue);
                    updateTeamData([]);
                } else {
                    alert(result['message']['sqlMessage']);
                }
            }).then(() => {

                setOpen(false);
            }).catch((error) => {
                console.log(error);
            });
            // }

        } else if (flag === 0) {
            setOpen(false);
        }
    };

    const AddAuditLogs = async (data) => {
        await functionAddLogs.AddAuditLog(data);
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
                        disabled={reserveData.team_id === null}
                        // onClick={() => deleteDrivers(row.reserve_id)}
                        onClick={() => handleClickOpen()}
                    >
                        <WarningOutlined />
                    </Button>
                </span>
            </Tooltip>
        </>
    )
}

export default CancleTeamStation