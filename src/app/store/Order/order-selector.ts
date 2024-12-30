// src/app/Orderlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  OrderlistState } from './order.reducer';

export const selectDataState = createFeatureSelector<OrderlistState>('OrderList');

export const selectDataOrder = createSelector(
  selectDataState,
  (state: OrderlistState) => state?.OrderListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: OrderlistState) => state?.totalItems || 0
);
export const selectOrderById = createSelector(
  selectDataState,
  (state: OrderlistState) =>  state?.selectedOrder || null
  );
  
export const selectDataLoading = createSelector(
  selectDataState,
  (state: OrderlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: OrderlistState) => state?.error || null
);
