import { TableRow, TableCell } from '@mui/material';

const SalesItem = ({ item, itemDetails }) => {
  return (
    <TableRow>
      <TableCell>{item.Line_No}</TableCell>
      <TableCell>{itemDetails.No}</TableCell>
      <TableCell>{itemDetails.Description}</TableCell>
      <TableCell>{item.Quantity}</TableCell>
      <TableCell>{item.QuantityBag}</TableCell>
    </TableRow>
  );
};

export default SalesItem;
