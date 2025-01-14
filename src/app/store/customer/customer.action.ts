import { createAction, props } from '@ngrx/store';
import { Customer, CustomerListModel } from './customer.model';

// fetch all list
export const fetchCustomerlistData = createAction('[Data] fetch Customerlist', props<{ page?: number; itemsPerPage?: number, query?:string,role?: number, createdBy?:string, status?: string}>());
export const fetchCustomerlistSuccess = createAction('[Data] fetch Customerlist success', props<{ CustomerListdata: CustomerListModel}>())
export const fetchCustomerlistFail = createAction('[Data fetch Customerlist failed]', props<{ error: string }>())

//get Customer by ID
export const getCustomerById = createAction('[Data] get Customer', props<{ customerId: number }>());
export const getCustomerByIdSuccess = createAction('[Data] get Customer success', props<{ customer: Customer }>());
export const getCustomerByIdFailure = createAction('[Data] get Customer Failure', props<{ error: string }>());
