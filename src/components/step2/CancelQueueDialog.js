import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel
} from '@mui/material';
import QueueTag from 'components/@extended/QueueTag';

const CancelQueueDialog = ({
  open,
  onClose,
  textnotify,
  queues,
  stationStatus,
  onSelectCloseStation
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title" align="center">
        <Typography variant="h5">{'ยกเลิกคิวรับสินค้า'}</Typography>
      </DialogTitle>

      <DialogContent>
        <Typography align="center" sx={{ p: 2 }}>
          ต้องการ <strong> {textnotify} </strong> คิวหมายเลข :{' '}
          <QueueTag id={queues.product_company_id || ''} token={queues.token} /> หรือไม่?
        </Typography>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={stationStatus === '' ? 'R' : 'N'}
            onChange={(e) => onSelectCloseStation(e.target.value)}
          >
            <FormControlLabel value="R" control={<Radio />} label={'ยกเลิกกองสินค้า'} />
            <FormControlLabel value="Y" control={<Radio />} label={'ยกเลิกรายการคำสั่งซื้อ'} />
            <FormControlLabel value="N" control={<Radio />} label={'ยกเลิกเข้าหัวจ่าย'} />
          </RadioGroup>
        </FormControl>
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

export default CancelQueueDialog;

