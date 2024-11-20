// src/app/Customerlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  CustomerlistState } from './customer.reducer';

export const selectDataState = createFeatureSelector<CustomerlistState>('CustomerList');

export const selectData = createSelector(
  selectDataState,
  (state: CustomerlistState) => state?.CustomerListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: CustomerlistState) => state?.totalItems || 0
);

export const selectedCustomer = createSelector(
  selectDataState,
  (state: CustomerlistState) =>  state?.selectedCustomer || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: CustomerlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: CustomerlistState) => state?.error || null
);
