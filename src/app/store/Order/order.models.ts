/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaginateModel } from "src/app/core/interfaces/core.interface";

export interface OrderListModel  extends PaginateModel
{   
    data?: Order[]; 
}
export class Order{
  id?: number ;
  user_id?: number;
  codeCoupon?: string;
  qrCode?: string;
  nbr_of_use_left?: number;
  items?: any[];
  order_id?: number;
  offer_id?: number;
  unit_amount?: number;
  status?: string;
  users?: any;
  offers?: any;
}


