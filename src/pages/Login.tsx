import { Box, Stack, Typography, TextField, Button, Card } from '@mui/material';
import { useFormik } from 'formik';

export const Login = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const onClickLogin = () => {};

  return (
    <Box>
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <Card sx={{ padding: 4, minWidth: 400 }}>
          <Typography variant="h5">Login</Typography>
          <Stack gap={2} mt={2}>
            <TextField
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            <TextField
              label="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <Button variant="contained" onClick={onClickLogin}>
              Login
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
};
