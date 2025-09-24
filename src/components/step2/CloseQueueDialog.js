import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid
} from '@mui/material';
import MainCard from 'components/MainCard';
import QueueTag from 'components/@extended/QueueTag';
import ReserveInformation from './ReserveInformation';
import ProductTypeSelection from './ProductTypeSelection';
import TeamInformation from './TeamInformation';

const CloseQueueDialog = ({
  open,
  onClose,
  queues,
  warehousesList,
  warehouseId,
  stationsList,
  stationsId,
  teamloadingList,
  teamId,
  teamLoading,
  contractorList,
  contractorId,
  reservesData,
  orders,
  loopSelect,
  typeSelect,
  typeNumSelect,
  onProductChange,
  onTypeSelect,
  onTypeNumChange,
  calculateAge
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title" align="center">
        <Typography variant="h5">
          {'ปิดคิวรับสินค้า'}หมายเลข : <QueueTag id={queues.product_company_id || ''} token={queues.token} />
        </Typography>
      </DialogTitle>
      <DialogContent>
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                <strong>ข้อมูลเข้ารับสินค้า</strong>
              </Typography>

              <ReserveInformation
                warehousesList={warehousesList}
                warehouseId={warehouseId}
                stationsList={stationsList}
                stationsId={stationsId}
                teamloadingList={teamloadingList}
                teamId={teamId}
                teamLoading={teamLoading}
                contractorList={contractorList}
                contractorId={contractorId}
                reservesData={reservesData}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
                <strong>ข้อมูลรถเข้ารับสินค้า</strong>
              </Typography>

              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} md={12}>
                  <Typography variant="h5">ร้านค้า/บริษัท : {queues.company_name}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography variant="h5">ทะเบียนรถ: {queues.registration_no}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography variant="h5">ชื่อคนขับ : {queues.driver_name}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <ProductTypeSelection
              orders={orders}
              loopSelect={loopSelect}
              typeSelect={typeSelect}
              typeNumSelect={typeNumSelect}
              onProductChange={onProductChange}
              onTypeSelect={onTypeSelect}
              onTypeNumChange={onTypeNumChange}
              calculateAge={calculateAge}
            />

            {teamLoading.length > 0 && (
              <TeamInformation teamLoading={teamLoading} />
            )}
          </Grid>
        </MainCard>
      </DialogContent>
      <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
        <Button color="error" variant="contained" autoFocus onClick={() => onClose(0)}>
          ยกเลิก
        </Button>
        <Button color="primary" variant="contained" onClick={() => onClose(1)} autoFocus>
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseQueueDialog;

