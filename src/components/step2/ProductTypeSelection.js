import React from 'react';
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
  OutlinedInput,
  Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import moment from 'moment/min/moment-with-locales';

const ProductTypeSelection = ({
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
    <Grid item xs={12}>
      {orders.length > 0 && (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ textDecoration: 'underline' }}>
            <strong>ข้อมูลกองสินค้า:</strong>
          </Typography>
          {orders.map((ordersItems, orderId) => (
            <Grid item xs={12} key={orderId}>
              {ordersItems.product_brand_id !== null && ordersItems.product_company_id && (
                <Grid container spacing={2}>
                  {ordersItems.items.map((orderItem, orderIndex) => (
                    <>
                      <Grid item xs={12} key={orderIndex}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5">กองสินค้า : {orderItem.name}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="h5">
                              จำนวน : <strong>{orderItem.quantity}</strong> (ตัน)
                            </Typography>
                          </Grid>
                        </Grid>

                        {loopSelect.map(
                          (onLoop, index) =>
                            onLoop.order_id == orderItem.order_id &&
                            onLoop.item_id == orderItem.item_id && (
                              <MainCard key={index} sx={{ mb: 2 }}>
                                <FormControl sx={{ width: '100%' }} size="small">
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
                                    {orderItem.productRegis.map(
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
                                            {' (คงเหลือ : ' + productRegis.total_remain + ' ตัน) '}
                                            {productRegis.product_register_remark ? (
                                              <strong style={{ color: 'red' }}>
                                                {' '}
                                                ({productRegis.product_register_remark})
                                              </strong>
                                            ) : (
                                              ''
                                            )}
                                            <strong> ({onLoop.product_register_quantity} ตัน)</strong>
                                          </MenuItem>
                                        )
                                    )}
                                  </Select>
                                </FormControl>

                                <Grid sx={{ mt: 2 }}>
                                  <InputLabel sx={{ mt: 1, mb: 1 }}>ประเภท</InputLabel>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={typeSelect.some(
                                          (item) =>
                                            item.id == orderItem.item_id &&
                                            item.product_register_id == onLoop.product_register_id &&
                                            item.name === 'checked1' &&
                                            item.value === 'on'
                                        )}
                                        onChange={onTypeSelect(orderItem.item_id, 'checked1', onLoop)}
                                        name="checked1"
                                      />
                                    }
                                    label="ทุบปุ๋ย"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={typeSelect.some(
                                          (item) =>
                                            item.id == orderItem.item_id &&
                                            item.product_register_id == onLoop.product_register_id &&
                                            item.name === 'checked2' &&
                                            item.value === 'on'
                                        )}
                                        onChange={onTypeSelect(orderItem.item_id, 'checked2', onLoop)}
                                        name="checked2"
                                      />
                                    }
                                    label="เกี่ยวสลิง"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={typeSelect.some(
                                          (item) =>
                                            item.id == orderItem.item_id &&
                                            item.product_register_id == onLoop.product_register_id &&
                                            item.name === 'checked3' &&
                                            item.value === 'on'
                                        )}
                                        onChange={onTypeSelect(orderItem.item_id, 'checked3', onLoop)}
                                        name="checked3"
                                      />
                                    }
                                    label="เรียงสลิง"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={typeSelect.some(
                                          (item) =>
                                            item.id == orderItem.item_id &&
                                            item.product_register_id == onLoop.product_register_id &&
                                            item.name === 'checked4' &&
                                            item.value === 'on'
                                        )}
                                        onChange={onTypeSelect(orderItem.item_id, 'checked4', onLoop)}
                                        name="checked4"
                                      />
                                    }
                                    label="เกี่ยวจัมโบ้"
                                  />
                                </Grid>

                                {/* ทุบปุ๋ย */}
                                {typeSelect.some(
                                  (item) =>
                                    item.id == orderItem.item_id &&
                                    item.product_register_id == onLoop.product_register_id &&
                                    item.name === 'checked1' &&
                                    item.value === 'on'
                                ) && (
                                  <Grid item xs={12} md={12}>
                                    <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                      จำนวนทุบปุ๋ย : (สูงสุด{' '}
                                      {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                    </InputLabel>
                                    <FormControl sx={{ width: '100%' }} size="small">
                                      <OutlinedInput
                                        size="small"
                                        id={typeNumSelect[orderItem.item_id]}
                                        type="number"
                                        value={
                                          typeNumSelect.find(
                                            (item) =>
                                              item.id == orderItem.item_id &&
                                              item.product_register_id == onLoop.product_register_id &&
                                              item.name === 'checked1'
                                          )?.value || ''
                                        }
                                        onChange={(e) => {
                                          onTypeNumChange(
                                            orderItem.item_id,
                                            'checked1',
                                            e,
                                            parseFloat((onLoop.product_register_quantity * 1).toFixed(3)),
                                            onLoop
                                          );
                                        }}
                                        placeholder="จำนวน"
                                      />
                                    </FormControl>
                                  </Grid>
                                )}

                                {/* เกี่ยวสลิง */}
                                {typeSelect.some(
                                  (item) =>
                                    item.id == orderItem.item_id &&
                                    item.product_register_id == onLoop.product_register_id &&
                                    item.name === 'checked2' &&
                                    item.value === 'on'
                                ) && (
                                  <Grid item xs={12} md={12}>
                                    <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                      จำนวนเกี่ยวสลิง : (สูงสุด{' '}
                                      {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                    </InputLabel>
                                    <FormControl sx={{ width: '100%' }} size="small">
                                      <OutlinedInput
                                        size="small"
                                        id={typeNumSelect[orderItem.item_id]}
                                        type="number"
                                        value={
                                          typeNumSelect.find(
                                            (item) =>
                                              item.id == orderItem.item_id &&
                                              item.product_register_id == onLoop.product_register_id &&
                                              item.name === 'checked2'
                                          )?.value || ''
                                        }
                                        onChange={(e) => {
                                          onTypeNumChange(
                                            orderItem.item_id,
                                            'checked2',
                                            e,
                                            parseFloat(onLoop.product_register_quantity),
                                            onLoop
                                          );
                                        }}
                                        placeholder="จำนวน"
                                      />
                                    </FormControl>
                                  </Grid>
                                )}

                                {/* เรียงสลิง */}
                                {typeSelect.some(
                                  (item) =>
                                    item.id == orderItem.item_id &&
                                    item.product_register_id == onLoop.product_register_id &&
                                    item.name === 'checked3' &&
                                    item.value === 'on'
                                ) && (
                                  <Grid item xs={12} md={12}>
                                    <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                      จำนวนเรียงสลิง : (สูงสุด{' '}
                                      {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                    </InputLabel>
                                    <FormControl sx={{ width: '100%' }} size="small">
                                      <OutlinedInput
                                        size="small"
                                        id={typeNumSelect[orderItem.item_id]}
                                        type="number"
                                        value={
                                          typeNumSelect.find(
                                            (item) =>
                                              item.id == orderItem.item_id &&
                                              item.product_register_id == onLoop.product_register_id &&
                                              item.name === 'checked3'
                                          )?.value || ''
                                        }
                                        onChange={(e) => {
                                          onTypeNumChange(
                                            orderItem.item_id,
                                            'checked3',
                                            e,
                                            parseFloat(onLoop.product_register_quantity),
                                            onLoop
                                          );
                                        }}
                                        placeholder="จำนวน"
                                      />
                                    </FormControl>
                                  </Grid>
                                )}

                                {/* เกี่ยวจัมโบ้ */}
                                {typeSelect.some(
                                  (item) =>
                                    item.id == orderItem.item_id &&
                                    item.product_register_id == onLoop.product_register_id &&
                                    item.name === 'checked4' &&
                                    item.value === 'on'
                                ) && (
                                  <Grid item xs={12} md={12}>
                                    <InputLabel sx={{ mt: 1, mb: 1.5 }}>
                                      จำนวนเกี่ยวจัมโบ้ : (สูงสุด{' '}
                                      {parseFloat((onLoop.product_register_quantity * 1).toFixed(3)) + ' ตัน'})
                                    </InputLabel>
                                    <FormControl sx={{ width: '100%' }} size="small">
                                      <OutlinedInput
                                        size="small"
                                        id={typeNumSelect[orderItem.item_id]}
                                        type="number"
                                        value={
                                          typeNumSelect.find(
                                            (item) =>
                                              item.id == orderItem.item_id &&
                                              item.product_register_id == onLoop.product_register_id &&
                                              item.name === 'checked4'
                                          )?.value || ''
                                        }
                                        onChange={(e) => {
                                          onTypeNumChange(
                                            orderItem.item_id,
                                            'checked4',
                                            e,
                                            parseFloat(onLoop.product_register_quantity),
                                            onLoop
                                          );
                                        }}
                                        placeholder="จำนวน"
                                      />
                                    </FormControl>
                                  </Grid>
                                )}
                              </MainCard>
                            )
                        )}
                      </Grid>
                    </>
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

export default ProductTypeSelection;
