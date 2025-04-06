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
import { Product } from '../util/dro';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '../atom/globalAtom';

export const EditProductDialog = ({
  open,
  onClose,
  onSuccess,
  product,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}) => {
  const setLoading = useSetAtom(loadingAtom);

  const formik = useFormik({
    initialValues: {
      code: product?.code,
      name: product?.name,
      price: product?.price,
      stock: product?.stock,
      description: product?.description,
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onClickUpdate = async () => {
    try {
      setLoading(true);

      await axios.post(API_URL + `/product/update/${product?.id}`, {
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
    if (product) {
      formik.resetForm({
        values: { ...product },
        touched: {},
      });
    }
  }, [product]);

  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'}>
      <DialogTitle>Detail Produk</DialogTitle>
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
          <TextField
            type="number"
            label={'Stok'}
            name="stock"
            value={formik.values.stock}
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
