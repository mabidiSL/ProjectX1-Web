import { createAction, props } from '@ngrx/store';
import { CustomerListModel } from './customer.model';

// fetch all list
export const fetchCustomerlistData = createAction('[Data] fetch Customerlist', props<{ page?: number; itemsPerPage?: number, role?: number}>());
export const fetchCustomerlistSuccess = createAction('[Data] fetch Customerlist success', props<{ CustomerListdata: CustomerListModel}>())
export const fetchCustomerlistFail = createAction('[Data fetch Customerlist failed]', props<{ error: string }>())

