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
    if (quantity !== product_register_quantity) {
      hasMismatch = true;
      const difference = product_register_quantity - quantity;
      const diffType = difference > 0 ? 'เกิน' : 'ขาด';
      mismatchMessages.push(`สินค้ามีจำนวน ${diffType} ${Math.abs(difference).toFixed(3)} หน่วย`);
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
