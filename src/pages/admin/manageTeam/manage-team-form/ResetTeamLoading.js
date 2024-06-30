import React, { useState } from 'react';
import {
    Button,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Backdrop,
    CircularProgress
} from '@mui/material';
import * as adminRequest from '_api/adminRequest';

import { UndoOutlined } from '@ant-design/icons';
function ResetTeamLoading({ dataList, handleClickReset }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const deleteTeamChecker = async (checkers) => {
        try {
            await Promise.all(checkers.map((tcx) => {
                adminRequest.deleteTeamChecker(tcx.team_checker_id).then((response) => {
                    console.log('deleteTeamChecker: ', response);
                });
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTeamForklift = async (forklifts) => {
        try {
            await Promise.all(forklifts.map((tfx) => {
                adminRequest.deleteTeamForklift(tfx.team_forklift_id).then((response) => {
                    console.log('deleteTeamForklift: ', response);
                });
            }));

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };


    const [resetData, setResetData] = useState({});
    const [textnotify, setText] = useState('');
    const handleClickOpen = (teamData) => {
        setResetData(teamData);
        setText('รีเซต :' + teamData.team_name);
        setOpen(true);
    };

    const handleClose = async (flag) => {
        if (flag === 1) {
            setLoading(true);
            setOpen(false);
            console.log('resetData :', resetData)

            if (resetData.team_checkers.length > 0) {
                await deleteTeamChecker(resetData.team_checkers);
            }

            if (resetData.team_forklifts.length > 0) {
                await deleteTeamForklift(resetData.team_forklifts);
            }
            await handleClickReset(true);
            setOpen(false);
        } else if (flag === 0) {
            setOpen(false);
        }
    };

    // const handleClickReset = (teamData) => {
    //     console.log('handleClickReset :', teamData);
    // }
    return (
        <>
            {loading && (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
                    open={loading}
                >
                    <CircularProgress color="primary" />
                </Backdrop>
            )}
            <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title" style={{ fontFamily: 'kanit' }} align="center">
                    {'แจ้งเตือน'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ fontFamily: 'kanit' }}>
                        ต้องการ{' '}
                        <strong>
                            <span style={{ color: '#000' }}>{textnotify}</span>
                        </strong>{' '}
                        หรือไม่?
                    </DialogContentText>
                </DialogContent>

                <DialogActions align="center" sx={{ justifyContent: 'center!important', p: 2 }}>
                    <Button color="error" variant="contained" autoFocus onClick={() => handleClose(0)}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" variant="contained" onClick={() => handleClose(1)} autoFocus>
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
            <Tooltip title="รีเซ็ตทีม">
                <Button
                    variant="contained"
                    size="medium"
                    color="error"
                    sx={{ minWidth: '33px!important', p: '6px 0px' }}
                    disabled={dataList.team_forklifts.length === 0 && dataList.team_checkers.length === 0}
                    onClick={() => handleClickOpen(dataList)}
                >
                    <UndoOutlined />
                </Button>
            </Tooltip>
        </>
    )
}

export default ResetTeamLoading