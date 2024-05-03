import PropTypes from 'prop-types';
import React from 'react';
import { Button, Tooltip } from '@mui/material';
// import CryptoJS from 'crypto-js';
import { useSnackbar } from 'notistack';
import { CopyOutlined } from '@ant-design/icons';

const CopyLinkButton = ({ link, data, shortButton = false }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = () => {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    // Set its value to the link to be copied
    const encodedLink = encodeURIComponent(link + data);

    tempInput.value = link + encodedLink;
    // Append it to the body
    document.body.appendChild(tempInput);
    // Select its content
    tempInput.select();
    // Copy the selected content
    document.execCommand('copy');
    // Remove the temporary input
    document.body.removeChild(tempInput);
    // Optionally, you can provide feedback to the user
    // alert('Link copied to clipboard!');
    enqueueSnackbar('คัดลอกลิงก์เรียบร้อย!', { variant: 'success' });
  };
  return (
    <>
      {shortButton == false ? (
        <Button variant="contained" onClick={handleCopy} startIcon={<CopyOutlined />}>
          คัดลอกลิงก์
        </Button>
      ) : (
        <Tooltip title="คัดลอกลิงก์">
          <span>
            <Button variant="contained" sx={{ minWidth: '33px!important', p: '6px 0px' }} size="medium" onClick={handleCopy}>
              <CopyOutlined />
            </Button>
          </span>
        </Tooltip>
      )}
    </>
  );
};

CopyLinkButton.propTypes = {
  shortButton: PropTypes.bool
};
export default CopyLinkButton;
