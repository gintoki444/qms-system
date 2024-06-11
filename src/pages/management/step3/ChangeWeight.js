import { useState } from 'react';

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

function ChangeWeight({ weight1 }) {


    const updateWeight1 = (step_id) => {
        return new Promise((resolve, reject) => {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            const raw = JSON.stringify({
                weight1: weight
            });

            const requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(apiUrl + '/updateweight1/' + step_id, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result['status'] === 'ok') {
                        setWeight('');
                        resolve(result); // ส่งคืนเมื่อการอัปเดตสำเร็จ
                    } else {
                        reject(result); // ส่งคืนเมื่อไม่สามารถอัปเดตได้
                    }
                })
                .catch((error) => console.error(error));
        });
    };

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
        setOnClickShow(false);
    };
    return (
        <>
            <Typography variant="body1" sx={{ fontSize: 16 }}>
                น้ำหนักชั่งเบา : <strong>{weight1 ? parseFloat(weight1) : '-'}</strong> ตัน
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
                            onClick={handleClickShow}
                            color="success"
                            sx={{ minWidth: '33px!important', p: '8px 0px' }}
                        >
                            <SaveOutlined />
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleClickSave}
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

export default ChangeWeight