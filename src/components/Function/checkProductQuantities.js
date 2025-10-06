function checkProductQuantities(data, enqueueSnackbar) {
  const quantityMap = {};
  let hasIncompleteData = false;
  let mismatchMessages = [];

  data.forEach((item) => {
    if (!item.product_register_quantity) {
      hasIncompleteData = true;
    }

    const key = `${item.order_id}-${item.item_id}`;
    if (!quantityMap[key]) {
      quantityMap[key] = {
        quantity: item.quantity,
        product_register_quantity: 0
      };
    }

    quantityMap[key].product_register_quantity += item.product_register_quantity;
  });

  let hasMismatch = false;

  Object.keys(quantityMap).forEach((key) => {
    const { quantity, product_register_quantity } = quantityMap[key];

    // ตรวจสอบว่าผลรวมของ product_register_quantity ไม่เท่ากับ quantity หรือไม่
    // ใช้ tolerance เพื่อจัดการกับ floating-point precision
    const tolerance = 0.001; // 0.001 หน่วย
    const difference = Math.abs(parseFloat(product_register_quantity) - parseFloat(quantity));
    
    if (difference > tolerance) {
      hasMismatch = true;

      const diffType = parseFloat(product_register_quantity) > parseFloat(quantity) ? 'เกิน' : 'ขาด';
      mismatchMessages.push(`สินค้ามีจำนวน ${diffType} ${difference.toFixed(3)} หน่วย`);
    }
  });

  if (hasIncompleteData) {
    enqueueSnackbar('กรุณาระบุกองสินค้าให้ครบถ้วน', { variant: 'warning' });
    return false;
  }

  if (hasMismatch) {
    enqueueSnackbar('การตัดกองสินค้าผิดพลาด: \n' + mismatchMessages.join('\n'), { variant: 'error' });
    return false;
  }

  return true;
}

export default checkProductQuantities;
