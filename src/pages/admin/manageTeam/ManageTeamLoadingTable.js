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
  // Button,
  // Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';

// import {
//   EditOutlined
//   // , DeleteOutlined
// } from '@ant-design/icons';
// import moment from 'moment';

// Link api url
import * as adminRequest from '_api/adminRequest';
import ResetTeamLoading from './manage-team-form/ResetTeamLoading';
import AddManageTeam from './manage-team-form/AddManageTeam';
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

function ManageTeamLoadingTable({ permission }) {
  //   const [car, setCar] = useState([]);
  const [open, setOpen] = useState(false);
  const [teamDataList, setTeamDataList] = useState([]);
  // const [teamLoadData, setTeamLoadData] = useState([]);

  useEffect(() => {
    const loadTeamData = async () => {
      setOpen(true);
      await getAllTeamLoading();
    };

    loadTeamData().then(() => setOpen(false));
  }, [permission]);

  const getAllTeamLoading = async () => {
    try {
      await adminRequest.getLoadingTeamAll().then((response) => {
        setTeamDataList(response);
        setOpen(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetClick = (onReload) => {
    if (onReload) {
      setOpen(true);
      getAllTeamLoading();
    }
  }

  // const navigate = useNavigate();
  // const updateWareHouse = (id) => {
  //   navigate('/admin/manage-team-loading/add/' + id);
  // };

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
              {teamDataList.length > 0 &&
                teamDataList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.team_name}</TableCell>
                    <TableCell align="left">{row.team_warehouse_name}</TableCell>
                    <TableCell align="left">
                      {row.team_managers.length > 0 ?
                        row.team_managers.map((teamCheck, indexCheck) => (
                          <Typography key={indexCheck} variant="body1">{teamCheck.manager_name ? teamCheck.manager_name : '-'}</Typography>
                        ))
                        : "-"
                      }
                    </TableCell>
                    <TableCell align="left">
                      {row.team_checkers.length > 0 ?
                        row.team_checkers.map((teamCheck, indexCheck) => (
                          <Typography key={indexCheck} variant="body1">{teamCheck.checker_name ? teamCheck.checker_name : '-'}</Typography>
                        ))
                        : "-"
                      }
                    </TableCell>
                    <TableCell align="left">

                      {row.team_forklifts.length > 0 ?
                        row.team_forklifts.map((teamForklifts, indexFork) => (
                          <Typography key={indexFork} variant="body1">{teamForklifts.forklift_name ? teamForklifts.forklift_name : '-'}</Typography>
                        ))
                        : "-"
                      }
                    </TableCell>
                    <TableCell align="center" >
                      {
                        row.team_status === 'A' ? (
                          <Typography color="success" variant="body1" sx={{ color: 'green' }}>
                            <strong>ใช้งาน</strong>
                          </Typography>
                        ) : (
                          <Typography variant="body1" color="error">
                            <strong>ไม่ใช้งาน</strong>
                          </Typography>
                        )
                      }
                    </TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained" aria-label="Basic button group">
                        <AddManageTeam id={row.team_id} handleClickReset={handleResetClick} />
                        {/* <Tooltip title="แก้ไข">
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            onClick={() => updateWareHouse(row.team_id)}
                          >
                            <EditOutlined />
                          </Button>
                        </Tooltip> */}
                        <ResetTeamLoading dataList={row} handleClickReset={handleResetClick} />
                        {/* <Tooltip title="ลบ">
                          <Button
                            variant="contained"
                            size="medium"
                            color="error"
                            sx={{ minWidth: '33px!important', p: '6px 0px' }}
                            disabled={permission !== 'manage_everything'}
                          // onClick={() => deleteCar(row.manager_id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Tooltip> */}
                      </ButtonGroup>
                    </TableCell>
                    {/* } */}
                  </TableRow>
                ))}
              {teamDataList.length == 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} align="center">
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
