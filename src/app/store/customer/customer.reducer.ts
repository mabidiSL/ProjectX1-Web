// src/app/Customerlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { fetchCustomerlistData, fetchCustomerlistFail, fetchCustomerlistSuccess} from './customer.action';
import { Customer } from './customer.model';

export interface CustomerlistState {
  CustomerListdata: Customer[];
  totalItems: number;
  selectedCustomer: Customer;
  loading: boolean;
  error: string;
}

export const initialState: CustomerlistState = {
  CustomerListdata: [],
  totalItems: 0,
  selectedCustomer: null,
  loading: false,
  error: null,
};

export const CustomerListReducer = createReducer(
  initialState,
  on(fetchCustomerlistData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchCustomerlistSuccess, (state, { CustomerListdata }) => ({
    ...state,
    CustomerListdata: CustomerListdata.data,
    totalItems:CustomerListdata.totalItems,
    loading: false,
    error: null
  })),
  on(fetchCustomerlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
 
);
