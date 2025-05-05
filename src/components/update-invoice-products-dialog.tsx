import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
  Checkbox,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { GridToolbar } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { API_URL } from '../util/url';
import { Product } from '../util/dro';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { loadingAtom } from '../atom/globalAtom';

interface ProductPurchase extends Product {
  selected: boolean;
  quantity: number;
  price: number;
}

export const UpdateInvoiceProductsDialog = ({
  open,
  onClose,
  invoiceId,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  refetch: () => void;
}) => {
  const setLoading = useSetAtom(loadingAtom);
  const [listProduct, setListProduct] = useState<ProductPurchase[]>([]);
  const fetchProducts = async () => {
    const response = await axios.get(API_URL + '/product/all');
    setListProduct(
      response.data.data.map((product: Product) => ({
        ...product,
        selected: false,
        quantity: 0,
      }))
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChangeProductQuantity = (id: number, quantity: number) => {
    setListProduct(
      listProduct.map((product: ProductPurchase) =>
        product.id === id ? { ...product, quantity } : product
      )
    );
  };

  const handleChangeProductPrice = (id: number, price: number) => {
    setListProduct(
      listProduct.map((product: ProductPurchase) =>
        product.id === id ? { ...product, price } : product
      )
    );
  };

  const handleSelectProduct = (id: number) => {
    setListProduct(
      listProduct.map((product: ProductPurchase) =>
        product.id === id
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  const onClickUpdateInvoice = async () => {
    try {
      setLoading(true);
      const selectedProducts = listProduct.filter(
        (product) => product.selected
      );
      console.log(selectedProducts);
      await axios.post(API_URL + `/invoice/update-product/${invoiceId}`, {
        products: selectedProducts,
      });
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xl'}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mx={3}
      >
        <DialogTitle>Update Barang</DialogTitle>
        <Button variant="outlined" onClick={onClose}>
          Batal
        </Button>
      </Stack>
      <DialogContent>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <DialogContentText>Update barang pada invoice ini</DialogContentText>
          <Button variant="contained" onClick={onClickUpdateInvoice}>
            Update
          </Button>
        </Stack>
        <DataGrid
          rows={listProduct}
          columns={renderProductDataGridColumns(
            handleChangeProductQuantity,
            handleChangeProductPrice,
            handleSelectProduct
          )}
          sx={{ mt: 2 }}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          rowHeight={58}
        />
      </DialogContent>
    </Dialog>
  );
};

const renderProductDataGridColumns = (
  handleChangeProductQuantity: (id: number, quantity: number) => void,
  handleChangeProductPrice: (id: number, price: number) => void,
  handleSelectProduct: (id: number) => void
) => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nama', flex: 1 },
    { field: 'description', headerName: 'Description', width: 170 },
    { field: 'stock', headerName: 'Stok Gudang', width: 130 },
    {
      field: 'qty',
      headerName: 'Quantity',
      width: 130,
      renderCell: ({ row }: { row: ProductPurchase }) => (
        <Stack alignItems={'center'}>
          <TextField
            type="number"
            value={row.quantity}
            onChange={(e) =>
              handleChangeProductQuantity(row.id, Number(e.target.value))
            }
          />
        </Stack>
      ),
    },
    {
      field: 'price',
      headerName: 'Harga Beli',
      width: 130,
      renderCell: ({ row }: { row: ProductPurchase }) => (
        <TextField
          type="number"
          value={row.price}
          onChange={(e) =>
            handleChangeProductPrice(row.id, Number(e.target.value))
          }
        />
      ),
    },
    {
      field: 'select',
      headerName: 'Pilih',
      width: 130,
      renderCell: ({ row }: { row: ProductPurchase }) => (
        <Checkbox
          checked={row.selected}
          onClick={() => handleSelectProduct(row.id)}
        />
      ),
    },
  ];
};
