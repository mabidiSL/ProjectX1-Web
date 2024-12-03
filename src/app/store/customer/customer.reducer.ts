// src/app/Customerlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { fetchCustomerlistData, fetchCustomerlistFail, fetchCustomerlistSuccess, getCustomerById, getCustomerByIdFailure, getCustomerByIdSuccess} from './customer.action';
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
  //Handle getting Customer by id
  on(getCustomerById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle success of getting Customer by ID and store the Customer object in the state
   on(getCustomerByIdSuccess, (state, { customer }) => ({
    ...state,
    selectedCustomer: customer,
    loading: false,
    error: null
  })),
// Handle success of getting Customer by ID and store the Customer object in the state
on(getCustomerByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
);
