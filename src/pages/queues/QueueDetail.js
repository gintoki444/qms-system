import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useMediaQuery, Stepper, Step, StepLabel, Button, Typography, Grid, Divider, Chip } from '@mui/material';

import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import { StepContent } from '../../../node_modules/@mui/material/index';

const apiUrl = process.env.REACT_APP_API_URL;
const steps = ['ชั่งเบา', 'ขึ้นสินค้า', 'ชั่งหนัก', 'เสร็จสิ้น'];

function QueueDetail() {
  const { id } = useParams();
  console.log('id :', id);

  const isMobile = useMediaQuery('(max-width:600px)');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    getQueueById(id);
    getQueueCount(id, 'completed');
    getQueue(id);
  }, [id]);

  const [queue_token, setQueueToken] = useState('');
  const [queues, setQueues] = useState([]);

  const getQueue = (id) => {
    return new Promise(() => {
      setTimeout(() => {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch(apiUrl + '/queue/' + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setQueueToken(result[0]['token']);

            result.map((data) => {
              setQueues(data);
              getOrder(data.reserve_id);
            });

            console.log('queue_token :', queue_token);
          })
          .catch((error) => console.log('error', error));
      }, 100);
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
  const [totalItem, setTotalItem] = useState([]);

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
            result.map((data) => {
              setTotalItem(data.total_amount);
            });
            setOrders(result);
            console.log('orders :', result);
            console.log(orders);
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
        console.log('items: ', items);
        console.log('items: ', result);
      })
      .catch((error) => console.log('error', error));
  };

  const navigate = useNavigate();
  const backToQueues = () => {
    navigate('/queues');
  };

  return (
    <>
      <Grid alignItems="center" justifyContent="space-between">
        <Grid container spacing={3} rowSpacing={2} columnSpacing={2.75}>
          <Grid item xs={12} lg={8}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {isMobile ? (
                    <div>
                      <Grid item xs={12}>
                        <Typography variant="h5">ข้อมูลการรับสินค้า</Typography>
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
                    </div>
                  ) : (
                    <div>
                      <Grid item xs={12}>
                        <Typography variant="h5">ข้อมูลการรับสินค้า</Typography>
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
                  <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} light />
                </Grid>
                <Grid item xs={12} sx={{ '& button': { m: 1 }, p: '0 6%!important' }}>
                  <Button
                    size="mediam"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      backToQueues();
                    }}
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
          </StepContent>
        </Step>
      ))}
    </Stepper>
  </div>
);

const HorizontalStepper = ({ activeStep, steps, queue_token, queues, orders, totalItem, stepDetail, stepId }) => (
  <div>
    <Stepper activeStep={activeStep} alternativeLabel sx={{ ml: '-6%' }}>
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>
            <Typography variant="h5">{label}</Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
    <div>
      <Divider sx={{ mb: { xs: 1, sm: 1 }, mt: 3 }} light />
      <QueueDetails
        queue_token={queue_token}
        queues={queues}
        orders={orders}
        totalItem={totalItem}
        stepDetail={stepDetail}
        stepId={stepId}
      />
    </div>
  </div>
);

const QueueDetails = ({ queue_token, queues, orders, totalItem, stepDetail, stepId }) => {
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
    console.log('textTeset ', queueTxt.status);

    return <Chip color={queueTxt.color} label={queueTxt.title} />;
  };

  QueueStatus.propTypes = {
    status: PropTypes.string,
    id: PropTypes.string
  };

  return (
    <Grid container spacing={2} sx={{ p: '0 5%' }}>
      <Grid item xs={6}>
        <Typography variant="h5">
          <strong>รหัสคิว :</strong> {queue_token}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        {stepDetail.map(
          (item, index) =>
            index === stepId && (
              <Typography key={index} variant="h5">
                <strong>สถานะ : </strong>
                <QueueStatus id={stepId} status={item.status} />
              </Typography>
            )
        )}
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body">
          <strong>ชื่อผู้ขับ :</strong> {queues.driver_name}{' '}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body">
          <strong>ทะเบียนรถ :</strong> {queues.registration_no}{' '}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body">
          <strong>เลขที่ใบขับขี่ :</strong> {queues.license_no}{' '}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body">
          <strong>จำนวนสินค้า :</strong> {totalItem} ตัน
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {orders.map((order) => (
          <Grid container spacing={2} key={order.order_id}>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Divider sx={{ mb: { xs: 1, sm: 2 } }} />
              <Typography variant="h5">
                <strong>รายการสั่งซื้อ:</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {order.items.map((item) => (
                <Grid container rowSpacing={0} columnSpacing={2.75} key={item.item_id}>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>สินค้า :</strong> {item.name}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <strong>จำนวน : </strong>
                      {item.quantity} ตัน
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default QueueDetail;
