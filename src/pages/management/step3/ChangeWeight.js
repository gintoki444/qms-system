import { useState, useEffect } from 'react';

import {
    // Grid,
    Button,
    Typography,
    InputAdornment,
    InputLabel,
    FormControl,
    Input,
    ButtonGroup
} from '@mui/material';
import MainCard from 'components/MainCard';
import { EditOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';

import * as queueReques from '_api/queueReques'
import * as stepRequest from '_api/StepRequest'
import * as functionAddLogs from 'components/Function/AddLog';

function ChangeWeight({ weight1, queueId, changeWeight }) {
    const userId = localStorage.getItem('user_id');

    const [step1Data, setStep1Data] = useState({});
    const [weightTxt, setWeightTxt] = useState({});
    const [queueData, setQueueData] = useState({});
    const getQueueDetail = (queueId) => {
        try {
            queueReques.getAllStepById(queueId).then((response) => {
                const dataFind = response.find((x) => x.station_code === "STEP1-001");
                // console.log('getQueueDetail dataFind:', dataFind)
                // console.log('getQueueDetail response:', response)
                setStep1Data(dataFind)
                setQueueData(response);
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log(queueId)
        setWeightTxt(weight1);
        getQueueDetail(queueId);
    }, [queueId, weight1])

    const [onclickShow, setOnClickShow] = useState(false);
    const handleClickShow = () => {
        if (onclickShow == false) {
            setOnClickShow(true);
        } else {
            setOnClickShow(false);
        }
    }

    const [weight, setWeight] = useState(weight1);
    const handleChange = (value) => {
        setWeight(parseFloat(value));
    };

    const handleClickSave = () => {
        // console.log('Save :', weight);
        queueData[0].weight1 = weight;
        // console.log('queueData :', queueData);
        changeWeight(queueData);
        try {
            if (step1Data.step_id && weight) {
                const weightData = {
                    weight1: weight
                }
                stepRequest.updateWeight1(step1Data.step_id, weightData).then((response) => {
                    const data = {
                        audit_user_id: userId,
                        audit_action: "U",
                        audit_system_id: step1Data.step_id,
                        audit_system: "step3",
                        audit_screen: "ข้อมูลชั่งเบา",
                        audit_description: "แก้ไขน้ำหนักข้อมูลชั่งเบา"
                    }
                    AddAuditLogs(data);
                    if (response['status'] === 'ok') {
                        setWeightTxt(weight);
                        changeWeight(queueData);
                        setOnClickShow(false);
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    };

    const AddAuditLogs = async (data) => {
        await functionAddLogs.AddAuditLog(data);
    }
    return (
        <>
            <Typography variant="body1" sx={{ fontSize: 16 }}>
                น้ำหนักชั่งเบา : <strong>{weightTxt ? parseFloat(weightTxt) : parseFloat(weight1)}</strong> ตัน
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleClickShow}
                    color="primary" s
                    sx={{ minWidth: '25px!important', p: '4px 0px', m: 2 }}
                >
                    <EditOutlined />
                </Button>
            </Typography>
            {onclickShow &&
                <MainCard content={false} sx={{ p: 1 }}>
                    <InputLabel sx={{ fontSize: 16 }}>น้ำหนักชั่งเบา</InputLabel>
                    <FormControl variant="standard" sx={{ width: '100%', fontFamily: 'kanit' }}>
                        <Input
                            id="standard-adornment-weight"
                            endAdornment={<InputAdornment position="end">ตัน</InputAdornment>}
                            aria-describedby="standard-weight-helper-text"
                            inputProps={{
                                type: 'number',
                                'aria-label': 'weight',
                                min: 0.1
                            }}
                            placeholder="ระบุน้ำหนัก"
                            value={weight || ''}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                    </FormControl>

                    <ButtonGroup variant="contained" aria-label="button group" sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleClickSave}
                            color="success"
                            sx={{ minWidth: '33px!important', p: '8px 0px' }}
                        >
                            <SaveOutlined />
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleClickShow}
                            color="error"
                            sx={{ minWidth: '33px!important', p: '8px 0px' }}
                        >
                            <CloseCircleOutlined />
                        </Button>
                    </ButtonGroup>
                </MainCard>
            }
        </>
    )
}

export default ChangeWeight;