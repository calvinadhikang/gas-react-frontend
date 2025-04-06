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
  Chip,
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../util/url';
import { useEffect, useState } from 'react';
import { Customer, Product } from '../../util/dro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import dayjs, { Dayjs } from 'dayjs';
import { useSetAtom } from 'jotai';
import { loadingAtom, snackbarAtom } from '../../atom/globalAtom';
import { Link, useNavigate } from 'react-router';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
const AddPurchaseStep = {
  TYPE: 1,
  CUSTOMER: 2,
  PRODUCT: 3,
  CONFIRMATION: 4,
};

interface ProductPurchase extends Product {
  selected: boolean;
  quantity: number;
  price: number;
}

export const AddInvoicePage = () => {
  const setLoading = useSetAtom(loadingAtom);
  const setSnackbar = useSetAtom(snackbarAtom);
  const navigate = useNavigate();

  const [type, setType] = useState<'ppn' | 'non_ppn' | null>(null);
  const [step, setStep] = useState(AddPurchaseStep.TYPE);

  const [purchaseCode, setPurchaseCode] = useState('');
  const [carType, setCarType] = useState('');
  const [carNumber, setCarNumber] = useState('');

  const [customer, setListCustomer] = useState<Customer[]>([]);
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(null);
  const fetchCustomers = async () => {
    const response = await axios.get(API_URL + '/customer/all');
    setListCustomer(response.data.data);
  };

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

  const [searchCustomerKey, setSearchCustomerKey] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [filteredCustomer, setFilteredCustomer] = useState<Customer[]>([]);

  useEffect(() => {
    setFilteredCustomer(
      customer.filter((customer) =>
        customer.name.toLowerCase().includes(searchCustomerKey.toLowerCase())
      )
    );
  }, [searchCustomerKey, customer]);

  const onClickCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setStep(AddPurchaseStep.PRODUCT);
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const onClickType = (type: 'ppn' | 'non_ppn') => {
    setType(type);
    setStep(AddPurchaseStep.CUSTOMER);
  };

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

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      await axios.post(API_URL + '/invoice/create', {
        type,
        purchase_code: purchaseCode,
        car_type: carType,
        car_number: carNumber,
        customer_id: selectedCustomer?.id,
        payment_due_date: paymentDate?.format('YYYY-MM-DD'),
        created_at: invoiceDate?.format('YYYY-MM-DD'),
        products: listProduct.filter((product) => product.selected),
      });

      setSnackbar('Invoice  berhasil dibuat');
      navigate('/invoice');
    } catch (error) {
      console.log(error);
      setSnackbar('Invoice gagal dibuat');
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
          to="/invoice"
        >
          List Invoice
        </MuiLink>
        <Typography sx={{ color: 'text.primary' }}>Buat Invoice</Typography>
      </Breadcrumbs>
      <Stepper activeStep={step} alternativeLabel sx={{ my: 5 }}>
        <Step>
          <StepLabel>Pilih Tipe Invoice</StepLabel>
        </Step>
        <Step>
          <StepLabel>Pilih Customer</StepLabel>
        </Step>
        <Step>
          <StepLabel>Pilih Barang</StepLabel>
        </Step>
        <Step>
          <StepLabel>Konfirmasi</StepLabel>
        </Step>
      </Stepper>
      {step === AddPurchaseStep.TYPE && (
        <>
          <Typography variant="h5">Pilih Tipe Invoice</Typography>
          <Stack direction={'row'} gap={2}>
            <Button variant="contained" onClick={() => onClickType('ppn')}>
              PPN
            </Button>
            <Button variant="contained" onClick={() => onClickType('non_ppn')}>
              Non PPN
            </Button>
          </Stack>
        </>
      )}
      {step === AddPurchaseStep.CUSTOMER && (
        <>
          {type === 'ppn' && (
            <Stack>
              <Typography variant="h5" mb={1}>
                Pilih Customer
              </Typography>
              <TextField
                label="Cari Customer"
                fullWidth
                value={searchCustomerKey}
                onChange={(e) => setSearchCustomerKey(e.target.value)}
                sx={{ my: 3 }}
              />
              <Stack gap={2}>
                {filteredCustomer.map((customer: Customer) => (
                  <Card sx={{ p: 3 }} key={customer.id}>
                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      flexWrap={'wrap'}
                    >
                      <Stack flexWrap={'wrap'} gap={2}>
                        <Typography variant="h6">{customer.name}</Typography>
                        <Stack direction={'row'} flexWrap={'wrap'} gap={2}>
                          <Typography variant="caption">
                            NPWP: {customer.npwp}
                          </Typography>
                          <Typography variant="caption">
                            Telp: {customer.phone}
                          </Typography>
                          <Typography variant="caption">
                            {customer.email}
                          </Typography>
                          <Typography variant="caption">
                            {customer.address}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Button
                        variant="contained"
                        onClick={() => onClickCustomer(customer)}
                      >
                        Pilih
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          )}
          {type === 'non_ppn' && (
            <Stack>
              <Typography variant="h5">Masukan Data Customer</Typography>
              <Stack gap={2} mt={2}>
                <TextField
                  label="Type Mobil"
                  fullWidth
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                />
                <TextField
                  label="Nomor Polisi"
                  fullWidth
                  value={carNumber}
                  onChange={(e) => setCarNumber(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={() => setStep(AddPurchaseStep.PRODUCT)}
                  disabled={carType === '' || carNumber === ''}
                >
                  Next
                </Button>
              </Stack>
            </Stack>
          )}
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
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            mb={2}
            alignItems={'center'}
          >
            <Typography variant="h6">Type Invoice</Typography>
            <Chip label={type === 'ppn' ? 'PPN' : 'Non PPN'} size="medium" />
          </Stack>
          <Typography variant="h6">Customer</Typography>
          <Card sx={{ p: 3, mt: 2 }} color="success">
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              {type === 'ppn' && (
                <Stack>
                  <Typography variant="h6">{selectedCustomer?.name}</Typography>
                  <Stack direction={'row'} gap={2}>
                    <Typography variant="caption">
                      NPWP: {selectedCustomer?.npwp}
                    </Typography>
                    <Typography variant="caption">
                      Telp: {selectedCustomer?.phone}
                    </Typography>
                    <Typography variant="caption">
                      {selectedCustomer?.email}
                    </Typography>
                    <Typography variant="caption">
                      {selectedCustomer?.address}
                    </Typography>
                  </Stack>
                </Stack>
              )}
              {type === 'non_ppn' && (
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography variant="h6">
                    {carType} - {carNumber}
                  </Typography>
                </Stack>
              )}
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
                    ) * (type === 'ppn' ? 0.11 : 0)
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
                    ) * (type === 'ppn' ? 1.11 : 1)
                ).toLocaleString()}
              </Typography>
            </Stack>
            <Stack gap={2}>
              <MobileDatePicker
                label="Tanggal Jatuh Tempo Pembayaran"
                sx={{ width: '100%' }}
                value={paymentDate}
                onChange={(value) => setPaymentDate(value)}
              />
              <MobileDatePicker
                label="Tanggal Pembuatan Invoice"
                sx={{ width: '100%' }}
                value={invoiceDate}
                onChange={(value) => setInvoiceDate(value)}
                defaultValue={dayjs()}
              />
              {type === 'ppn' && (
                <TextField
                  label="Kode Purchase"
                  fullWidth
                  value={purchaseCode}
                  onChange={(e) => setPurchaseCode(e.target.value)}
                />
              )}
            </Stack>
          </Stack>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ my: 5 }}
            onClick={handleCreateInvoice}
          >
            Buat Invoice
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
