// import { Link } from 'react-router-dom';

// material-ui
import { Grid } from '@mui/material';

// project import
// import AuthLogin from './auth-forms/AuthLogin';
import QueueDetail from './QueueDetail';
// import AuthWrapper from 'pages/authentication/AuthWrapper';

function QueueNonLogin() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid>
        <QueueDetail sx={{ m: 'auto' }} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default QueueNonLogin;
