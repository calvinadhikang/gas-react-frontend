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
import { Customer, Invoice } from '../../util/dro';
import { useSetAtom } from 'jotai';
import { loadingAtom, snackbarAtom } from '../../atom/globalAtom';
import { API_URL } from '../../util/url';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import dayjs from 'dayjs';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoice, setInvoice] = useState<Invoice[]>([]);

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
      await axios.post(API_URL + `/customer/update/${id}`, {
        ...formik.values,
      });

      formik.resetForm({
        values: { ...formik.values },
        touched: {},
      });

      setSnackbar('Berhasil update customer');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL + `/customer/detail/${id}`);
      setCustomer(response.data.data);
      setInvoice(response.data.invoice);

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
          to="/customer"
        >
          List Customer
        </MuiLink>
        <Typography sx={{ color: 'text.primary' }}>{customer?.name}</Typography>
      </Breadcrumbs>
      <Typography variant="h4" mt={3}>
        Detail Customer
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
        <Typography variant="h4">Daftar Invoice</Typography>
        <DataGrid
          rows={invoice}
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
      field: 'type',
      headerName: 'Type',
      flex: 1,
      renderCell: ({ row }: { row: Invoice }) => (
        <Chip
          label={row.type === 'ppn' ? 'PPN' : 'Non PPN'}
          color={row.type === 'ppn' ? 'primary' : 'secondary'}
          size="small"
        />
      ),
    },
    {
      field: 'payment_status',
      headerName: 'Status Pembayaran',
      flex: 1,
      renderCell: ({ row }: { row: Invoice }) => (
        <Chip
          label={row.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'}
          color={row.payment_status === 'paid' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: ({ row }: { row: Invoice }) => (
        <Chip
          label={row.status === 'finished' ? 'Selesai' : 'Belum Selesai'}
          color={row.status === 'finished' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      renderCell: ({ row }: { row: Invoice }) => row.total.toLocaleString(),
    },
    {
      field: 'grand_total',
      headerName: 'Grand Total',
      renderCell: ({ row }: { row: Invoice }) =>
        row.grand_total.toLocaleString(),
    },
    {
      field: 'payment_due_date',
      headerName: 'Tgl Jatuh Tempo',
      width: 130,
      renderCell: ({ row }: { row: Invoice }) =>
        dayjs(row.payment_due_date).format('DD MMMM YYYY'),
    },
    {
      field: 'created_at',
      headerName: 'Tgl Pembuatan',
      width: 130,
      renderCell: ({ row }: { row: Invoice }) =>
        dayjs(row.created_at).format('DD MMMM YYYY'),
    },
    {
      field: 'action',
      headerName: 'Aksi',
      width: 130,
      renderCell: ({ row }: { row: Invoice }) => (
        <MuiLink component={Link} to={`/invoice/detail/${row.id}`}>
          Detail
        </MuiLink>
      ),
    },
  ];
};
