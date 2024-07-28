// import React, { useEffect, useState } from 'react';
import { TableRow, TableCell } from '@mui/material';

const SalesItem = ({
  item,
  itemDetails
  // , getItemsFilter, getItemsFilterName
}) => {
//   const [filteredItem, setFilteredItem] = useState('');
//   const [filteredItemName, setFilteredItemName] = useState('');

//   useEffect(() => {
//     const fetchFilteredItem = async () => {
//       const result = await getItemsFilter(itemDetails.Description);
//       setFilteredItem(result);
//     };
//     fetchFilteredItem();
//   }, [itemDetails.Description, getItemsFilter]);

//   useEffect(() => {
//     const fetchFilteredItem = async () => {
//       const result = await getItemsFilterName(itemDetails.Description);
//       setFilteredItemName(result);
//     };
//     fetchFilteredItem();
//   }, [itemDetails.Description, getItemsFilterName]);

  return (
    <TableRow>
      <TableCell>{item.Line_No}</TableCell>
      <TableCell>{itemDetails.No}</TableCell>
      <TableCell>{itemDetails.Description}</TableCell>
      <TableCell>{item.Quantity}</TableCell>
      <TableCell>{item.QuantityBag}</TableCell>
      {/* <TableCell>{item.LocationName}</TableCell>
      <TableCell>{filteredItem}</TableCell>
      <TableCell>{filteredItemName}</TableCell> */}
    </TableRow>
  );
};

export default SalesItem;
