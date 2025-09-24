import React from 'react';
import { Grid, Typography } from '@mui/material';

const ReserveInformation = ({
  warehousesList,
  warehouseId,
  stationsList,
  stationsId,
  teamloadingList,
  teamId,
  teamLoading,
  contractorList,
  contractorId,
  reservesData
}) => {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5">
          โกดังสินค้า:{' '}
          <strong style={{ color: 'red' }}>
            {warehousesList.find((x) => x.warehouse_id === warehouseId)?.description}
          </strong>
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h5">
          หัวจ่าย:{' '}
          <strong style={{ color: 'red' }}>
            {stationsList.find((x) => x.station_id === stationsId)?.station_description}
          </strong>
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} sx={{ mt: 1 }}>
        <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
          <strong>{teamloadingList.find((x) => x.team_id === teamId)?.team_name}</strong>
        </Typography>
      </Grid>
      {teamLoading &&
        teamLoading.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="h5">
              {item.manager_name && 'หัวหน้าโกดัง'}
              {item.checker_name && 'พนักงานจ่ายสินค้า'}
              {item.forklift_name && 'โฟล์คลิฟท์'}:{' '}
              <strong>
                {item.manager_name && item.manager_name}
                {item.checker_name && item.checker_name}
                {item.forklift_name && item.forklift_name}
              </strong>
            </Typography>
          </Grid>
        ))}

      <Grid item xs={12} md={6}>
        <Typography variant="h5">
          สายแรงงาน : <strong>{contractorList.find((x) => x.contractor_id === contractorId)?.contractor_name}</strong>
          {reservesData?.contractor_name_to_other && (
            <>
              {' '}
              , <span style={{ color: 'red' }}>Pre-sling</span> : <strong>{reservesData.contractor_name_to_other}</strong>
            </>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ReserveInformation;

