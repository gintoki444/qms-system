import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  Grid
} from '@mui/material';
import { SoundOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import QueueTag from 'components/@extended/QueueTag';
import ReserveInformation from './ReserveInformation';
import ProductSelectionDialog from './ProductSelectionDialog';

const CallQueueDialog = ({
  open,
  onClose,
  textnotify,
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
  stockSelect,
  typeSelect,
  typeNumSelect,
  onclickSubmit,
  onProductChange,
  onTypeSelect,
  onTypeNumChange,
  calculateAge,
  sumStock,
  onCallQueue,
  onReset
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title" align="center">
        <Typography variant="h5">
          {textnotify}หมายเลข : <QueueTag id={queues.product_company_id || ''} token={queues.token} />
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ minWidth: 400 }}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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

              <ProductSelectionDialog
                orders={orders}
                loopSelect={loopSelect}
                stockSelect={stockSelect}
                typeSelect={typeSelect}
                typeNumSelect={typeNumSelect}
                queues={queues}
                warehousesList={warehousesList}
                stationsList={stationsList}
                warehouseId={warehouseId}
                stationsId={stationsId}
                teamloadingList={teamloadingList}
                teamId={teamId}
                teamLoading={teamLoading}
                contractorList={contractorList}
                contractorId={contractorId}
                reservesData={reservesData}
                onProductChange={onProductChange}
                onTypeSelect={onTypeSelect}
                onTypeNumChange={onTypeNumChange}
                calculateAge={calculateAge}
                sumStock={sumStock}
              />
            </Grid>
          </Grid>
        </MainCard>
      </DialogContent>
      <DialogActions align="center" sx={{ justifyContent: 'center!important' }}>
        {onclickSubmit == true ? (
          <>
            <CircularProgress color="primary" />
          </>
        ) : (
          <>
            {/* {stockSelect.length > 0 && ( */}
              <Button
                color="warning"
                variant="contained"
                autoFocus
                onClick={onReset}
              >
                รีเซ็ต
              </Button>
            {/* )} */}
            <Button color="error" variant="contained" autoFocus onClick={() => onClose(0)}>
              ยกเลิก
            </Button>
            <Button color="primary" variant="contained" onClick={() => onClose(1)} autoFocus>
              ยืนยัน
            </Button>
            <Button 
              color="info" 
              variant="contained" 
              onClick={() => onCallQueue(queues)} 
              autoFocus 
              endIcon={<SoundOutlined />}
            >
              เรียกคิว
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CallQueueDialog;
