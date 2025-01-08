/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaginateModel } from "src/app/core/interfaces/core.interface";

export interface InvoiceListModel  extends PaginateModel
{   
    data?: Invoice[]; 
}
export class Invoice{
  id?: number ;
  user_id?: number;
  codeCoupon?: string;
  qrCode?: string;
  nbr_of_use_left?: number;
  items?: any[];
  user?: any;
  order_id?: number;
  companies: any;
  offer_id?: number;
  unit_amount?: number;
  status?: string;
  users?: any;
  offers?: any;
  createdAt?: any;
  totalAmount?: any;
  pdf?: string;
  orderItems?: any[];
}


