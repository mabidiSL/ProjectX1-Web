// src/app/Offerlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  OfferlistState } from './offer.reducer';

export const selectDataState = createFeatureSelector<OfferlistState>('OfferList');

export const selectDataOffer = createSelector(
  selectDataState,
  (state: OfferlistState) => state?.OfferListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: OfferlistState) => state?.totalItems || 0
);
export const selectedOffer = createSelector(
    selectDataState,
    (state: OfferlistState) =>  state?.selectedOffer || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: OfferlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: OfferlistState) => state?.error || null
);
