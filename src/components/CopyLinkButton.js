import PropTypes from 'prop-types';
import React from 'react';
import { Button, Tooltip } from '@mui/material';
import CryptoJS from 'crypto-js';
import { useSnackbar } from 'notistack';
import { CopyOutlined } from '@ant-design/icons';

const KeyCode = process.env.REACT_APP_CODE_URL;

const CopyLinkButton = ({ link, data, shortButton = false }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = () => {
    // console.log('data :', data);
    // console.log('link :', link);
    // if (data == 999999) {
    // Create a temporary input element
    const tempInput = document.createElement('input');

    const encryptedData = CryptoJS.AES.encrypt(data.toString(), KeyCode).toString();
    // Truncate the encrypted data to a maximum of 10 characters
    const base64EncodedData = btoa(encryptedData);

    // Set its value to the link to be copied
    // const encodedLink = encodeURIComponent(link + encryptedData);

    // console.log('data :', data);
    // console.log('KeyCode :', KeyCode);
    // console.log('base64EncodedData :', base64EncodedData);

    // Decode the Base64 string
    // const decodedData = atob(base64EncodedData);
    // const bytes = CryptoJS.AES.decrypt(decodedData, KeyCode);
    // const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    // console.log('decryptedData :', decryptedData);

    tempInput.value = link + base64EncodedData;
    // Append it to the body
    document.body.appendChild(tempInput);
    // Select its content
    tempInput.select();
    // Copy the selected content
    document.execCommand('copy');
    // Remove the temporary input
    document.body.removeChild(tempInput);
    // Optionally, you can provide feedback to the user
    // alert('Link copied to clipboard!');s
    enqueueSnackbar('คัดลอกลิงก์เรียบร้อย!', { variant: 'success' });
    // }
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
