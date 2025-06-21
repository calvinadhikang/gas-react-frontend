import {
  Box,
  Button,
  Stack,
  Typography,
  Link as MuiLink,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../util/url';
import { Invoice } from '../../util/dro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { monthFilterAtom } from '../../atom/globalAtom';

export const InvoicePage = () => {
  const [typeFilter, setTypeFilter] = useState<'ppn' | 'non_ppn' | 'all'>(
    'all'
  );
  const [monthFilter, setMonthFilter] = useAtom(monthFilterAtom);

  const [invoice, setInvoice] = useState<Invoice[]>([]);

  const fetchPurchase = async () => {
    const response = await axios.get(API_URL + '/invoice/all');

    let temp = [];
    if (typeFilter === 'ppn') {
      temp = response.data.data.filter(
        (invoice: Invoice) => invoice.type === 'ppn'
      );
    } else if (typeFilter === 'non_ppn') {
      temp = response.data.data.filter(
        (invoice: Invoice) => invoice.type === 'non_ppn'
      );
    } else {
      temp = response.data.data;
    }

    if (monthFilter !== 'all') {
      temp = temp.filter(
        (invoice: Invoice) => dayjs(invoice.created_at).month() === monthFilter
      );
    }
    setInvoice(temp);
  };

  useEffect(() => {
    fetchPurchase();
  }, [typeFilter, monthFilter]);

  return (
    <Box>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={5}
      >
        <Typography variant="h4">List Invoice</Typography>
        <Link to={'/invoice/add'}>
          <Button>Buat Invoice</Button>
        </Link>
      </Stack>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Button
            variant={typeFilter === 'ppn' ? 'contained' : 'outlined'}
            onClick={() => setTypeFilter('ppn')}
          >
            PPN
          </Button>
          <Button
            variant={typeFilter === 'non_ppn' ? 'contained' : 'outlined'}
            onClick={() => setTypeFilter('non_ppn')}
          >
            Non PPN
          </Button>
          <Button
            variant={typeFilter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setTypeFilter('all')}
          >
            Semua
          </Button>
        </Stack>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Bulan</InputLabel>
          <Select
            value={monthFilter}
            label="Bulan"
            onChange={(e) =>
              setMonthFilter(
                e.target.value === 'all' ? 'all' : Number(e.target.value)
              )
            }
          >
            <MenuItem value="all">Semua Bulan</MenuItem>
            <MenuItem value={0}>Januari</MenuItem>
            <MenuItem value={1}>Februari</MenuItem>
            <MenuItem value={2}>Maret</MenuItem>
            <MenuItem value={3}>April</MenuItem>
            <MenuItem value={4}>Mei</MenuItem>
            <MenuItem value={5}>Juni</MenuItem>
            <MenuItem value={6}>Juli</MenuItem>
            <MenuItem value={7}>Agustus</MenuItem>
            <MenuItem value={8}>September</MenuItem>
            <MenuItem value={9}>Oktober</MenuItem>
            <MenuItem value={10}>November</MenuItem>
            <MenuItem value={11}>Desember</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <DataGrid
        rows={invoice}
        columns={renderDataGridColumns()}
        sx={{ mt: 2 }}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
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
      field: 'customer',
      headerName: 'Customer',
      flex: 1,
      renderCell: ({ row }: { row: Invoice }) => {
        if (row.type === 'ppn') {
          return row.customer?.name;
        } else {
          return `${row.car_type} - ${row.car_number}`;
        }
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      renderCell: ({ row }: { row: Invoice }) =>
        parseInt(row.total.toString() ?? '0').toLocaleString(),
    },
    {
      field: 'grand_total',
      headerName: 'Grand Total',
      renderCell: ({ row }: { row: Invoice }) =>
        parseInt(row.grand_total.toString() ?? '0').toLocaleString(),
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
