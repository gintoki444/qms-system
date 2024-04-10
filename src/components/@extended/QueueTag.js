import PropTypes from 'prop-types';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';

const QueueTag = ({ id, token, sx = {} }) => {
  //   const theme = useTheme();
  let main;
  switch (id) {
    case 1:
      main = '#f68b71';
      break;
    case 2:
      main = '#f4ae4d';
      break;
    case 3:
      main = '#f7dc50';
      break;
    case 4:
      main = '#0071C1';
      break;
    case 5:
      main = '#8b6b8e';
      break;
    case 6:
      main = '#17cf6c';
      break;
    case 7:
      main = '#f9acc0';
      break;
    case 'primary':
    default:
      main = 'primary';
  }

  return <Chip color="primary" style={{ backgroundColor: main }} sx={sx} label={token} />;
};

QueueTag.propTypes = {
  //   id: PropTypes.number,
  sx: PropTypes.object,
  token: PropTypes.string
};

export default QueueTag;
