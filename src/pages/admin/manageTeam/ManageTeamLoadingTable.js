import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  ButtonGroup,
  Button,
  Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

// Link api url
// import * as addminRequest from '_api/adminRequest';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
  {
    id: 'wareHouseNo',
    align: 'center',
    width: '5%',
    disablePadding: false,
    label: 'ลำดับ'
  },
  {
    id: 'TeamName',
    align: 'left',
    disablePadding: true,
    label: 'ชื่อทีมจ่ายสินค้า'
  },
  {
    id: 'warehouse_id',
    align: 'left',
    disablePadding: false,
    label: 'โกดัง'
  },
  {
    id: 'wareHouseManager',
    align: 'left',
    disablePadding: false,
    label: 'หัวหน้าโกดัง'
  },
  {
    id: 'checker',
    align: 'left',
    disablePadding: false,
    label: 'พนักงานจ่ายสินค้า'
  },
  {
    id: 'forklift',
    align: 'left',
    disablePadding: false,
    label: 'โฟล์คลิฟ'
  },
  {
    id: 'useDate',
    align: 'left',
    disablePadding: false,
    label: 'วันที่ใช้งาน'
  },
  {
    id: 'stetus',
    align: 'center',
    disablePadding: false,
    label: 'สถานะ'
  },
  {
    id: 'action',
    align: 'right',
    width: '10%',
    disablePadding: false,
    label: 'Actions'
  }
];

function CompantTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'} width={headCell.width}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  ); 
}

function ManageTeamLoadingTable() {
  //   const [car, setCar] = useState([]);
  const [open, setOpen] = useState(false);
  const [wareHouseList, setWareHouseList] = useState([]);

  useEffect(() => {
    // getPermission();
    getWareHouseManager();
  }, []);

  const getWareHouseManager = async () => {
    setOpen(true);
    try {
      setWareHouseList([
        {
          team_id: 1,
          team_name: 'ทีมขึ้นสินค้า #1',
          status: 'A',
          used_date: '2024-03-09T00:00:00.000Z',
          warehouse_id: 2,
          description: 'A1',
          team_manager_id: 1,
          manager_id: 1,
          manager_name: 'นายปรีชาติ ไวโพคลี',
          team_checker: [
            {
              team_checker_id: 1,
              checker_id: 1,
              checker_name: 'นายอนุรักษ์ แก้วศิริ'
            },
            {
              team_checker_id: 4,
              checker_id: 2,
              checker_name: 'น.ส ทิวาพร ยาตรา'
            }
          ],
          team_forklift: [
            {
              team_forklift_id: 1,
              forklift_id: 1,
              forklift_name: 'นายจีรศักดิ์ คุ้มเสถียร'
            },
            {
              team_forklift_id: 4,
              forklift_id: 2,
              forklift_name: 'นายจีรศักดิ์ คุ้มเสถียร'
            }
          ]
        }
      ]);
      setOpen(false);
      //   });
    } catch (error) {
      console.log(error);
    }
  };

  //   const navigate = useNavigate();
  //   const updateWareHouse = (id) => {
  //     navigate('/admin/warehouse/update/' + id);
  //   };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
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
          <CompantTableHead />
          {!open ? (
            <TableBody>
              {wareHouseList.length > 0 &&
                wareHouseList.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="left">{row.team_name}</TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="left">{row.manager_name}</TableCell>
                      <TableCell align="left">
                        <Typography variant="body1">{row.team_checker[0].checker_name}</Typography>
                        <Typography variant="body1">{row.team_checker[1].checker_name}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body1">{row.team_forklift[0].forklift_name}</Typography>
                        <Typography variant="body1">{row.team_forklift[1].forklift_name}</Typography>
                      </TableCell>
                      <TableCell align="left">{moment(row.used_date.slice(0, 10)).format('DD/MM/YYYY')}</TableCell>

                      <TableCell align="center">
                        {row.status == 'A' ? (
                          <Typography color="success" variant="body1" sx={{ color: 'green' }}>
                            <strong>ใช้งาน</strong>
                          </Typography>
                        ) : (
                          <Typography variant="body1" color="error">
                            <strong>ไม่ใช้งาน</strong>
                          </Typography>
                        )}
                      </TableCell>
                      {/* {permission.length > 0 &&  */}
                      <TableCell align="center">
                        <ButtonGroup variant="contained" aria-label="Basic button group">
                          <Tooltip title="แก้ไข">
                            <Button
                              variant="contained"
                              size="medium"
                              color="primary"
                              sx={{ minWidth: '33px!important', p: '6px 0px' }}
                              onClick={() => updateWareHouse(row.manager_id)}
                            >
                              <EditOutlined />
                            </Button>
                          </Tooltip>
                          <Tooltip title="ลบ">
                            <Button
                              variant="contained"
                              size="medium"
                              color="error"
                              sx={{ minWidth: '33px!important', p: '6px 0px' }}
                              // onClick={() => deleteCar(row.manager_id)}
                            >
                              <DeleteOutlined />
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </TableCell>
                      {/* } */}
                    </TableRow>
                  );
                })}
              {wareHouseList.length == 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                  <Typography variant="body1">Loading....</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
export default ManageTeamLoadingTable;
