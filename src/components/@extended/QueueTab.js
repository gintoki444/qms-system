// import PropTypes from 'prop-types';

// material-ui
// import { useTheme } from '@mui/material/styles';
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
    case 7:
      main = '#f9acc0';
      break;
    case 'primary':
    default:
      main = 'primary';
  }

  //   const handleClick = (id) => {
  //     console.log(id);
  //   };
  return (
    <Tab
      sx={{ background: main, color: '#fff', opacity: '1!important', ml: '5px!important' }}
      label={
        <Badge badgeContent={numQueue} color="error">
          {txtLabel}
        </Badge>
      }
      onClick={() => onSelect(id)} // Call onSelect with the ID when clicked
    />
  );
};

// QueueTag.propTypes = {
//   id: PropTypes.number,
//   token: PropTypes.string
// };

export default QueueTab;
