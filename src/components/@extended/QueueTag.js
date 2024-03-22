import PropTypes from 'prop-types';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';

const QueueTag = ({ id, token }) => {
  //   const theme = useTheme();
  let main;
  switch (id) {
    case 1:
      main = 'rgb(243 124 119)';
      break;
    case 2:
      main = '#fcca33';
      break;
    case 3:
      main = '#d9d902';
      break;
    case 4:
      main = '#0071C1';
      break;
    case 5:
      main = '#c373ff';
      break;
    case 6:
      main = '#17cf6c';
      break;
    case 7:
      main = 'rgb(240 120 239)';
      break;
    case 'primary':
    default:
      main = 'primary';
  }

  return (
    <Chip color="primary" style={{ backgroundColor: main }} label={token} />

    // <Box
    //   sx={{
    //     width: size || 8,
    //     height: size || 8,
    //     borderRadius: '50%',
    //     bgcolor: main
    //   }}
    // />
  );
};

QueueTag.propTypes = {
  id: PropTypes.number,
  token: PropTypes.string
};

export default QueueTag;
