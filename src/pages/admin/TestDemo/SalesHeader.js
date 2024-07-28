import React from 'react';
import { Grid } from '@mui/material';

const SalesHeader = ({ data }) => (
  <div>
    {/* <p>
      <div style={{ backgroundColor: 'lightBlue', borderRadius: '10px', padding: '7px' }}>
        [ INTER ] on {data.proxyUrl}
      </div>
    </p> */}
    <h3>Order No: {data.No}</h3>
    <Grid container spacing={2}>
      {/* <Grid item xs={6}>
        <b>คิวที่:</b> {data.Queue}
      </Grid>
      <Grid item xs={6}>
        <b>ทะเบียนรถ:</b> {data.License_Plate_No}
      </Grid>
      <Grid item xs={6}>
        <b>เลขที่(DO):</b> {data.Delivery_Slip_No}
      </Grid> */}
      <Grid item xs={6}>
        <b>ใบสั่งซื้อเลขที่:</b> {data.External_Document_No}
      </Grid>
      <Grid item xs={6}>
        <b>Sale Order No:</b> {data.No}
      </Grid>
      <Grid item xs={6}>
        <b>วันที่:</b> {new Date(data.Posting_Date).toLocaleDateString()}
      </Grid>
      <Grid item xs={6}>
        <b>หมายเหตุ:</b> {data.Remark}
      </Grid>
      <Grid item xs={6}>
        <b>รหัสผู้ซื้อ:</b> {data.Sell_to_Customer_No}
      </Grid>
      <Grid item xs={6}>
        <b>ชื่อผู้ซื้อ:</b> {data.Sell_to_Customer_Name}
      </Grid>
      <Grid item xs={6}>
        <b>รหัสคลังสินค้า:</b> {data.Location_Code}
      </Grid>
      <Grid item xs={6}>
        <b>รหัสกระสอบ:</b> {data.Ship_to_Code}
      </Grid>
      <Grid item xs={6}>
        <b>ชื่อคลังสินค้า:</b> {data.LocationName}
      </Grid>
      {/* <Grid item xs={6}>
        <b>เวลาเริ่มขึ้นสินค้า:</b> {data.Time_In_Truck}
      </Grid> */}
    </Grid>
  </div>
);

export default SalesHeader;
