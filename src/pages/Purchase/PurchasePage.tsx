import {
  Box,
  Button,
  Stack,
  Typography,
  Link as MuiLink,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../util/url';
import { Purchase } from '../../util/dro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { monthFilterAtom } from '../../atom/globalAtom';

export const PurchasePage = () => {
  const [purchase, setPurchase] = useState<Purchase[]>([]);
  const [monthFilter, setMonthFilter] = useAtom(monthFilterAtom);

  const fetchPurchase = async () => {
    const response = await axios.get(API_URL + '/purchase/all');

    let temp = [];
    if (monthFilter !== 'all') {
      temp = response.data.data.filter(
        (purchase: Purchase) =>
          dayjs(purchase.created_at).month() === monthFilter
      );
    } else {
      temp = response.data.data;
    }

    setPurchase(temp);
  };

  useEffect(() => {
    fetchPurchase();
  }, [monthFilter]);

  return (
    <Box>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={5}
      >
        <Typography variant="h4">List Purchase</Typography>
        <Link to={'/purchase/add'}>
          <Button>Buat Purchase</Button>
        </Link>
      </Stack>
      <Stack direction={'row'} justifyContent={'flex-end'}>
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
        rows={purchase}
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
      field: 'vendor',
      headerName: 'Vendor',
      flex: 1,
      renderCell: ({ row }: { row: Purchase }) => row.vendor.name,
    },
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
