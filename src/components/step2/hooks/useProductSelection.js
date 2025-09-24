import { useState, useCallback } from 'react';
import { Step2Utils } from '../utils/Step2Utils';

export const useProductSelection = () => {
  const [loopSelect, setLoopSelect] = useState([]);
  const [stockSelect, setStockSelect] = useState([]);
  const [orderSelect, setOrderSelect] = useState([]);
  const [typeSelect, setTypeSelect] = useState([]);
  const [typeNumSelect, setTypeNumSelect] = useState({});

  const handleChangeProduct = useCallback((e, id, items, key) => {
    const selectedOption = { id: id, value: e.target.value };
    const stockItem = items.productRegis.find((x) => x.product_register_id === e.target.value)?.total_remain;

    // Update stock selection
    setStockSelect((prevState) => {
      let updatedOptions = [...prevState];
      const selectedStock = {
        id: key,
        order_id: items.order_id,
        item_id: items.item_id,
        product_register_id: e.target.value,
        stockQuetity: parseFloat(stockItem) >= parseFloat(items.quantity) ? parseFloat(items.quantity) : parseFloat(stockItem)
      };

      const index = updatedOptions.findIndex((option) => option.order_id === items.order_id && option.item_id === items.item_id);
      const indexProId = updatedOptions.filter(
        (option) => option.order_id === items.order_id && option.item_id === items.item_id && option.product_register_id !== e.target.value
      );
      const checkStockSelect = updatedOptions.filter((x) => x.order_id === items.order_id && x.item_id === items.item_id);
      const indexKey = updatedOptions.findIndex((option) => option.id === key);

      if (parseFloat(stockItem) <= parseFloat(items.quantity) && indexKey === -1) {
        if (checkStockSelect.length > 0) {
          checkStockSelect.forEach((x) => {
            const totalQuantity = parseFloat(items.quantity);
            selectedStock.stockQuetity = totalQuantity - x.stockQuetity.toFixed(3);
          });
        }
        updatedOptions.push(selectedStock);
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length === 0) {
        updatedOptions[index] = selectedStock;
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length !== 0) {
        const filterindex = updatedOptions.filter((option) => option.order_id === items.order_id && option.item_id === items.item_id);
        filterindex.forEach((x) => {
          selectedStock.stockQuetity = selectedStock.stockQuetity > x.stockQuetity
            ? selectedStock.stockQuetity - x.stockQuetity
            : x.stockQuetity - selectedStock.stockQuetity;
        });
        
        if (selectedStock.stockQuetity <= 0 && indexKey !== -1) {
          selectedStock.stockQuetity = parseFloat(items.quantity);
          let filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);
          filterRemove.push(selectedStock);
          updatedOptions = filterRemove;
        } else if (indexKey !== -1) {
          selectedStock.stockQuetity = parseFloat(items.quantity);
          const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
          if (checkStock.length > 0) {
            let totolIsSelect = 0;
            checkStock.forEach((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));
            if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
              let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
              selectedStock.stockQuetity = result;
            }
          }
          updatedOptions[index] = selectedStock;
        } else {
          updatedOptions.push(selectedStock);
        }
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey === -1) {
        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
        if (checkStock.length > 0) {
          let totolIsSelect = 0;
          checkStock.forEach((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));
          if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);
          } else if (parseFloat(stockItem) === totolIsSelect + selectedStock.stockQuetity && checkStockSelect.length > 0) {
            let result = (parseFloat(stockItem) - selectedStock.stockQuetity).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);
          }
        } else if (checkStockSelect.length > 0) {
          checkStockSelect.forEach((x) => {
            selectedStock.stockQuetity = selectedStock.stockQuetity - x.stockQuetity;
          });
        }
        updatedOptions.push(selectedStock);
      } else {
        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
        if (checkStock.length > 0) {
          let totolIsSelect = 0;
          checkStock.forEach((x) => (totolIsSelect = x.stockQuetity + totolIsSelect));
          if (parseFloat(stockItem) < totolIsSelect + selectedStock.stockQuetity) {
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedStock.stockQuetity = parseFloat(result);
          }
        }
        updatedOptions[index] = selectedStock;
      }
      return updatedOptions;
    });

    // Update loop selection
    setLoopSelect((prevState) => {
      let updatedOptions = [...prevState];
      const selectedOptionNew = {
        id: key,
        order_id: items.order_id,
        item_id: items.item_id,
        product_register_id: e.target.value,
        quantity: parseFloat(items.quantity),
        product_register_quantity: parseFloat(stockItem) >= parseFloat(items.quantity) ? parseFloat(items.quantity) : parseFloat(stockItem),
        sling_hook_quantity: 0,
        sling_sort_quantity: 0,
        smash_quantity: 0,
        jumbo_hook_quantity: 0
      };

      const indexProId = updatedOptions.filter(
        (option) => option.order_id === items.order_id && option.item_id === items.item_id && option.product_register_id !== e.target.value
      );
      const indexKey = updatedOptions.findIndex((option) => option.id === key);
      const orderList = updatedOptions.filter((option) => option.item_id === items.item_id && option.order_id === items.order_id);
      const orderListNotSelect = orderList.filter((option) => option.id !== key);

      let checkSum = Step2Utils.sumSelectProductRegis(orderList);
      let checkSumNotSelect = Step2Utils.sumSelectProductRegis(orderListNotSelect);
      checkSum = checkSum + selectedOptionNew.product_register_quantity;

      if (parseFloat(stockItem) < parseFloat(items.quantity) && indexKey !== -1) {
        const filterList = updatedOptions.filter(
          (option) => option.item_id === items.item_id && option.order_id === items.order_id && option.product_register_id === ''
        );

        if (orderList.length < 3 && orderList.length < items.productRegis.length && filterList.length === 0) {
          if (parseFloat(items.quantity) > checkSum || checkSumNotSelect === 0) {
            const selectedOption = {
              id: `${items.order_id}${items.item_id}${orderList.length + 1}`,
              order_id: items.order_id,
              item_id: items.item_id,
              product_register_id: '',
              quantity: parseFloat(items.quantity),
              product_register_quantity: 0,
              sling_hook_quantity: 0,
              sling_sort_quantity: 0,
              smash_quantity: 0,
              jumbo_hook_quantity: 0
            };
            updatedOptions.push(selectedOption);
          } else if (orderListNotSelect.length > 0) {
            orderListNotSelect.forEach((x) => {
              selectedOptionNew.product_register_quantity = parseFloat((x.quantity - x.product_register_quantity).toFixed(3));
            });
          }
        } else if (parseFloat(items.quantity) < checkSum) {
          let sumquatity = Step2Utils.sumSelectProductRegis(orderList);
          selectedOptionNew.product_register_quantity = sumquatity > parseFloat(items.quantity)
            ? parseFloat((sumquatity - parseFloat(items.quantity)).toFixed(3))
            : parseFloat((parseFloat(items.quantity) - sumquatity).toFixed(3));
        }
        updatedOptions[indexKey] = selectedOptionNew;
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length !== 0) {
        const filterindex = updatedOptions.filter((option) => option.order_id === items.order_id && option.item_id === items.item_id);
        filterindex.forEach((x) => {
          selectedOptionNew.product_register_quantity = selectedOptionNew.product_register_quantity > x.product_register_quantity
            ? selectedOptionNew.product_register_quantity - x.product_register_quantity
            : x.product_register_quantity - selectedOptionNew.product_register_quantity;
        });

        if (selectedOptionNew.product_register_quantity <= 0 && indexKey !== -1) {
          selectedOptionNew.product_register_quantity = parseFloat(items.quantity);
          const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);
          filterRemove.push(selectedOptionNew);
          updatedOptions = filterRemove;
        } else if (indexKey !== -1) {
          const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value && x.id !== key);
          const checkNumSelect = updatedOptions.filter(
            (option) => option.item_id === items.item_id && option.order_id === items.order_id && option.product_register_id === ''
          );
          if (checkStock.length > 0) {
            let totolIsSelect = 0;
            checkStock.forEach((x) => (totolIsSelect = x.product_register_quantity + totolIsSelect));
            if (parseFloat(stockItem) < totolIsSelect + selectedOptionNew.product_register_quantity) {
              let result = parseFloat((parseFloat(stockItem) - totolIsSelect).toFixed(3));
              selectedOptionNew.product_register_quantity = parseFloat(result);
              if (selectedOptionNew.product_register_quantity < selectedOptionNew.quantity && checkNumSelect < 1) {
                const selectedOption = {
                  id: items.order_id + items.item_id + (orderList.length + 1),
                  order_id: items.order_id,
                  item_id: items.item_id,
                  product_register_id: '',
                  quantity: parseFloat(items.quantity),
                  product_register_quantity: 0,
                  sling_hook_quantity: 0,
                  sling_sort_quantity: 0,
                  smash_quantity: 0,
                  jumbo_hook_quantity: 0
                };
                updatedOptions.push(selectedOption);
              }
            } else if (parseFloat(stockItem) === totolIsSelect + selectedOptionNew.product_register_quantity && checkNumSelect.length > 0) {
              updatedOptions = updatedOptions.filter((x) => x.id !== checkNumSelect[0].id);
            } else if (totolIsSelect < selectedOptionNew.product_register_quantity) {
              selectedOptionNew.quantity = selectedOptionNew.product_register_quantity - totolIsSelect;
            }
          } else if (checkNumSelect.length > 0) {
            const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);
            updatedOptions = filterRemove;
            updatedOptions.push(selectedOptionNew);
          }
          const idKey = updatedOptions.findIndex((option) => option.id === key);
          updatedOptions[idKey] = selectedOptionNew;
        }
      } else if (parseFloat(stockItem) >= parseFloat(items.quantity) && indexKey !== -1 && indexProId.length === 0) {
        const filterRemove = updatedOptions.filter((x) => x.id !== key && x.item_id !== items.item_id);
        const checkStock = updatedOptions.filter((x) => x.product_register_id === e.target.value);
        if (checkStock.length > 0) {
          let totolIsSelect = 0;
          checkStock.forEach((x) => (totolIsSelect = x.product_register_quantity + totolIsSelect));
          if (parseFloat(stockItem) < totolIsSelect + selectedOptionNew.product_register_quantity) {
            let result = (parseFloat(stockItem) - totolIsSelect).toFixed(3);
            selectedOptionNew.product_register_quantity = parseFloat(result);
            if (parseFloat(stockItem) > parseFloat(items.quantity) && orderList.length < 3 && orderList.length < items.productRegis.length) {
              const selectedOption = {
                id: items.order_id + items.item_id + orderList.length,
                order_id: items.order_id,
                item_id: items.item_id,
                product_register_id: '',
                quantity: parseFloat(items.quantity),
                product_register_quantity: 0,
                sling_hook_quantity: 0,
                sling_sort_quantity: 0,
                smash_quantity: 0,
                jumbo_hook_quantity: 0
              };
              filterRemove.push(selectedOption);
            }
          }
        }
        filterRemove.push(selectedOptionNew);
        updatedOptions = filterRemove;
      }
      return updatedOptions;
    });

    // Update order selection
    setOrderSelect((prevState) => {
      const updatedOptions = [...prevState];
      const index = updatedOptions.findIndex((option) => option.id === id);
      if (index !== -1) {
        updatedOptions[index] = selectedOption;
      } else {
        updatedOptions.push(selectedOption);
      }
      return updatedOptions;
    });
  }, []);

  const handleChangeSelect = useCallback((id, name, onloop) => (event) => {
    const { value, checked } = event.target;
    const selectedOption = { 
      id: id, 
      name: name, 
      product_register_id: onloop.product_register_id, 
      value: checked ? value || true : false 
    };

    setTypeSelect((prevState) => {
      const updatedOptions = [...prevState];
      const index = updatedOptions.findIndex(
        (option) => option.id === id && option.name === name && option.product_register_id === onloop.product_register_id
      );
      if (index !== -1) {
        updatedOptions[index] = selectedOption;
      } else {
        updatedOptions.push(selectedOption);
      }
      return updatedOptions;
    });
  }, []);

  const handleChangeTypeNum = useCallback((id, name, e, maxNum, onloop) => {
    const selectedOption = { 
      id: id, 
      name: name, 
      product_register_id: onloop.product_register_id, 
      value: e.target.value 
    };

    if (e.target.value > maxNum) {
      alert(`จำนวนสินค้าต้องไม่เกิน "${maxNum}" ตัน`);
      return;
    } else if (e.target.value < 0) {
      alert(`จำนวนสินค้าต้องมากกว่า "0" ตัน`);
      return;
    } else {
      setLoopSelect((prevState) => {
        let updatedOptions = [...prevState];
        const index = updatedOptions.findIndex(
          (option) =>
            option.item_id === onloop.item_id &&
            option.order_id === onloop.order_id &&
            option.product_register_id === onloop.product_register_id
        );
        const selectChange = updatedOptions.find(
          (option) =>
            option.item_id === onloop.item_id &&
            option.order_id === onloop.order_id &&
            option.product_register_id === onloop.product_register_id
        );

        if (name === 'checked1') selectChange.smash_quantity = parseFloat(e.target.value);
        if (name === 'checked2') selectChange.sling_hook_quantity = parseFloat(e.target.value);
        if (name === 'checked3') selectChange.sling_sort_quantity = parseFloat(e.target.value);
        if (name === 'checked4') selectChange.jumbo_hook_quantity = parseFloat(e.target.value);

        updatedOptions[index] = selectChange;
        return updatedOptions;
      });
      
      setTypeNumSelect((prevState) => {
        const updatedOptions = [...prevState];
        const index = updatedOptions.findIndex(
          (option) => option.id === id && option.name === name && option.product_register_id === onloop.product_register_id
        );
        if (index !== -1) {
          updatedOptions[index] = selectedOption;
        } else {
          updatedOptions.push(selectedOption);
        }
        return updatedOptions;
      });
    }
  }, []);

  const resetSelections = useCallback(() => {
    setLoopSelect([]);
    setStockSelect([]);
    setOrderSelect([]);
    setTypeSelect([]);
    setTypeNumSelect({});
  }, []);

  return {
    loopSelect,
    stockSelect,
    orderSelect,
    typeSelect,
    typeNumSelect,
    handleChangeProduct,
    handleChangeSelect,
    handleChangeTypeNum,
    resetSelections,
    setLoopSelect,
    setStockSelect,
    setOrderSelect,
    setTypeSelect,
    setTypeNumSelect
  };
};

