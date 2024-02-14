import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Grid,
    Stack,
    Button,
    Box,
    // Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import CompanyTable from './CompanyTable';
import { PlusCircleOutlined } from '@ant-design/icons';


const Company = () => {
    const navigate = useNavigate()

    const addCompany = () => {
        // window.location = '/company/add';
        navigate('/company/add');
    }

    return (
        <Grid rowSpacing={2} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        {/* <Typography variant="h5">ข้อมูลร้านค้า/บริษัท</Typography> */}
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <Button
                                size="mediam"
                                color='success'
                                variant='outlined'
                                onClick={() => addCompany()}
                                startIcon={<PlusCircleOutlined />}
                            >
                                เพิ่มข้อมูล
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        <CompanyTable />
                    </Box>
                </MainCard>
            </Grid>
        </Grid>
    );
}

export default Company;