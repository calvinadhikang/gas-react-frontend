import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Login } from './pages/Login.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';
import { ProductPage } from './pages/Product/ProductPage.tsx';
import { CustomerPage } from './pages/Customer/CustomerPage.tsx';
import { CustomerDetailPage } from './pages/Customer/CustomerDetailPage.tsx';
import { ProductDetailPage } from './pages/Product/ProductDetailPage.tsx';
import { VendorPage } from './pages/Vendor/VendorPage.tsx';
import { VendorDetailPage } from './pages/Vendor/VendorDetailPage.tsx';
import { PurchasePage } from './pages/Purchase/PurchasePage.tsx';
import { AddPurchasePage } from './pages/Purchase/AddPurchasePage.tsx';
import { PurchaseDetailPage } from './pages/Purchase/PurchaseDetailPage.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MainPage } from './pages/Main.tsx';
import { Error404Page } from './pages/error/404.js';
import { InvoicePage } from './pages/Invoice/InvoicePage.tsx';
import { AddInvoicePage } from './pages/Invoice/AddInvoicePage.tsx';
import { InvoiceDetailPage } from './pages/Invoice/InvoiceDetailPage.tsx';
import 'dayjs/locale/id';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/product/detail/:id" element={<ProductDetailPage />} />

            <Route path="/customer" element={<CustomerPage />} />
            <Route
              path="/customer/detail/:id"
              element={<CustomerDetailPage />}
            />

            <Route path="/vendor" element={<VendorPage />} />
            <Route path="/vendor/detail/:id" element={<VendorDetailPage />} />

            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/purchase/add" element={<AddPurchasePage />} />
            <Route
              path="/purchase/detail/:id"
              element={<PurchaseDetailPage />}
            />

            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/invoice/add" element={<AddInvoicePage />} />
            <Route path="/invoice/detail/:id" element={<InvoiceDetailPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  </StrictMode>
);
