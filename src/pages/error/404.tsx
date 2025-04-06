import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

export const Error404Page = () => {
  const navigate = useNavigate();

  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      height={'100vh'}
      spacing={2}
    >
      <Typography variant="h4">404</Typography>
      <Typography variant="h6">
        Halaman yang Anda cari tidak ditemukan
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Kembali ke halaman utama
      </Button>
    </Stack>
  );
};
