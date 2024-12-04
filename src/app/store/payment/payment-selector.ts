// src/app/Paymentlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  PaymentlistState } from './payment.reducer';

export const selectDataState = createFeatureSelector<PaymentlistState>('PaymentList');

export const selectData = createSelector(
  selectDataState,
  (state: PaymentlistState) => state?.PaymentListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: PaymentlistState) => state?.totalItems || 0
);
export const selectApprovalData = createSelector(
  selectDataState,
  (state: PaymentlistState) => state?.PaymentListdata.filter(coupon => coupon.status === 'pending') || []
);

export const selectedPayment = createSelector(
    selectDataState,
    (state: PaymentlistState) =>  state?.selectedPayment || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: PaymentlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: PaymentlistState) => state?.error || null
);
