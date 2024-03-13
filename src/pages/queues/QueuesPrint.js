import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import logo from '../../assets/images/ICON-02.png';
import QRCode from 'react-qr-code';

import { Grid, Paper, Typography, Button, Divider, Backdrop, CircularProgress } from '@mui/material';
import moment from 'moment';
const apiUrl = process.env.REACT_APP_API_URL;

import { useLocation } from 'react-router-dom';
// ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
const padZero = (num) => {
  return num < 10 ? `0${num}` : num;
};
const printPageStyle = {
  width: '82mm',
  minHeight: '80mm',
  padding: '24px 32px'
};

function QueuesPrint() {
  const location = useLocation();

  const queuesId = location.state?.queuesId;
  const [loading, setLoading] = useState(false);

  const prurl = window.location.origin + '/queues/detail/' + queuesId;

  useEffect(() => {
    getQueue(queuesId);
  }, [queuesId]);

  const [queues, setQueues] = useState([]);

  const getQueue = (id) => {
    return new Promise(() => {
      setLoading(true);
      setTimeout(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch(apiUrl + '/queue/' + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            result.map((data) => {
              setQueues(data);
            });
            setLoading(false);
          })
          .catch((error) => console.log('error', error));
      }, 100);
    });
  };

  // ========= [ Click print ]  ========= //
  const [isPrinting, setIsPrinting] = useState(false);
  const handlePrint = () => {
    setIsPrinting(true);

    setTimeout(() => {
      window.print();
    }, 500);

    setTimeout(() => {
      setIsPrinting(false);
    }, 1000);
  };
  const navigate = useNavigate();
  const backTo = () => {
    navigate('/queues');
  };
  return (
    <>
      <Paper style={{ ...printPageStyle }} elevation={2} sx={{ m: { xs: 'auto', md: 1 } }}>
        {loading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
            open={loading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <Grid alignItems="center" justifyContent="space-between">
          <Grid container rowSpacing={1} columnSpacing={2.75} sx={{ pt: 2 }}>
            <Grid item xs={12} align="center">
              {/* <img src={logo} alt="Company Logo" className="logo" style={{ width: '80px', textAlign: 'center' }} /> */}
              <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                บริษัท ไอซีพี เฟอทิไลเซอร์ จำกัก
              </Typography>
              <Typography gutterBottom sx={{ mt: 2, fontSize: 18 }}>
                ยินดีต้อนรับ
                <br />
                Welcome
              </Typography>
              <Divider light sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} align="center">
              <QRCode value={prurl} className="qr-code" size={128} />

              <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 0 }}>
                หมายเลขคิว : {queues.token}
              </Typography>

              <Typography variant="h5" gutterBottom sx={{ mt: 0 }}>
                ลำดับคิว : <strong style={{ color: 'red', fontSize: '32px' }}>{padZero(queues.queue_number)}</strong>
              </Typography>

              <Typography variant="h5" gutterBottom>
                ทะเบียนรถ : <strong>{queues.registration_no}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              {moment(new Date()).format('DD/MM/YY HH:mm:ss')}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item xs={12} sx={{ '& button': { m: 1 }, mt: 3, width: { xs: '100%', lg: '82mm' } }} align="center">
        <Button variant="contained" color="primary" onClick={handlePrint} style={{ display: isPrinting ? 'none' : 'inline-flex' }}>
          พิมพ์
        </Button>

        <Button variant="contained" color="error" onClick={backTo} style={{ display: isPrinting ? 'none' : 'inline-flex' }}>
          ย้อนกลับ
        </Button>
      </Grid>
    </>
  );
}

export default QueuesPrint;
