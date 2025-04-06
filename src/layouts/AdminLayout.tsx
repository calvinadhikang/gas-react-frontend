import {
  AppBar,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Typography,
  Divider,
  Snackbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemText from '@mui/material/ListItemText';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import DiscountIcon from '@mui/icons-material/Discount';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, Outlet } from 'react-router';
import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadingAtom, snackbarAtom } from '../atom/globalAtom';
import { isEmpty } from 'lodash';

export const AdminLayout = () => {
  const loading = useAtomValue(loadingAtom);
  const [snackbar, setSnackbar] = useAtom(snackbarAtom);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <List>
        {AdminMasterLinks.map((item) => (
          <MuiLink
            key={item.link}
            component={Link}
            to={item.link}
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </MuiLink>
        ))}
      </List>
      <Divider />
      <List>
        {AdminTransactionLinks.map((item) => (
          <MuiLink
            key={item.link}
            component={Link}
            to={item.link}
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </MuiLink>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      <Backdrop
        open={loading}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {DrawerList}
      </Drawer>
      <AppBar position="static" sx={{ m: 0, p: 0 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            GAS
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth={'xl'} sx={{ mt: 5 }}>
        <Outlet />
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={!isEmpty(snackbar)}
        message={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
      />
    </Box>
  );
};

const AdminMasterLinks = [
  { link: 'product', text: 'Produk', icon: <DiscountIcon /> },
  { link: 'customer', text: 'Customer', icon: <GroupIcon /> },
  { link: 'vendor', text: 'Vendor', icon: <BusinessIcon /> },
];

const AdminTransactionLinks = [
  { link: 'invoice', text: 'Invoice', icon: <PointOfSaleIcon /> },
  { link: 'purchase', text: 'Purchase', icon: <ShoppingCartIcon /> },
];
