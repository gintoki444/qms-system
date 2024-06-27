// import { Link } from 'react-router-dom';

// material-ui
import { Grid } from '@mui/material';

import Logo from 'components/Logo';
import AuthBackground from 'assets/images/auth/AuthBackground';
import AuthFooter from 'components/cards/AuthFooter';

// project import
// import AuthLogin from './auth-forms/AuthLogin';
import QueueDetail from './QueueDetail';
// import AuthWrapper from 'pages/authentication/AuthWrapper';

function QueueNonLogin() {
  return (
    <Grid container spacing={3}>
      <AuthBackground />
      <Grid item xs={12} sx={{ ml: 3, mt: { xs: 0, md: 2 }, pb: 2, pt: { xs: '39px!important', md: 0 }, background: '#fff' }} align={'center'}>
        <Logo />
      </Grid>
      <Grid item xs={12}>
        <QueueDetail sx={{ m: 'auto' }} />
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid>
    </Grid>
  );
}

export default QueueNonLogin;
