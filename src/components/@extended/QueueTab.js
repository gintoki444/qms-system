// import PropTypes from 'prop-types';

// material-ui
import { styled } from '@mui/material/styles';
import { Tab, Badge } from '@mui/material';

const QueueTab = ({ id, numQueue, txtLabel, onSelect }) => {
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
    case 9:
      main = '#17cf6c';
      break;
    case 7:
      main = '#f9acc0';
      break;
    case 8:
      main = '#fec4a2';
      break;
    case 'primary':
    default:
      main = 'primary';
  }

  const StyledBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: -5,
      border: `0px solid ${main}`,
      backgroundColor: main,
      color: '#fff',
      padding: '0 4px',
      maxWidth: '20px'
    }
  }));

  return (
    <Tab
      sx={{ opacity: '1!important', ml: '5px!important' }}
      label={<StyledBadge badgeContent={numQueue} max={999}>{txtLabel}</StyledBadge>}
      onClick={() => onSelect(id)}
      color="primary"
    />
  );
};

// QueueTag.propTypes = {
//   id: PropTypes.number,
//   token: PropTypes.string
// };

export default QueueTab;
