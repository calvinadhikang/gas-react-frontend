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
import { loadingAtom, snackbarAtom } from '../atom/globalAtom';

export const AddVendorDialog = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const setLoading = useSetAtom(loadingAtom);
  const setSnackbar = useSetAtom(snackbarAtom);
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      address: '',
      npwp: '',
      email: '',
    },
    onSubmit: () => {},
  });

  const onClickCreate = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL + '/vendor/create', formik.values);
      formik.resetForm();

      await onSuccess();
      setSnackbar('Vendor berhasil ditambahkan');
    } catch (error) {
      console.error(error);
      setSnackbar('Vendor gagal ditambahkan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'}>
      <DialogTitle>Tambah Vendor</DialogTitle>
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
