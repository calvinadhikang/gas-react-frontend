import { Box, Button, Stack, Typography, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../util/url';
import { Customer } from '../../util/dro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AddCustomerDialog } from '../../components/add-customer-dialog';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '../../atom/globalAtom';
import { Link } from 'react-router';

export const CustomerPage = () => {
  const setLoading = useSetAtom(loadingAtom);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL + '/customer/all');
      setCustomers(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Box>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={5}
      >
        <Typography variant="h4">List Customer</Typography>
        <Button onClick={() => setOpenCreateDialog(true)}>
          Tambah Customer
        </Button>
      </Stack>
      <DataGrid
        rows={customers}
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
      <AddCustomerDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setOpenCreateDialog(false);
          fetchCustomers();
        }}
      />
    </Box>
  );
};

const renderDataGridColumns = () => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nama', flex: 1 },
    { field: 'phone', headerName: 'Nomor Telepon', width: 170 },
    { field: 'address', headerName: 'Alamat', width: 130 },
    { field: 'npwp', headerName: 'NPWP', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    {
      field: 'action',
      headerName: 'Aksi',
      width: 130,
      renderCell: ({ row }: { row: Customer }) => (
        <MuiLink component={Link} to={`/customer/detail/${row.id}`}>
          Detail
        </MuiLink>
      ),
    },
  ];
};
