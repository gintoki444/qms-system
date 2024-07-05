import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import 'moment/locale/th';

moment.locale('th');

function AddtimeStep({ selectedDate, setSelectedDate, selectedTime, setSelectedTime }) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <DatePicker
                    label="เลือกวันที่"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                    label="เลือกเวลา"
                    value={selectedTime}
                    onChange={(newValue) => setSelectedTime(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </div>
        </LocalizationProvider>
    );
}

export default AddtimeStep;
