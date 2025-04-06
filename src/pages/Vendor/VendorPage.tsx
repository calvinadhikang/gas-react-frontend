import { Box, Button, Stack, Typography, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../util/url';
import { Vendor } from '../../util/dro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '../../atom/globalAtom';
import { Link } from 'react-router';
import { AddVendorDialog } from '../../components/add-vendor-dialog';

export const VendorPage = () => {
  const setLoading = useSetAtom(loadingAtom);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [vendor, setVendor] = useState<Vendor[]>([]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL + '/vendor/all');
      setVendor(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <Box>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={5}
      >
        <Typography variant="h4">List Vendor</Typography>
        <Button onClick={() => setOpenCreateDialog(true)}>Tambah Vendor</Button>
      </Stack>
      <DataGrid
        rows={vendor}
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
      <AddVendorDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setOpenCreateDialog(false);
          fetchVendors();
        }}
      />
    </Box>
  );
};

const renderDataGridColumns = () => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nama', flex: 1, minWidth: 200 },
    { field: 'phone', headerName: 'Nomor Telepon', width: 170 },
    { field: 'address', headerName: 'Alamat', width: 130 },
    { field: 'npwp', headerName: 'NPWP', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    {
      field: 'action',
      headerName: 'Aksi',
      width: 130,
      renderCell: ({ row }: { row: Vendor }) => (
        <MuiLink component={Link} to={`/vendor/detail/${row.id}`}>
          Detail
        </MuiLink>
      ),
    },
  ];
};
