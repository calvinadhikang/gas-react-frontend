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

export const AddProductDialog = ({
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
      code: '',
      name: '',
      price: 0,
      description: '',
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onClickCreate = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL + '/product/create', {
        ...formik.values,
        stock: 0,
      });
      await onSuccess();

      setSnackbar('Produk berhasil ditambahkan');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        setSnackbar('Produk gagal ditambahkan: ' + error.response.data.message);
      } else {
        setSnackbar('Produk gagal ditambahkan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'}>
      <DialogTitle>Tambah Produk</DialogTitle>
      <DialogContent>
        <Stack gap={2} pt={2}>
          <TextField
            label="Kode"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
          />
          <TextField
            label="Nama"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <TextField
            label={'Deskripsi'}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            multiline
            rows={3}
          />
          <TextField
            type="number"
            label={'Harga'}
            name="price"
            value={formik.values.price}
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
