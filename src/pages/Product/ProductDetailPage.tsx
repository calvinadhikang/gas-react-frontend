import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { Inventory, Product } from '../../util/dro';
import { useSetAtom } from 'jotai';
import { loadingAtom, snackbarAtom } from '../../atom/globalAtom';
import { API_URL } from '../../util/url';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [stocks, setStocks] = useState([]);

  const [openAddStockDialog, setOpenAddStockDialog] = useState(false);

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

  const onClickUpdate = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL + `/product/update/${id}`, {
        ...formik.values,
      });

      formik.resetForm({
        values: { ...formik.values },
        touched: {},
      });

      setSnackbar('Berhasil update produk');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStock = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL + `/product/stock/get/${id}`);
      setStocks(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL + `/product/detail/${id}`);
      setProduct(response.data.data);
      formik.resetForm({
        values: { ...response.data.data },
        touched: {},
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetail();
    fetchProductStock();
  }, [id]);

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <MuiLink
          component={Link}
          underline="hover"
          color="inherit"
          to="/product"
        >
          List Produk
        </MuiLink>
        <Typography sx={{ color: 'text.primary' }}>{product?.name}</Typography>
      </Breadcrumbs>
      <Typography variant="h4" mt={3}>
        Detail Produk
      </Typography>
      <Stack gap={2} pt={3}>
        <TextField
          label="Kode"
          name="code"
          value={formik.values.code ?? ''}
          onChange={formik.handleChange}
        />
        <TextField
          label="Nama"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && isEmpty(formik.values.name)}
          helperText={
            formik.touched.name &&
            isEmpty(formik.values.name) &&
            'Nama tidak boleh kosong'
          }
        />
        <TextField
          label={'Deskripsi'}
          name="description"
          value={formik.values.description ?? ''}
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
          onBlur={formik.handleBlur}
          error={formik.touched.price && formik.values.price <= 0}
          helperText={
            formik.touched.price &&
            formik.values.price <= 0 &&
            'Harga tidak boleh kurang dari 0'
          }
        />
        <Button
          variant="contained"
          disabled={isEmpty(formik.values.name) || formik.values.price <= 0}
          onClick={onClickUpdate}
        >
          Simpan
        </Button>
      </Stack>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'flex-start'}
        mt={5}
      >
        <Box>
          <Typography variant="h5">Stok Produk</Typography>
          <Typography>{product?.stock} item</Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpenAddStockDialog(true)}>
          Tambah Stok
        </Button>
      </Stack>
      <Typography variant="h5" mt={5}>
        Mutasi Stok
      </Typography>
      <DataGrid rows={stocks} columns={DataGridColumns} />
      <AddStockManualDialog
        open={openAddStockDialog}
        onClose={() => setOpenAddStockDialog(false)}
        productId={id}
        onSuccess={() => fetchProductStock()}
      />
    </Box>
  );
};

const DataGridColumns: GridColDef[] = [
  {
    field: 'created_at',
    headerName: 'Tanggal',
    flex: 1,
    renderCell: ({ value }: { value?: string }) =>
      value ? dayjs(value).format('DD MMMM YYYY') : null,
  },
  {
    field: 'type',
    headerName: 'Tipe',
    flex: 1,
    renderCell: ({ value }: { value?: string }) => {
      if (value === 'invoice') {
        return <Chip label="Invoice" color="success" />;
      } else if (value === 'purchase') {
        return <Chip label="Purchase" color="error" />;
      } else if (value === 'manual_input') {
        return <Chip label="Manual Input" color="warning" />;
      }
      return null;
    },
  },
  {
    field: 'stock',
    headerName: 'Stok',
    flex: 1,
    renderCell: ({ value, row }: { value?: number; row: Inventory }) => (
      <>
        {row.type === 'invoice' ? '-' : '+'} {value?.toLocaleString()}
      </>
    ),
  },
  {
    field: 'base_price',
    headerName: 'Total Nilai Modal',
    flex: 1,
    renderCell: ({ value }: { value?: number }) => value?.toLocaleString(),
  },
  {
    field: 'reference_id',
    headerName: 'Aksi',
    flex: 1,
    renderCell: ({ row }: { row: Inventory }) => {
      if (row.type === 'invoice') {
        return (
          <MuiLink component={Link} to={`/invoice/detail/${row.reference_id}`}>
            Lihat Invoice
          </MuiLink>
        );
      } else if (row.type === 'purchase') {
        return (
          <MuiLink component={Link} to={`/purchase/detail/${row.reference_id}`}>
            Lihat Purchase
          </MuiLink>
        );
      }
      return null;
    },
  },
];

const AddStockManualDialog = ({
  open,
  onClose,
  productId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  productId: string | undefined;
  onSuccess: () => void;
}) => {
  const formik = useFormik({
    initialValues: {
      stock: 0,
      base_price: 0,
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onClickAddStockManually = async () => {
    try {
      await axios.post(
        API_URL + `/product/stock/add/manual/${productId}`,
        formik.values
      );

      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  if (!productId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'}>
      <DialogTitle>Tambah Stok Manual</DialogTitle>
      <DialogContent>
        <Stack gap={2} pt={2}>
          <TextField
            type="number"
            label="Jumlah Stok"
            name="stock"
            value={formik.values.stock}
            onChange={formik.handleChange}
          />
          <TextField
            label="Total Nilai Modal"
            name="base_price"
            value={formik.values.base_price}
            onChange={formik.handleChange}
          />
          <Button variant="contained" onClick={onClickAddStockManually}>
            Tambah
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
