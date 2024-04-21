// material-ui
import { useMediaQuery, Container, Typography, Stack } from '@mui/material';
import mement from 'moment';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl" align="center">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'center'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
        // textAlign={'center'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          &copy; บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด All Rights Reserved.&nbsp; {mement().format('YYYY')}
        </Typography>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
