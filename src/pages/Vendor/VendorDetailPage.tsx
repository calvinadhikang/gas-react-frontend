import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { Vendor, Purchase } from '../../util/dro';
import { useSetAtom } from 'jotai';
import { loadingAtom, snackbarAtom } from '../../atom/globalAtom';
import { API_URL } from '../../util/url';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs';
export const VendorDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [purchase, setPurchase] = useState<Purchase[]>([]);

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
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const onClickUpdate = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL + `/vendor/update/${id}`, {
        ...formik.values,
      });

      formik.resetForm({
        values: { ...formik.values },
        touched: {},
      });

      setSnackbar('Berhasil update vendor');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL + `/vendor/detail/${id}`);
      setVendor(response.data.data);
      setPurchase(response.data.purchase);

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
  }, [id]);

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <MuiLink
          component={Link}
          underline="hover"
          color="inherit"
          to="/vendor"
        >
          List Vendor
        </MuiLink>
        <Typography sx={{ color: 'text.primary' }}>{vendor?.name}</Typography>
      </Breadcrumbs>
      <Typography variant="h4" mt={3}>
        Detail Vendor
      </Typography>
      <Stack gap={2} pt={3}>
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
      <Stack gap={2} mt={5}>
        <Typography variant="h4">Daftar Purchase</Typography>
        <DataGrid
          rows={purchase}
          columns={renderDataGridColumns()}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Stack>
    </Box>
  );
};

const renderDataGridColumns = () => {
  return [
    { field: 'code', headerName: 'Kode', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: ({ row }: { row: Purchase }) => (
        <Chip
          label={row.status === 'arrived' ? 'Datang' : 'Belum Datang'}
          color={row.status === 'arrived' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'payment_status',
      headerName: 'Status Pembayaran',
      flex: 1,
      renderCell: ({ row }: { row: Purchase }) => (
        <Chip
          label={row.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'}
          color={row.payment_status === 'paid' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 170,
      renderCell: ({ row }: { row: Purchase }) => row.total.toLocaleString(),
    },
    {
      field: 'grand_total',
      headerName: 'Grand Total',
      width: 130,
      renderCell: ({ row }: { row: Purchase }) =>
        row.grand_total.toLocaleString(),
    },
    {
      field: 'payment_due_date',
      headerName: 'Tanggal Pembayaran',
      width: 130,
      renderCell: ({ row }: { row: Purchase }) =>
        dayjs(row.payment_due_date).format('DD MMMM YYYY'),
    },
    {
      field: 'created_at',
      headerName: 'Tanggal Pembuatan',
      width: 130,
      renderCell: ({ row }: { row: Purchase }) =>
        dayjs(row.created_at).format('DD MMMM YYYY'),
    },
    {
      field: 'action',
      headerName: 'Aksi',
      width: 130,
      renderCell: ({ row }: { row: Purchase }) => (
        <MuiLink component={Link} to={`/purchase/detail/${row.id}`}>
          Detail
        </MuiLink>
      ),
    },
  ];
};
