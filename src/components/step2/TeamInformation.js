import React from 'react';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const TeamInformation = ({ teamLoading }) => {
  return (
    <Grid item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <strong>ข้อมูลทีมขึ้นสินค้า:</strong>
        </Typography>
      </Grid>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          size="small"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">ลำดับ</TableCell>
              <TableCell align="left">รายชื่อ</TableCell>
              <TableCell align="left">ตำแหน่ง</TableCell>
            </TableRow>
          </TableHead>

          {teamLoading ? (
            <TableBody>
              {teamLoading.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="left">
                    {item.manager_name && item.manager_name}
                    {item.checker_name && item.checker_name}
                    {item.forklift_name && item.forklift_name}
                  </TableCell>
                  <TableCell align="left">
                    {item.manager_name && 'หัวหน้าโกดัง'}
                    {item.checker_name && 'พนักงานจ่ายสินค้า'}
                    {item.forklift_name && 'โฟล์คลิฟท์'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableRow>
              <TableCell colSpan={13} align="center">
                ไม่พบข้อมูล
              </TableCell>
            </TableRow>
          )}
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default TeamInformation;

