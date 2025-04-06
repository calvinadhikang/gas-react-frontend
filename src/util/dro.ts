export interface Product {
  id: number;
  code: string | null;
  name: string;
  price: number;
  stock: number;
  description: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  npwp: string;
  email: string;
}

export interface Vendor {
  id: number;
  name: string;
  phone: string;
  address: string;
  npwp: string;
  email: string;
}

export interface Purchase {
  id: number;
  vendor: Vendor;
  vendor_id: string;
  code: string;
  status: string;
  payment_status: string;
  total: number;
  paid: number;
  ppn: number;
  ppn_value: number;
  grand_total: number;
  description: string;
  created_by: string | null;
  updated_by: string | null;
  payment_due_date: Date;
  created_at: Date;
  updated_at: Date;
  products: Product[];
}

export interface Invoice {
  id: number;
  type: string;
  purchase_code: string;
  customer: Customer;
  customer_id: string;
  car_type: string;
  car_number: string;
  code: string;
  status: string;
  payment_status: string;
  total: number;
  paid: number;
  ppn: number;
  ppn_value: number;
  grand_total: number;
  description: string;
  created_by: string | null;
  updated_by: string | null;
  payment_due_date: Date;
  created_at: Date;
  updated_at: Date;
  products: Product[];
}

export interface Inventory {
  id: number;
  stock: number;
  stock_used: number;
  base_price: number;
  type: string;
  description: string;
  reference_id: number;
  created_at: string;
  updated_at: Date;
}
