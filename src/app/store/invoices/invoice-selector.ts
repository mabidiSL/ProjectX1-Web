// src/app/Invoicelist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  InvoicelistState } from './invoice.reducer';

export const selectDataState = createFeatureSelector<InvoicelistState>('InvoiceList');

export const selectDataInvoice = createSelector(
  selectDataState,
  (state: InvoicelistState) => state?.InvoiceListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: InvoicelistState) => state?.totalItems || 0
);
export const selectInvoiceById = createSelector(
  selectDataState,
  (state: InvoicelistState) =>  state?.selectedInvoice || null
  );
  
export const selectDataLoading = createSelector(
  selectDataState,
  (state: InvoicelistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: InvoicelistState) => state?.error || null
);
