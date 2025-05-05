import {
  Box,
  Breadcrumbs,
  Stack,
  Typography,
  Link as MuiLink,
  Card,
  Chip,
  Button,
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { Invoice, Product } from '../../util/dro';
import { API_URL } from '../../util/url';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import { useSetAtom } from 'jotai';
import { loadingAtom, snackbarAtom } from '../../atom/globalAtom';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ConfirmationDialog } from '../../components/confirmation-dialog';
import { UpdateInvoiceProductsDialog } from '../../components/update-invoice-products-dialog';
interface ProductPurchaseDetail extends Product {
  selected: boolean;
  quantity: number;
  price: number;
  total: number;
}

export const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const setSnackbar = useSetAtom(snackbarAtom);
  const setLoading = useSetAtom(loadingAtom);
  const { id } = useParams<{ id: string }>();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [products, setProducts] = useState<ProductPurchaseDetail[]>([]);
  const [openAddPaymentDialog, setOpenAddPaymentDialog] = useState(false);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/invoice/detail/${id}`);
      setInvoice(response.data.data);
      setProducts(response.data.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const onClickSetFinished = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/invoice/transaction-finished/${id}`);

      await fetchInvoice();
      setSnackbar('Pesanan berhasil diselesaikan');
    } catch (error) {
      console.error(error);
      setSnackbar('Gagal menyelesaikan pesanan');
    } finally {
      setLoading(false);
    }
  };

  const onClickResetFinished = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/invoice/transaction-unfinished/${id}`);

      await fetchInvoice();
      setSnackbar('Pesanan berhasil di reset');
    } catch (error) {
      console.error(error);
      setSnackbar('Gagal mereset pesanan');
    } finally {
      setLoading(false);
    }
  };

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const onClickDeleteInvoice = async () => {
    try {
      await axios.post(`${API_URL}/invoice/delete/${id}`);
      setSnackbar('Invoice berhasil dihapus');
      navigate('/invoice');
    } catch (error) {
      console.error(error);
      setSnackbar('Gagal menghapus invoice');
    }
  };

  const [openUpdateInvoiceDialog, setOpenUpdateInvoiceDialog] = useState(false);
  const [openUpdateInvoiceProductsDialog, setOpenUpdateInvoiceProductsDialog] =
    useState(false);

  return (
    <Box sx={{ pb: 5 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <MuiLink
          component={Link}
          underline="hover"
          color="inherit"
          to="/invoice"
        >
          List Invoice
        </MuiLink>
        <Typography sx={{ color: 'text.primary' }}>{invoice?.code}</Typography>
      </Breadcrumbs>

      <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
        <Typography variant="h4">Detail Invoice</Typography>
        <Button
          variant="contained"
          onClick={() => setOpenUpdateInvoiceDialog(true)}
        >
          Update Informasi
        </Button>
      </Stack>

      <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
        <Typography>Tanggal Pembuatan Invoice</Typography>
        <Typography>
          {dayjs(invoice?.created_at).format('DD MMMM YYYY')}
        </Typography>
      </Stack>
      <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
        <Typography>Nomor Invoice</Typography>
        <Typography>{invoice?.purchase_code}</Typography>
      </Stack>

      <Typography variant="h6" mt={5}>
        Detail Pembayaran
      </Typography>
      <Card sx={{ p: 3, mt: 2 }}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography>Tanggal Pembayaran</Typography>
          <Typography>
            {dayjs(invoice?.payment_due_date).format('DD MMMM YYYY')}
          </Typography>
        </Stack>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mt={2}
        >
          <Typography>Status Pembayaran</Typography>
          <Chip
            label={invoice?.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'}
            color={invoice?.payment_status === 'paid' ? 'success' : 'error'}
          />
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
          <Typography>Total Pembayaran</Typography>
          <Typography>Rp {invoice?.paid.toLocaleString()}</Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
          <Typography>Harga Total</Typography>
          <Typography>Rp {invoice?.grand_total.toLocaleString()}</Typography>
        </Stack>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setOpenAddPaymentDialog(true)}
          disabled={invoice?.payment_status === 'paid'}
        >
          Tambah Pembayaran
        </Button>
      </Card>

      <Typography variant="h6" mt={5}>
        Customer
      </Typography>
      <Card sx={{ p: 3, mt: 2 }} color="success">
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          {invoice?.type === 'ppn' && (
            <Stack>
              <Typography variant="h6">{invoice?.customer.name}</Typography>
              <Stack direction={'row'} gap={2}>
                <Typography variant="caption">
                  NPWP: {invoice?.customer.npwp}
                </Typography>
                <Typography variant="caption">
                  Telp: {invoice?.customer.phone}
                </Typography>
                <Typography variant="caption">
                  {invoice?.customer.email}
                </Typography>
                <Typography variant="caption">
                  {invoice?.customer.address}
                </Typography>
              </Stack>
            </Stack>
          )}
          {invoice?.type === 'non_ppn' && (
            <Typography variant="h6">
              {invoice?.car_number} - {invoice?.car_type}
            </Typography>
          )}
        </Stack>
      </Card>

      <Stack direction={'row'} justifyContent={'space-between'} mt={5}>
        <Typography variant="h6">List Barang</Typography>
        <Button
          variant="contained"
          disabled={invoice?.status === 'finished'}
          onClick={() => setOpenUpdateInvoiceProductsDialog(true)}
        >
          Update Barang
        </Button>
      </Stack>
      <Card sx={{ p: 3, mt: 2 }}>
        <Stack gap={1}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography>Jumlah Barang</Typography>
            <Typography>{invoice?.products.length}</Typography>
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography>Status</Typography>
            <Chip
              label={
                invoice?.status === 'finished' ? 'Selesai' : 'Belum Selesai'
              }
              color={invoice?.status === 'finished' ? 'success' : 'default'}
            />
          </Stack>
        </Stack>
        <Stack direction={'row'} justifyContent={'flex-end'} mt={2}>
          {invoice?.status === 'finished' ? (
            <Button variant="contained" onClick={onClickResetFinished}>
              Reset Status Transaksi
            </Button>
          ) : (
            <Button variant="contained" onClick={onClickSetFinished}>
              Update Status Transaksi
            </Button>
          )}
        </Stack>
      </Card>
      <DataGrid
        rows={products}
        columns={renderProductDataGridColumns()}
        sx={{ mt: 2 }}
        rowHeight={58}
      />
      <Typography variant="h6" mt={5}>
        Rincian Biaya
      </Typography>
      <Stack gap={1} mt={2}>
        <Stack justifyContent={'space-between'} direction={'row'}>
          <Typography>Harga Barang</Typography>
          <Typography>Rp {invoice?.total.toLocaleString()}</Typography>
        </Stack>
        <Stack justifyContent={'space-between'} direction={'row'}>
          <Typography>PPN (11%)</Typography>
          <Typography>
            Rp {(invoice?.ppn_value ?? 0).toLocaleString()}
          </Typography>
        </Stack>
        <Stack justifyContent={'space-between'} direction={'row'}>
          <Typography variant="h6">Harga Setelah PPN</Typography>
          <Typography variant="h6">
            Rp {invoice?.grand_total.toLocaleString()}
          </Typography>
        </Stack>
      </Stack>
      <Stack mt={5}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenConfirmationDialog(true)}
        >
          Hapus Invoice
        </Button>
      </Stack>
      <AddPaymentDialog
        open={openAddPaymentDialog}
        onClose={() => setOpenAddPaymentDialog(false)}
        invoiceId={id ?? ''}
        onSuccess={() => {
          setOpenAddPaymentDialog(false);
          fetchInvoice();
        }}
      />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={onClickDeleteInvoice}
        title="Konfirmasi"
        message="Apakah anda yakin ingin menghapus Invoice ini?"
      />
      <UpdateInvoiceDialog
        open={openUpdateInvoiceDialog}
        onClose={() => setOpenUpdateInvoiceDialog(false)}
        invoiceId={id ?? ''}
        refetch={fetchInvoice}
        invoice={invoice}
      />
      <UpdateInvoiceProductsDialog
        open={openUpdateInvoiceProductsDialog}
        onClose={() => setOpenUpdateInvoiceProductsDialog(false)}
        invoiceId={id ?? ''}
        refetch={fetchInvoice}
      />
    </Box>
  );
};

const AddPaymentDialog = ({
  open,
  onClose,
  invoiceId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  invoiceId: string | undefined;
  onSuccess: () => void;
}) => {
  const setSnackbar = useSetAtom(snackbarAtom);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  const handleAddPayment = async () => {
    try {
      await axios.post(`${API_URL}/invoice/add-payment/${invoiceId}`, {
        amount,
        description,
      });
      await onSuccess();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        setSnackbar(error.response.data.message);
      } else {
        setSnackbar('An unexpected error occurred');
      }
    }
  };

  if (!invoiceId) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tambah Pembayaran</DialogTitle>
      <DialogContent>
        <Stack>
          <TextField
            label="Jumlah Pembayaran"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            sx={{ my: 2 }}
          />
          <TextField
            label="Keterangan"
            value={description}
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddPayment} sx={{ mt: 2 }}>
            Tambah Pembayaran
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const renderProductDataGridColumns = () => {
  return [
    { field: 'name', headerName: 'Nama Barang', flex: 1 },
    { field: 'quantity', headerName: 'Jumlah', flex: 1 },
    {
      field: 'price',
      headerName: 'Harga Beli',
      flex: 1,
      renderCell: ({ row }: { row: ProductPurchaseDetail }) => {
        return `Rp ${row.price.toLocaleString()}`;
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      renderCell: ({ row }: { row: ProductPurchaseDetail }) => {
        return `Rp ${row.total.toLocaleString()}`;
      },
    },
  ];
};

const UpdateInvoiceDialog = ({
  open,
  onClose,
  invoiceId,
  refetch,
  invoice,
}: {
  open: boolean;
  onClose: () => void;
  invoiceId: string | undefined;
  refetch: () => Promise<void>;
  invoice: Invoice | null;
}) => {
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(null);
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(null);

  const handleUpdatePurchase = async () => {
    try {
      await axios.post(`${API_URL}/invoice/update/${invoiceId}`, {
        payment_due_date: paymentDate?.format('YYYY-MM-DD'),
        created_at: purchaseDate?.format('YYYY-MM-DD'),
      });
      await refetch();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (invoice) {
      setPaymentDate(dayjs(invoice.payment_due_date));
      setPurchaseDate(dayjs(invoice.created_at));
    }
  }, [invoice]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Informasi</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={2}>
          <MobileDatePicker
            label="Tanggal Pembuatan Invoice"
            sx={{ width: '100%' }}
            value={purchaseDate}
            onChange={(value) => setPurchaseDate(value)}
            defaultValue={dayjs()}
          />
          <MobileDatePicker
            label="Tanggal Jatuh Tempo Pembayaran"
            sx={{ width: '100%' }}
            value={paymentDate}
            onChange={(value) => setPaymentDate(value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Batal
        </Button>
        <Button variant="contained" onClick={handleUpdatePurchase}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
