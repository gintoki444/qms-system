import { useState, useEffect } from 'react';
import { getAllProductCompany } from '_api/StepRequest';
import {
  Stack,
  FormControl,
  TextField,
  Autocomplete
  // , InputLabel
} from '@mui/material';

const SelectCompany = ({ name = 'company_id', onSelect, value, disables, showText, filterName }) => {
  const [companies, setCompanies] = useState([]);

  const getAllCompanies = async () => {
    try {
      const response = await getAllProductCompany();
      const newData = [
        {
          product_company_id: 99,
          product_company_name_th: 'ทั้งหมด',
          product_company_name_th2: 'ทั้งหมด',
          product_company_name_en: 'ทั้งหมด',
          product_company_status: 'ทั้งหมด',
          product_company_code: ''
        },
        ...response // วาง response ต่อท้าย object ใหม่
      ];

      console.log(newData);
      setCompanies(newData); // ใช้ newData แทน response
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  const handleSelectChange = (event, newValue) => {
    // newValue คือ object ที่เลือก หรือ null ถ้าไม่เลือก
    const companyId = newValue ? newValue.product_company_id : null;
    if (newValue) {
      filterName(newValue.product_company_name_th2);
    } else {
      filterName('ทั้งหมด');
    }
    // ตรวจสอบประเภทของ onSelect
    if (onSelect.length === 1) {
      onSelect(companyId);
    } else {
      onSelect(name, companyId);
    }
  };

  return (
    <Stack sx={{ flex: 1 }} spacing={1}>
      {/* <InputLabel>
        บริษัท
        {showText ? (
          <>
            <span className="text-meta-1"> : </span>
            <strong>{companies.find((x) => x.product_company_id === value)?.product_company_name_th}</strong>
          </>
        ) : (
          <span className="text-meta-1">: </span>
        )}
      </InputLabel> */}
      {!showText && (
        <Stack spacing={1}>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal={disables}
              id="company-list"
              options={companies}
              onChange={handleSelectChange}
              value={companies.find((x) => x.product_company_id === value) || null} // หาค่าเริ่มต้นจาก value
              getOptionLabel={(option) => option.product_company_name_th2 || ''} // แสดงชื่อย่อ
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  padding: '3px 8px!important'
                },
                '& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
                  right: '7px!important',
                  top: 'calc(50% - 1px)'
                }
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.product_company_id}>
                  {option.product_company_name_th2}
                </li>
              )}
              renderInput={(params) => <TextField {...params} name="company_id" placeholder="เลือกบริษัท" />}
            />
          </FormControl>
        </Stack>
      )}
    </Stack>
  );
};

export default SelectCompany;
