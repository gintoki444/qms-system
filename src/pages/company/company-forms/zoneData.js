import React from 'react';
import { InputLabel, Stack, FormControl, Select, MenuItem } from '@mui/material';

const ZoneDataSelect = ({ onChange, value }) => {
  const zones = ['C01', 'C02', 'C03', 'E01', 'HO1', 'N01', 'N02', 'N03', 'NE1', 'NE2', 'NE3', 'S01', 'S02', 'SP1', 'SP2'];

  return (
    <Stack spacing={1}>
      <InputLabel>Zone*</InputLabel>
      <FormControl fullWidth>
        <Select
          displayEmpty
          variant="outlined"
          name="product_brand_id"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="เลือก Zone"
          fullWidth
          //   error={Boolean(touched.description && errors.description)}
        >
          <MenuItem disabled value="">
            เลือก Zone
          </MenuItem>
          {zones.map((zone) => (
            <MenuItem key={zone} value={zone}>
              {zone}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default ZoneDataSelect;
