// src/app/SpecialDaylist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  SpecialDaylistState } from './special.reducer';

export const selectDataState = createFeatureSelector<SpecialDaylistState>('SpecialDayList');

export const selectDataSpecialDay = createSelector(
  selectDataState,
  (state: SpecialDaylistState) => state?.SpecialDayListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: SpecialDaylistState) => state?.totalItems || 0
);
export const selectedSpecialDay = createSelector(
    selectDataState,
    (state: SpecialDaylistState) =>  state?.selectedSpecialDay || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: SpecialDaylistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: SpecialDaylistState) => state?.error || null
);
