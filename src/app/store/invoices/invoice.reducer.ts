// src/app/Invoicelist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  deleteInvoicelist, deleteInvoicelistFailure, deleteInvoicelistSuccess, fetchInvoicelistData, fetchInvoicelistFail, fetchInvoicelistSuccess, getInvoiceById, getInvoiceByIdFailure, getInvoiceByIdSuccess } from './invoice.actions';
import { Invoice } from './invoice.models';

export interface InvoicelistState {
  InvoiceListdata: Invoice[];
  currentPage: number;
  totalItems: number;
  selectedInvoice: Invoice;
  loading: boolean;
  error: string;
}

export const initialState: InvoicelistState = {
  InvoiceListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedInvoice: null,
  loading: false,
  error: null,
};

export const InvoiceListReducer = createReducer(
  initialState,
  on(fetchInvoicelistData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchInvoicelistSuccess, (state, { InvoiceListdata }) => ({
    ...state,
    InvoiceListdata: InvoiceListdata.data,
    totalItems:InvoiceListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchInvoicelistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  
    //Handle getting Invoice by id
    on(getInvoiceById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting Invoice by ID and store the Invoice object in the state
   on(getInvoiceByIdSuccess, (state, { Invoice }) => ({
    ...state,
    selectedInvoice: Invoice,
    loading: false,
    error: null 

  })),
 // Handle success of getting Invoice by ID and store the Invoice object in the state
 on(getInvoiceByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),

  // Handle deleting Invoice 
  on(deleteInvoicelist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Invoice
  on(deleteInvoicelistSuccess, (state, { InvoiceId }) => {
    const updatedInvoiceList = state.InvoiceListdata.filter(Invoice => Invoice.id !== InvoiceId);
    return { 
    ...state,
    InvoiceListdata: updatedInvoiceList,
    loading: false,
    error: null
  };
  }),
  // Handle failure of deleting a Invoice
  on(deleteInvoicelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
