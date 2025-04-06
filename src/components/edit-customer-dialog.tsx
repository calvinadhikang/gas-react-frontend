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
import { Customer } from '../util/dro';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '../atom/globalAtom';

export const EditCustomerDialog = ({
  open,
  onClose,
  onSuccess,
  customer,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: Customer | null;
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

  const onClickUpdate = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL + `/customer/update/${customer?.id}`, {
        ...formik.values,
      });
      await onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customer) {
      formik.resetForm({
        values: { ...customer },
        touched: {},
      });
    }
  }, [customer]);

  if (!customer) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'}>
      <DialogTitle>Detail Customer</DialogTitle>
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
          <Button variant="contained" onClick={onClickUpdate}>
            Simpan
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
