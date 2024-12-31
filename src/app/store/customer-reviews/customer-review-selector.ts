// src/app/CustomerReviewlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerReviewlistState } from './customer-review.reducer';

export const selectDataState = createFeatureSelector<CustomerReviewlistState>('CustomerReviewList');

export const selectData = createSelector(
  selectDataState,
  (state: CustomerReviewlistState) => state?.CustomerReviewListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: CustomerReviewlistState) => state?.totalItems || 0
);

export const selectedCustomerReview = createSelector(
  selectDataState,
  (state: CustomerReviewlistState) =>  state?.selectedCustomerReview || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: CustomerReviewlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: CustomerReviewlistState) => state?.error || null
);
