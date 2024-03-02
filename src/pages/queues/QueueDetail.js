import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useParams, useNavigate } from 'react-router-dom';
import {
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
  Divider,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Backdrop,
  CircularProgress
} from '@mui/material';

import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import { StepContent } from '../../../node_modules/@mui/material/index';
import { PrinterOutlined, RollbackOutlined } from '@ant-design/icons';

// Get api queuesRequest
import * as queueRequest from '_api/queueReques';
const apiUrl = process.env.REACT_APP_API_URL;
const steps = ['ชั่งเบา', 'ขึ้นสินค้า', 'ชั่งหนัก', 'เสร็จสิ้น'];

// ฟังก์ชันที่ใช้ในการเพิ่ม 0 ถ้าจำนวนน้อยกว่า 10
const padZero = (num) => {
  return num < 10 ? `0${num}` : num;
};

function QueueDetail() {
  const userRoles = useSelector((state) => state.auth.roles);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    getQueueById(id);
    getQueueCount(id, 'completed');
    getQueue(id);
  }, [id, userRoles]);

  const [queue_token, setQueueToken] = useState('');
  const [queues, setQueues] = useState([]);
  const [queueNumber, setQueueNumber] = useState([]);

  const getQueue = (id) => {
    setLoading(true);

    queueRequest.getQueueDetailID(id).then((result) => {
      try {
        setQueueToken(result[0]['token']);
        setQueues(result[0]);
        console.log(result);
        setQueueNumber(result[0]['queue_number']);
        getOrder(result[0].reserve_id);
      } catch (error) {
        navigate('/queues');
      }
    });
  };

  function getQueueCount(queues_id, step_status) {
    return new Promise(() => {
      setTimeout(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        fetch(apiUrl + '/queuecount/' + queues_id + '/' + step_status, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setActiveStep(result[0]['queues_count']);
          })
          .catch((error) => console.log('error', error));
        //resolve('Async operation completed');
      }, 100);
    });
  }

  const [orders, setOrders] = useState([]);
  const [totalItem, setTotalItem] = useState(0);

  function getOrder(id) {
    return new Promise(() => {
      setTimeout(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch(apiUrl + '/orders/' + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            let total = 0;
            result.map((data) => {
              total = total + parseFloat(data.total_amount);
              setTotalItem(total);
            });
            setOrders(result);
            setLoading(false);
          })
          .catch((error) => console.log('error', error));
        //resolve('Async operation completed');
      }, 100);
    });
  }

  const [items, setItems] = useState([]);
  const getQueueById = (id) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + '/stepbyqueueidonly/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
      })
      .catch((error) => console.log('error', error));
  };

  const navigate = useNavigate();
  const printQueues = () => {
    navigate('/queues/prints', { state: { queuesId: id } });
  };
  const backToQueues = () => {
    navigate('/queues');
  };

  return (
    <>
      <Grid alignItems="center" justifyContent="space-between">
        {loading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 0, backgroundColor: 'rgb(245 245 245 / 50%)!important' }}
            open={loading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <Grid container spacing={3} rowSpacing={2} columnSpacing={2.75}>
          <Grid item xs={12} lg={7}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {isMobile ? (
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="h5">
                          คิวที่ : <span style={{ color: 'red' }}> {padZero(queueNumber)}</span>
                        </Typography>
                        <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                      </Grid>
                      <Grid item xs={6} align="right">
                        <Typography variant="h5">หมายเลขคิว : {queue_token}</Typography>
                        <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                      </Grid>

                      <VerticalStepper
                        activeStep={activeStep}
                        steps={steps}
                        queue_token={queue_token}
                        queues={queues}
                        orders={orders}
                        totalItem={totalItem}
                        stepDetail={items}
                        stepId={activeStep}
                      />
                    </Grid>
                  ) : (
                    <div>
                      <Grid item xs={12}>
                        <Typography variant="h4">
                          {' '}
                          คิวที่ : <span style={{ color: 'red' }}> {padZero(queueNumber)}</span>
                          {/* <span style={{ color: 'red' }}>{queueNumber}</span> */}
                        </Typography>
                        <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
                      </Grid>

                      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} light />
                      <HorizontalStepper
                        activeStep={activeStep}
                        steps={steps}
                        queue_token={queue_token}
                        queues={queues}
                        orders={orders}
                        totalItem={totalItem}
                        stepDetail={items}
                        stepId={activeStep}
                      />
                    </div>
                  )}
                </Grid>

                <Grid item xs={12} sx={{ '& button': { m: 1 }, p: '0 -6%!important' }}>
                  {userRoles === 10 && (
                    <Button
                      size="mediam"
                      variant="contained"
                      color="info"
                      d
                      onClick={() => {
                        printQueues();
                      }}
                      startIcon={<PrinterOutlined />}
                    >
                      พิมพ์บัตรคิว
                    </Button>
                  )}
                  <Button
                    size="mediam"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      backToQueues();
                    }}
                    startIcon={<RollbackOutlined />}
                  >
                    ย้อนกลับ
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
const VerticalStepper = ({ activeStep, steps, queue_token, queues, orders, totalItem, stepDetail, stepId }) => (
  <div>
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>
            <Typography variant="h5">{label}</Typography>
          </StepLabel>
          <StepContent>
            <QueueDetails
              queue_token={queue_token}
              queues={queues}
              orders={orders}
              totalItem={totalItem}
              stepDetail={stepDetail}
              stepId={stepId}
            />
          </StepContent>
        </Step>
      ))}
    </Stepper>
    {activeStep === 4 && (
      <div>
        <QueueDetails
          queue_token={queue_token}
          queues={queues}
          orders={orders}
          totalItem={totalItem}
          stepDetail={stepDetail}
          stepId={stepId}
        />
      </div>
    )}
  </div>
);

