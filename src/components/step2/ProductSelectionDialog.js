import React from 'react';
import {
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import moment from 'moment/min/moment-with-locales';

const ProductSelectionDialog = ({
  orders,
  loopSelect,
  stockSelect,
  queues,
  onProductChange,
  calculateAge,
  sumStock
}) => {
  return (
    <Grid item xs={12} sx={{ mt: 1 }}>
      {orders.length > 0 && (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
            <strong>ข้อมูลกองสินค้า:</strong>
          </Typography>
          {orders.map((ordersItems, orderId) => (
            <Grid item xs={12} key={orderId}>
              {ordersItems.product_brand_id !== null && ordersItems.product_company_id && (
                <Grid container spacing={0} sx={{ mt: '0px' }}>
                  {ordersItems.items.map((orderItem, orderItemId) => (
                    <Grid item xs={12} key={orderItemId}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h5">บริษัท (สินค้า): {queues.product_company_name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h5">ตรา (สินค้า): {queues.product_brand_name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h5">กองสินค้า : {orderItem.name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h5">
                            จำนวน : <strong>{orderItem.quantity}</strong> (ตัน)
                          </Typography>
                        </Grid>
                      </Grid>
                      {loopSelect.length > 0 &&
                        loopSelect.map(
                          (onLoop, index) =>
                            onLoop.order_id === orderItem.order_id &&
                            onLoop.item_id === orderItem.item_id && (
                              <>
                                {queues.recall_status !== 'Y' || onLoop.product_register_id === '' ? (
                                  <FormControl sx={{ width: '100%', mb: 2 }} size="small" key={index}>
                                    <Select
                                      displayEmpty
                                      variant="outlined"
                                      value={onLoop.product_register_id}
                                      onChange={(e) => {
                                        onProductChange(e, orderItem.item_id, orderItem, onLoop.id);
                                        onLoop.product_register_id = e.target.value;
                                        orderItem.product_register_id = e.target.value;
                                      }}
                                    >
                                      <MenuItem disabled value="">
                                        เลือกกองสินค้า
                                      </MenuItem>
                                      {orderItem.productRegis &&
                                        orderItem.productRegis.map(
                                          (productRegis) =>
                                            parseFloat(productRegis.total_remain) > 0 && (
                                              <MenuItem
                                                key={productRegis.product_register_id}
                                                value={productRegis.product_register_id}
                                                disabled={
                                                  loopSelect.find(
                                                    (x) =>
                                                      x.order_id == onLoop.order_id &&
                                                      x.item_id == onLoop.item_id &&
                                                      x.product_register_id == productRegis.product_register_id &&
                                                      index > 0
                                                  ) ||
                                                  sumStock(
                                                    productRegis.product_register_id,
                                                    parseFloat(productRegis.total_remain).toFixed(3)
                                                  ) <= 0
                                                }
                                              >
                                                {'โกดัง : ' + productRegis.warehouse_name + ' '}
                                                {productRegis.product_register_name}
                                                {productRegis.product_register_date
                                                  ? ` (${moment(productRegis.product_register_date.slice(0, 10)).format(
                                                      'DD/MM/YY'
                                                    )}) `
                                                  : '-'}
                                                {productRegis.product_register_date ? (
                                                  <strong style={{ color: 'red' }}>
                                                    {' '}
                                                    ({calculateAge(productRegis.product_register_date)})
                                                  </strong>
                                                ) : (
                                                  '-'
                                                )}
                                                {productRegis.product_register_remark ? (
                                                  <strong style={{ color: 'red' }}>
                                                    {' '}
                                                    ({productRegis.product_register_remark})
                                                  </strong>
                                                ) : (
                                                  ''
                                                )}
                                                <strong> ({parseFloat(productRegis.total_remain).toFixed(3)} ตัน)</strong>
                                                {stockSelect.filter(
                                                  (x) => x.product_register_id === productRegis.product_register_id
                                                ).length > 0 &&
                                                  ' คงเหลือ ' +
                                                    parseFloat(
                                                      sumStock(productRegis.product_register_id, productRegis.total_remain)
                                                    ).toFixed(3)}
                                              </MenuItem>
                                            )
                                        )}
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <FormControl sx={{ width: '100%', mb: 2 }} size="small" key={index}>
                                    <Select
                                      displayEmpty
                                      variant="outlined"
                                      value={onLoop.product_register_id}
                                      onChange={(e) => {
                                        onProductChange(e, orderItem.item_id, orderItem);
                                        onLoop.product_register_id = e.target.value;
                                        orderItem.product_register_id = e.target.value;
                                      }}
                                    >
                                      <MenuItem disabled value="">
                                        เลือกกองสินค้า
                                      </MenuItem>
                                      {orderItem.productRegis &&
                                        orderItem.productRegis.map(
                                          (productRegis) =>
                                            productRegis.product_register_id === onLoop.product_register_id && (
                                              <MenuItem
                                                key={productRegis.product_register_id}
                                                value={productRegis.product_register_id}
                                                disabled
                                              >
                                                {'โกดัง : ' + productRegis.warehouse_name + ' '}
                                                {productRegis.product_register_name}
                                                {productRegis.product_register_date
                                                  ? ` (${moment(productRegis.product_register_date.slice(0, 10)).format(
                                                      'DD/MM/YY'
                                                    )}) `
                                                  : '-'}
                                                {productRegis.product_register_date ? (
                                                  <strong style={{ color: 'red' }}>
                                                    {' '}
                                                    ({calculateAge(productRegis.product_register_date)})
                                                  </strong>
                                                ) : (
                                                  '-'
                                                )}
                                                {productRegis.product_register_remark ? (
                                                  <strong style={{ color: 'red' }}>
                                                    {' '}
                                                    ({productRegis.product_register_remark})
                                                  </strong>
                                                ) : (
                                                  ''
                                                )}
                                                <strong> ({parseFloat(productRegis.total_remain).toFixed(3)} ตัน)</strong>
                                                <strong>
                                                  {' '}
                                                  (เลือกแล้ว {parseFloat(onLoop.product_register_quantity).toFixed(3)} ตัน)
                                                </strong>
                                              </MenuItem>
                                            )
                                        )}
                                    </Select>
                                  </FormControl>
                                )}
                              </>
                            )
                        )}
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default ProductSelectionDialog;
