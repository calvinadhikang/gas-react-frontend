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
import { Purchase } from '../../util/dro';
import { API_URL } from '../../util/url';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import { useSetAtom } from 'jotai';
import { snackbarAtom, loadingAtom } from '../../atom/globalAtom';
import { Product } from '../../util/dro';
import { ConfirmationDialog } from '../../components/confirmation-dialog';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
interface ProductPurchaseDetail extends Product {
  selected: boolean;
  quantity: number;
  price: number;
  total: number;
}

export const PurchaseDetailPage = () => {
  const navigate = useNavigate();
  const setLoading = useSetAtom(loadingAtom);
  const setSnackbar = useSetAtom(snackbarAtom);
  const { id } = useParams<{ id: string }>();

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [products, setProducts] = useState<ProductPurchaseDetail[]>([]);
  const [openAddPaymentDialog, setOpenAddPaymentDialog] = useState(false);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/purchase/detail/${id}`);
      setPurchase(response.data.data);
      setProducts(response.data.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchase();
  }, [id]);

  const onClickSetArrived = async () => {
    try {
      await axios.post(`${API_URL}/purchase/product-arrived/${id}`);

      await fetchPurchase();
      setSnackbar('Pesanan berhasil diselesaikan');
    } catch (error) {
      console.error(error);
      setSnackbar('Gagal menyelesaikan pesanan');
    }
  };

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const onClickDeletePurchase = async () => {
    try {
      await axios.post(`${API_URL}/purchase/delete/${id}`);
      setSnackbar('Purchase berhasil dihapus');
      navigate('/purchase');
    } catch (error) {
      console.error(error);
      setSnackbar('Gagal menghapus purchase');
    }
  };

  const [openUpdatePurchaseDialog, setOpenUpdatePurchaseDialog] =
    useState(false);

  return (
    <Box sx={{ pb: 5 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <MuiLink
          component={Link}
          underline="hover"
          color="inherit"
          to="/purchase"
        >
          List Purchase
        </MuiLink>
        <Typography sx={{ color: 'text.primary' }}>{purchase?.code}</Typography>
      </Breadcrumbs>

      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mt={5}
      >
        <Typography variant="h4">Detail Purchase</Typography>
        <Button
          variant="contained"
          onClick={() => setOpenUpdatePurchaseDialog(true)}
        >
          Update Informasi
        </Button>
      </Stack>

      <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
        <Typography>Tanggal Pembuatan PO</Typography>
        <Typography>
          {dayjs(purchase?.created_at).format('DD MMMM YYYY')}
        </Typography>
      </Stack>

      <Typography variant="h6" mt={5}>
        Detail Pembayaran
      </Typography>
      <Card sx={{ p: 3, mt: 2 }}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography>Tanggal Pembayaran</Typography>
          <Typography>
            {dayjs(purchase?.payment_due_date).format('DD MMMM YYYY')}
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
            label={
              purchase?.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'
            }
            color={purchase?.payment_status === 'paid' ? 'success' : 'error'}
          />
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
          <Typography>Total Pembayaran</Typography>
          <Typography>Rp {purchase?.paid.toLocaleString()}</Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
          <Typography>Harga Total</Typography>
          <Typography>Rp {purchase?.grand_total.toLocaleString()}</Typography>
        </Stack>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setOpenAddPaymentDialog(true)}
          disabled={purchase?.payment_status === 'paid'}
        >
          Tambah Pembayaran
        </Button>
      </Card>

      <Typography variant="h6" mt={5}>
        Vendor
      </Typography>
      <Card sx={{ p: 3, mt: 2 }} color="success">
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Stack>
            <Typography variant="h6">{purchase?.vendor.name}</Typography>
            <Stack direction={'row'} gap={2}>
              <Typography variant="caption">
                NPWP: {purchase?.vendor.npwp}
              </Typography>
              <Typography variant="caption">
                Telp: {purchase?.vendor.phone}
              </Typography>
              <Typography variant="caption">
                {purchase?.vendor.email}
              </Typography>
              <Typography variant="caption">
                {purchase?.vendor.address}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <Stack direction={'row'} justifyContent={'space-between'} mt={5}>
        <Typography variant="h6">List Barang</Typography>
        <Button variant="contained">Update Barang</Button>
      </Stack>
      <Card sx={{ p: 3, mt: 2 }}>
        <Stack gap={1}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography>Jumlah Barang</Typography>
            <Typography>{purchase?.products.length}</Typography>
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography>Status Barang</Typography>
            <Chip
              label={purchase?.status === 'arrived' ? 'Datang' : 'Belum Datang'}
              color={purchase?.status === 'arrived' ? 'success' : 'default'}
            />
          </Stack>
        </Stack>
        <Button
          variant="contained"
          disabled={purchase?.status === 'arrived'}
          onClick={onClickSetArrived}
        >
          Update Status Transaksi
        </Button>
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
          <Typography>Rp {purchase?.total.toLocaleString()}</Typography>
        </Stack>
        <Stack justifyContent={'space-between'} direction={'row'}>
          <Typography>PPN (11%)</Typography>
          <Typography>
            Rp {(purchase?.ppn_value ?? 0).toLocaleString()}
          </Typography>
        </Stack>
        <Stack justifyContent={'space-between'} direction={'row'}>
          <Typography variant="h6">Harga Setelah PPN</Typography>
          <Typography variant="h6">
            Rp {purchase?.grand_total.toLocaleString()}
          </Typography>
        </Stack>
      </Stack>
      <Stack mt={5}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenConfirmationDialog(true)}
        >
          Hapus Purchase
        </Button>
      </Stack>
      <AddPaymentDialog
        open={openAddPaymentDialog}
        onClose={() => setOpenAddPaymentDialog(false)}
        purchaseId={id ?? ''}
        onSuccess={() => {
          setOpenAddPaymentDialog(false);
          fetchPurchase();
        }}
      />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={onClickDeletePurchase}
        title="Konfirmasi"
        message="Apakah anda yakin ingin menghapus Purchase ini?"
      />
      <UpdatePurchaseDialog
        open={openUpdatePurchaseDialog}
        onClose={() => setOpenUpdatePurchaseDialog(false)}
        purchaseId={id}
        refetch={fetchPurchase}
        purchase={purchase}
      />
    </Box>
  );
};

const AddPaymentDialog = ({
  open,
  onClose,
  purchaseId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  purchaseId: string | undefined;
  onSuccess: () => void;
}) => {
  const setSnackbar = useSetAtom(snackbarAtom);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  const handleAddPayment = async () => {
    try {
      await axios.post(`${API_URL}/purchase/add-payment/${purchaseId}`, {
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

  if (!purchaseId) {
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

const UpdatePurchaseDialog = ({
  open,
  onClose,
  purchaseId,
  refetch,
  purchase,
}: {
  open: boolean;
  onClose: () => void;
  purchaseId: string | undefined;
  refetch: () => Promise<void>;
  purchase: Purchase | null;
}) => {
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(null);
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(null);

  const handleUpdatePurchase = async () => {
    try {
      await axios.post(`${API_URL}/purchase/update/${purchaseId}`, {
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
    if (purchase) {
      setPaymentDate(dayjs(purchase.payment_due_date));
      setPurchaseDate(dayjs(purchase.created_at));
    }
  }, [purchase]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Informasi</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={2}>
          <MobileDatePicker
            label="Tanggal Pembuatan PO"
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
