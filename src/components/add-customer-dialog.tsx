import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { API_URL } from '../util/url';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '../atom/globalAtom';

export const AddCustomerDialog = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const setLoading = useSetAtom(loadingAtom);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      address: '',
      npwp: '',
      email: '',
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onClickCreate = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL + '/customer/create', formik.values);
      formik.resetForm();

      await onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'}>
      <DialogTitle>Tambah Customer</DialogTitle>
      <DialogContent>
        <Stack gap={2} pt={2}>
          <TextField
            label="Nama"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <TextField
            label="Nomor Telepon"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
          <TextField
            label={'Alamat'}
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            multiline
            rows={3}
          />
          <TextField
            label={'NPWP'}
            name="npwp"
            value={formik.values.npwp}
            onChange={formik.handleChange}
          />
          <TextField
            label={'Email'}
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <Button variant="contained" onClick={onClickCreate}>
            Tambah
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
