import React from 'react';
import {
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { CheckCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
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

  // ฟังก์ชันคำนวณจำนวนกองสินค้าที่เปิดทั้งหมด
  const calculateOpenStockTotal = (productRegisList) => {
    const openStocks = productRegisList.filter((productRegis) => 
      parseFloat(productRegis.total_remain) > 0 && 
      productRegis.product_register_staus === 'A'
    );
    
    const total = openStocks.reduce((total, productRegis) => {
      const remainingStock = stockSelect.filter(
        (x) => x.product_register_id === productRegis.product_register_id
      ).length > 0 
        ? parseFloat(sumStock(productRegis.product_register_id, productRegis.total_remain))
        : parseFloat(productRegis.total_remain);
      return total + remainingStock;
    }, 0);
    
    console.log('Debug calculateOpenStockTotal:', {
      openStocks: openStocks.map(s => ({
        id: s.product_register_id,
        total_remain: s.total_remain,
        status: s.product_register_staus
      })),
      total
    });
    
    return total;
  };

  // ฟังก์ชันตรวจสอบว่าควรแสดงกองสินค้าที่ปิดหรือไม่
  const shouldShowClosedStock = (orderItem) => {
    if (!orderItem.productRegis) return false;
    
    const openStockTotal = calculateOpenStockTotal(orderItem.productRegis);
    const requiredQuantity = parseFloat(orderItem.quantity);
    
    console.log('Debug shouldShowClosedStock:', {
      openStockTotal,
      requiredQuantity,
      shouldShow: openStockTotal < requiredQuantity
    });
    
    // ถ้าจำนวนกองสินค้าที่เปิดไม่เพียงพอ ให้แสดงกองสินค้าที่ปิดด้วย
    return openStockTotal < requiredQuantity;
  };

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
                                        orderItem.productRegis
                                          .filter((productRegis) => {
                                            // กรองกองสินค้าที่มีจำนวนมากกว่า 0
                                            if (parseFloat(productRegis.total_remain) <= 0) return false;
                                            
                                            // ถ้ากองสินค้าเปิด ให้แสดง
                                            if (productRegis.product_register_staus === 'A') return true;
                                            
                                            // ถ้ากองสินค้าปิด ให้ตรวจสอบว่าจำนวนกองสินค้าที่เปิดเพียงพอหรือไม่
                                            return shouldShowClosedStock(orderItem);
                                          })
                                          .sort((a, b) => {
                                            // เรียงลำดับ: เปิด (A) ก่อน ปิด (อื่นๆ)
                                            if (a.product_register_staus === 'A' && b.product_register_staus !== 'A') return -1;
                                            if (a.product_register_staus !== 'A' && b.product_register_staus === 'A') return 1;
                                            
                                            // ถ้าสถานะเหมือนกัน ให้เรียงตามวันที่ (เก่าไปหาใหม่)
                                            if (a.product_register_staus === b.product_register_staus) {
                                              const dateA = new Date(a.product_register_date);
                                              const dateB = new Date(b.product_register_date);
                                              return dateA - dateB; // เก่าไปหาใหม่
                                            }
                                            
                                            return 0;
                                          })
                                          .map((productRegis) => (
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
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                  {/* สถานะ เปิด/ปิด */}
                                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '60px' }}>
                                                    {productRegis.product_register_staus === 'A' ? (
                                                      <>
                                                        <CheckCircleOutlined style={{ color: '#4caf50', fontSize: '14px' }} />
                                                        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: '11px' }}>
                                                          เปิด
                                                        </Typography>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <PoweroffOutlined style={{ color: '#f44336', fontSize: '14px' }} />
                                                        <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 'bold', fontSize: '11px' }}>
                                                          ปิด
                                                        </Typography>
                                                      </>
                                                    )}
                                                  </Box>
                                                  
                                                  {/* ข้อมูลกองสินค้า */}
                                                  <Box sx={{ flex: 1 }}>
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
                                                  </Box>
                                                </Box>
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
                                        orderItem.productRegis
                                          .filter((productRegis) => {
                                            // แสดงเฉพาะกองสินค้าที่เลือกแล้ว
                                            if (productRegis.product_register_id !== onLoop.product_register_id) return false;
                                            
                                            // ถ้ากองสินค้าเปิด ให้แสดง
                                            if (productRegis.product_register_staus === 'A') return true;
                                            
                                            // ถ้ากองสินค้าปิด ให้ตรวจสอบว่าจำนวนกองสินค้าที่เปิดเพียงพอหรือไม่
                                            return shouldShowClosedStock(orderItem);
                                          })
                                          .sort((a, b) => {
                                            // เรียงลำดับ: เปิด (A) ก่อน ปิด (อื่นๆ)
                                            if (a.product_register_staus === 'A' && b.product_register_staus !== 'A') return -1;
                                            if (a.product_register_staus !== 'A' && b.product_register_staus === 'A') return 1;
                                            
                                            // ถ้าสถานะเหมือนกัน ให้เรียงตามวันที่ (เก่าไปหาใหม่)
                                            if (a.product_register_staus === b.product_register_staus) {
                                              const dateA = new Date(a.product_register_date);
                                              const dateB = new Date(b.product_register_date);
                                              return dateA - dateB; // เก่าไปหาใหม่
                                            }
                                            
                                            return 0;
                                          })
                                          .map((productRegis) => (
                                              <MenuItem
                                                key={productRegis.product_register_id}
                                                value={productRegis.product_register_id}
                                                disabled
                                              >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                  {/* สถานะ เปิด/ปิด */}
                                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '60px' }}>
                                                    {productRegis.product_register_staus === 'A' ? (
                                                      <>
                                                        <CheckCircleOutlined style={{ color: '#4caf50', fontSize: '14px' }} />
                                                        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: '11px' }}>
                                                          เปิด
                                                        </Typography>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <PoweroffOutlined style={{ color: '#f44336', fontSize: '14px' }} />
                                                        <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 'bold', fontSize: '11px' }}>
                                                          ปิด
                                                        </Typography>
                                                      </>
                                                    )}
                                                  </Box>
                                                  
                                                  {/* ข้อมูลกองสินค้า */}
                                                  <Box sx={{ flex: 1 }}>
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
                                                  </Box>
                                                </Box>
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
