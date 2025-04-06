import {
  Box,
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  Stack,
  Button,
  Step,
  Stepper,
  StepLabel,
  Card,
  TextField,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../util/url';
import { useEffect, useState } from 'react';
import { Product, Vendor } from '../../util/dro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import dayjs, { Dayjs } from 'dayjs';
import { useSetAtom } from 'jotai';
import { loadingAtom, snackbarAtom } from '../../atom/globalAtom';
import { Link, useNavigate } from 'react-router';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
const AddPurchaseStep = {
  VENDOR: 1,
  PRODUCT: 2,
  CONFIRMATION: 3,
};

interface ProductPurchase extends Product {
  selected: boolean;
  quantity: number;
  price: number;
}

export const AddPurchasePage = () => {
  const setLoading = useSetAtom(loadingAtom);
  const setSnackbar = useSetAtom(snackbarAtom);
  const navigate = useNavigate();

  const [step, setStep] = useState(AddPurchaseStep.VENDOR);
  const [listVendor, setListVendor] = useState([]);
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(null);
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(null);
  const fetchVendors = async () => {
    const response = await axios.get(API_URL + '/vendor/all');
    setListVendor(response.data.data);
  };

  const [listProduct, setListProduct] = useState<ProductPurchase[]>([]);
  const fetchProducts = async () => {
    const response = await axios.get(API_URL + '/product/all');
    setListProduct(
      response.data.data.map((product: Product) => ({
        ...product,
        selected: false,
        quantity: 0,
        price: 0,
      }))
    );
  };

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const onClickVendor = async (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setStep(AddPurchaseStep.PRODUCT);
  };

  useEffect(() => {
    fetchVendors();
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

  const handleCreatePurchase = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL + '/purchase/create', {
        vendor_id: selectedVendor?.id,
        payment_due_date: paymentDate?.format('YYYY-MM-DD'),
        created_at: purchaseDate?.format('YYYY-MM-DD'),
        products: listProduct.filter((product) => product.selected),
      });

      setSnackbar('Purchase berhasil dibuat');
      navigate('/purchase');
    } catch (error) {
      console.error(error);
      setSnackbar('Purchase gagal dibuat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <MuiLink
          component={Link}
          underline="hover"
          color="inherit"
          to="/purchase"
        >
          List Purchase
        </MuiLink>
        <Typography sx={{ color: 'text.primary' }}>Buat Purchase</Typography>
      </Breadcrumbs>
      <Stepper activeStep={step} alternativeLabel sx={{ my: 5 }}>
        <Step>
          <StepLabel>Pilih Vendor</StepLabel>
        </Step>
        <Step>
          <StepLabel>Pilih Barang</StepLabel>
        </Step>
        <Step>
          <StepLabel>Konfirmasi</StepLabel>
        </Step>
      </Stepper>
      {step === AddPurchaseStep.VENDOR && (
        <>
          <Typography variant="h5" mb={1}>
            Pilih Vendor
          </Typography>
          <Stack gap={2}>
            {listVendor.map((vendor: Vendor) => (
              <Card sx={{ p: 3 }} key={vendor.id}>
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  flexWrap={'wrap'}
                >
                  <Stack flexWrap={'wrap'} gap={2}>
                    <Typography variant="h6">{vendor.name}</Typography>
                    <Stack direction={'row'} flexWrap={'wrap'} gap={2}>
                      <Typography variant="caption">
                        NPWP: {vendor.npwp}
                      </Typography>
                      <Typography variant="caption">
                        Telp: {vendor.phone}
                      </Typography>
                      <Typography variant="caption">{vendor.email}</Typography>
                      <Typography variant="caption">
                        {vendor.address}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Button
                    variant="contained"
                    onClick={() => onClickVendor(vendor)}
                    sx={{
                      mt: {
                        xs: 2,
                        md: 0,
                      },
                    }}
                  >
                    Pilih
                  </Button>
                </Stack>
              </Card>
            ))}
          </Stack>
        </>
      )}
      {step === AddPurchaseStep.PRODUCT && (
        <>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography variant="h5">Pilih Barang</Typography>
            <Button
              onClick={() => setStep(AddPurchaseStep.CONFIRMATION)}
              disabled={
                listProduct.filter((product) => product.selected).length === 0
              }
            >
              Next
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
        </>
      )}
      {step === AddPurchaseStep.CONFIRMATION && (
        <>
          <Typography variant="h4" mb={5}>
            Konfirmasi
          </Typography>
          <Typography variant="h6">Vendor</Typography>
          <Card sx={{ p: 3, mt: 2 }} color="success">
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Stack>
                <Typography variant="h6">{selectedVendor?.name}</Typography>
                <Stack direction={'row'} gap={2}>
                  <Typography variant="caption">
                    NPWP: {selectedVendor?.npwp}
                  </Typography>
                  <Typography variant="caption">
                    Telp: {selectedVendor?.phone}
                  </Typography>
                  <Typography variant="caption">
                    {selectedVendor?.email}
                  </Typography>
                  <Typography variant="caption">
                    {selectedVendor?.address}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>
          <Typography variant="h6" mt={5}>
            List Barang
          </Typography>
          <DataGrid
            rows={listProduct.filter((product) => product.selected)}
            columns={renderProductDataGridColumns(
              handleChangeProductQuantity,
              handleChangeProductPrice,
              handleSelectProduct
            )}
            sx={{ mt: 2 }}
            rowHeight={58}
          />
          <Typography variant="h6" mt={5}>
            Rincian Biaya
          </Typography>
          <Stack gap={1} mt={2}>
            <Stack justifyContent={'space-between'} direction={'row'}>
              <Typography>Jumlah Barang</Typography>
              <Typography>
                {listProduct.map((product) => product.selected).length}
              </Typography>
            </Stack>
            <Stack justifyContent={'space-between'} direction={'row'}>
              <Typography>Harga Barang</Typography>
              <Typography>
                Rp{' '}
                {listProduct
                  .filter((product) => product.selected)
                  .reduce(
                    (acc, product) => acc + product.price * product.quantity,
                    0
                  )
                  .toLocaleString()}
              </Typography>
            </Stack>
            <Stack justifyContent={'space-between'} direction={'row'}>
              <Typography>PPN (11%)</Typography>
              <Typography>
                Rp{' '}
                {(
                  listProduct
                    .filter((product) => product.selected)
                    .reduce(
                      (acc, product) => acc + product.price * product.quantity,
                      0
                    ) * 0.11
                ).toLocaleString()}
              </Typography>
            </Stack>
            <Stack justifyContent={'space-between'} direction={'row'}>
              <Typography variant="h6">Harga Setelah PPN</Typography>
              <Typography variant="h6">
                Rp{' '}
                {(
                  listProduct
                    .filter((product) => product.selected)
                    .reduce(
                      (acc, product) => acc + product.price * product.quantity,
                      0
                    ) * 1.11
                ).toLocaleString()}
              </Typography>
            </Stack>
            <Box mt={2}>
              <MobileDatePicker
                label="Tanggal Jatuh Tempo Pembayaran"
                sx={{ width: '100%' }}
                value={paymentDate}
                onChange={(value) => setPaymentDate(value)}
              />
            </Box>
            <Box mt={2}>
              <MobileDatePicker
                label="Tanggal Pembuatan PO"
                sx={{ width: '100%' }}
                value={purchaseDate}
                onChange={(value) => setPurchaseDate(value)}
                defaultValue={dayjs()}
              />
            </Box>
          </Stack>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ my: 5 }}
            onClick={handleCreatePurchase}
          >
            Buat Purchase
          </Button>
        </>
      )}
    </Box>
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
