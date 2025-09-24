import React from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
  Button,
  ButtonGroup,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { RightSquareOutlined, SoundOutlined } from '@ant-design/icons';
import moment from 'moment/min/moment-with-locales';
import QueueTag from 'components/@extended/QueueTag';

const QueueTableBody = ({
  loading,
  items,
  status,
  permission,
  selectedStations,
  stations,
  onStationChange,
  onCallQueue,
  onOpenDialog
}) => {
  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={12} align="center">
            <CircularProgress />
            <Typography variant="body1">Loading....</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {items.length > 0 &&
        items.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell align="center">
                <Typography>
                  <strong>{index + 1}</strong>
                </Typography>
              </TableCell>
              <TableCell align="left">
                {moment(row.queue_date.slice(0, 10)).format('DD/MM/YY')}
                {row.queue_time ? ' - ' + row.queue_time.slice(0, 5) + 'น.' : ''}
              </TableCell>
              <TableCell align="center">
                <QueueTag id={row.product_company_id || ''} token={row.token} />
                {moment(row.queue_date.slice(0, 10)).format('DD/MM/YYYY') != moment(new Date()).format('DD/MM/YYYY') && (
                  <span style={{ color: 'red' }}> (คิวค้าง)</span>
                )}
              </TableCell>
              <TableCell align="left">
                {row.description ? <strong style={{ color: 'red' }}>{row.description}</strong> : '-'}
              </TableCell>
              <TableCell align="center">
                <Chip color="primary" sx={{ width: '122px' }} label={row.registration_no} />
              </TableCell>
              <TableCell align="left">
                <Typography sx={{ width: '160px' }}>{row.station_description}</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography sx={{ width: '240px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {row.company_name} ({row.count_car_id} คิว)
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body">
                  <strong>{row.total_quantity ? parseFloat((row.total_quantity * 1).toFixed(3)) : '-'}</strong>
                </Typography>
              </TableCell>
              <TableCell align="left">{row.driver_name}</TableCell>
              <TableCell align="left">{row.driver_mobile}</TableCell>
              <TableCell align="left">{row.start_time ? row.start_time.slice(11, 19) : '-'}</TableCell>
              <TableCell align="center">
                {row.recall_status == 'Y' ? <Chip color="error" sx={{ width: '80px' }} label={'ทวนสอบ'} /> : '-'}
              </TableCell>
              <TableCell align="center">
                {status == 'waiting' && <Chip color="warning" sx={{ width: '95px' }} label={'รอขึ้นสินค้า'} />}
                {status == 'processing' && <Chip color="success" sx={{ width: '95px' }} label={'ขึ้นสินค้า'} />}
              </TableCell>
              {status == 'processing' && (
                <TableCell align="center">
                  <Tooltip title="เรียกคิว">
                    <span>
                      <Button
                        sx={{ minWidth: '33px!important', p: '6px 0px' }}
                        variant="contained"
                        size="small"
                        align="center"
                        color="info"
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        onClick={() => onCallQueue(row)}
                      >
                        <SoundOutlined />
                      </Button>
                    </span>
                  </Tooltip>
                </TableCell>
              )}

              {status == 'waiting' && (
                <TableCell align="center">
                  <FormControl sx={{ minWidth: 140 }} size="small">
                    <Select
                      size="small"
                      labelId={`station-select-label-${row.step_id}`}
                      disabled
                      value={selectedStations[row.step_id] || row.reserve_station_id}
                      onChange={(event) => onStationChange(event, row)}
                    >
                      {stations.map((station) => (
                        <MenuItem key={station.station_id} value={station.station_id}>
                          {station.station_description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              )}

              <TableCell align="right" width="120" sx={{ width: 120, maxWidth: 120 }}>
                <ButtonGroup aria-label="button group" sx={{ alignItems: 'center' }}>
                  {status == 'waiting' && (
                    <Tooltip title="เรียกคิว">
                      <Button
                        variant="contained"
                        size="small"
                        color="info"
                        disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                        onClick={() =>
                          onOpenDialog(
                            row.step_id,
                            'call',
                            row.queue_id,
                            selectedStations[row.step_id] || row.reserve_station_id,
                            row
                          )
                        }
                        endIcon={<RightSquareOutlined />}
                      >
                        เรียกคิว
                      </Button>
                    </Tooltip>
                  )}

                  {status == 'processing' && (
                    <div>
                      <Tooltip title="ยกเลิก">
                        <Button
                          variant="contained"
                          size="small"
                          disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                          onClick={() => onOpenDialog(row.step_id, 'cancel', row.queue_id, row.station_id, row)}
                          color="error"
                        >
                          ยกเลิก
                        </Button>
                      </Tooltip>
                      <Tooltip title="ปิดคิว">
                        <span>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={permission !== 'manage_everything' && permission !== 'add_edit_delete_data'}
                            onClick={() => onOpenDialog(row.step_id, 'close', row.queue_id, row.station_id, row)}
                          >
                            ปิดคิว
                          </Button>
                        </span>
                      </Tooltip>
                    </div>
                  )}
                </ButtonGroup>
              </TableCell>
            </TableRow>
          );
        })}

      {items.length == 0 && (
        <TableRow>
          <TableCell colSpan={12} align="center">
            ไม่พบข้อมูล
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default QueueTableBody;