const HorizontalStepper = ({ activeStep, steps, queue_token, queues, orders, totalItem, stepDetail, stepId }) => (
  <div>
    <MainCard>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ ml: '-8%' }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography variant="h5">{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </MainCard>
    <MainCard sx={{ mt: 2 }}>
      <div>
        {/* <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} light /> */}
        <QueueDetails
          queue_token={queue_token}
          queues={queues}
          orders={orders}
          totalItem={totalItem}
          stepDetail={stepDetail}
          stepId={stepId}
        />
      </div>
    </MainCard>
  </div>
);

const QueueDetails = ({ queue_token, queues, orders, totalItem, stepDetail, stepId }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  // ==============================|| ORDER TABLE - STATUS ||============================== //
  const QueueStatus = ({ status, id }) => {
    const statusText = [
      {
        id: 0,
        detail: [
          {
            color: 'secondary',
            status: 'waiting',
            title: 'รอชั่งเบา'
          },
          {
            color: 'warning',
            status: 'processing',
            title: 'กำลังชั่งเบา'
          },
          {
            color: 'success',
            status: 'completed',
            title: 'สำเร็จ'
          }
        ]
      },
      {
        id: 1,
        detail: [
          {
            color: 'secondary',
            status: 'waiting',
            title: 'รอขึ้นสินค้า'
          },
          {
            color: 'warning',
            status: 'processing',
            title: 'กำลังขึ้นสินค้า'
          },
          {
            color: 'success',
            status: 'completed',
            title: 'สำเร็จ'
          }
        ]
      },
      {
        id: 2,
        detail: [
          {
            color: 'secondary',
            status: 'waiting',
            title: 'รอชั่งหนัก'
          },
          {
            color: 'warning',
            status: 'processing',
            title: 'กำลังชั่งหนัก'
          },
          {
            color: 'success',
            status: 'completed',
            title: 'สำเร็จ'
          }
        ]
      },
      {
        id: 3,
        detail: [
          {
            color: 'secondary',
            status: 'waiting',
            title: 'รอออกจากโรงงาน'
          },
          {
            color: 'warning',
            status: 'processing',
            title: 'กำลังออกจากโรงงาน'
          },
          {
            color: 'success',
            status: 'completed',
            title: 'สำเร็จ'
          }
        ]
      }
    ];

    const queueTxt = statusText[id].detail.find((x) => x.status == status);

    return <Chip color={queueTxt.color} label={queueTxt.title} />;
  };

  QueueStatus.propTypes = {
    status: PropTypes.string,
    id: PropTypes.string
  };

  return (
    <Grid container spacing={2} sx={{ p: '0 3%' }}>
      {!isMobile && (
        <Grid item xs={12} md={6}>
          <Typography variant="h5">
            <strong>หมายเลขคิว :</strong> {queue_token}
          </Typography>
        </Grid>
      )}

      {isMobile && (
        <Grid item xs={12} sx={{ mt: 2, mb: 0 }}>
          <Typography variant="h5">
            <strong>ข้อมูลู้ขับขี่:</strong>
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        {stepDetail.map(
          (item, index) =>
            index === stepId && (
              <Typography key={index} variant="h5" sx={{ pl: { xs: 1, lg: '20%' } }}>
                <strong>สถานะ : </strong>
                <QueueStatus id={`${stepId}`} status={item.status} />
              </Typography>
            )
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="body">
          <strong>ชื่อผู้ขับ :</strong> {queues.driver_name}{' '}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body" sx={{ pl: { xs: 1, lg: '20%' } }}>
          <strong>ทะเบียนรถ :</strong> {queues.registration_no}{' '}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body">
          <strong>เลขที่ใบขับขี่ :</strong> {queues.license_no}{' '}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="body" sx={{ pl: { xs: 1, lg: '20%' } }}>
          <strong>จำนวนสินค้า :</strong> {totalItem} ตัน
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ mt: 1 }}>
        <Divider sx={{ mb: { xs: 1, sm: 2 } }} />
        <Typography variant="h5">
          <strong>ข้อมูลรายการสั่งซื้อ:</strong>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {orders.map((order, item) => (
          <Grid container spacing={2} key={order.order_id}>
            <Grid item xs={12} sx={{ ml: 2, mr: 2 }}>
              {/* {order.items.map((item) => ( */}
              <Grid item xs={12} key={item} sx={{ mb: 2 }}>
                <Grid container spacing={2} sx={{ mb: '15px' }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>เลขที่คำสั่งซื้อ : </strong> {order.ref_order_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ pl: { xs: 1, lg: '20%' } }}>
                      <strong>ยอดจ่าย : </strong> {parseFloat(order.total_amount)} ตัน
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography variant="body1">
                    <strong>รายละเอียด : </strong> {order.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ p: '12px' }}>สินค้า</TableCell>
                        <TableCell align="right" sx={{ p: '12px' }}>
                          จำนวน (ตัน)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell width={'50%'}>{item.name}</TableCell>
                          <TableCell align="right">{parseFloat(item.quantity)} ตัน</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
                <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} />
              </Grid>
              {/* // <Grid container rowSpacing={0} columnSpacing={2.75} key={item.item_id}>
                //   <Grid item xs={6}>
                //     <Typography variant="body1" gutterBottom>
                //       <strong>สินค้า :</strong> {item.name}
                //     </Typography>
                //   </Grid>

                //   <Grid item xs={6}>
                //     <Typography variant="body1" gutterBottom>
                //       <strong>จำนวน : </strong>
                //       {item.quantity} ตัน
                //     </Typography>
                //   </Grid>
                // </Grid> */}
              {/* ))} */}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default QueueDetail;
