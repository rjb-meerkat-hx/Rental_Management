
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum RentalStatus {
  QUOTATION = 'Quotation',
  RESERVED = 'Reserved',
  PICKED_UP = 'Picked Up',
  RETURNED = 'Returned',
  CANCELLED = 'Cancelled'
}

export enum InvoiceStatus {
  NOTHING_TO_INVOICE = 'Nothing to Invoice',
  TO_INVOICE = 'To Invoice',
  FULLY_INVOICED = 'Fully Invoiced'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  stock: number;
  available: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  subtotal: number;
}

export interface RentalOrder {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  date: string;
  rentalPeriod: {
    start: string;
    end: string;
  };
  status: RentalStatus;
  invoiceStatus: InvoiceStatus;
  items: OrderItem[];
  total: number;
  taxTotal: number;
  untaxedTotal: number;
}
