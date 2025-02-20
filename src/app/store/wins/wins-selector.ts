// src/app/merchantlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  WinsState } from './wins.reducer';

export const selectDataState = createFeatureSelector<WinsState>('WinList');

export const selectDataWin = createSelector(
  selectDataState,
  (state: WinsState) => state?.Winsdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: WinsState) => state?.totalItems || 0
);

export const selectedWin = createSelector(
    selectDataState,
    (state: WinsState) =>  state?.selectedWin || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: WinsState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: WinsState) => state?.error || null
);
