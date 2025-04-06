import { Box, Button, Stack, Typography, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../util/url';
import { Product } from '../../util/dro';
import { AddProductDialog } from '../../components/add-product-dialog';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router';

export const ProductPage = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const response = await axios.get(API_URL + '/product/all');
    setProducts(response.data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={5}
      >
        <Typography variant="h4">List Produk</Typography>
        <Button onClick={() => setOpenCreateDialog(true)}>Tambah Produk</Button>
      </Stack>
      <DataGrid
        rows={products}
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
      <AddProductDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setOpenCreateDialog(false);
          fetchProducts();
        }}
      />
    </Box>
  );
};

const renderDataGridColumns = () => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nama', flex: 1 },
    { field: 'description', headerName: 'Description', width: 170 },
    {
      field: 'price',
      headerName: 'Harga (Rp)',
      width: 130,
      renderCell: ({ row }: { row: Product }) => (
        <>Rp {row.price.toLocaleString()}</>
      ),
    },
    {
      field: 'stock',
      headerName: 'Stok',
      width: 130,
    },
    {
      field: 'action',
      headerName: 'Aksi',
      width: 130,
      renderCell: ({ row }: { row: Product }) => (
        <MuiLink component={Link} to={`/product/detail/${row.id}`}>
          Detail
        </MuiLink>
      ),
    },
  ];
};
