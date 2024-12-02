// src/app/Loglist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  LoglistState } from './log.reducer';

export const selectDataState = createFeatureSelector<LoglistState>('LogList');

export const selectDataLog = createSelector(
  selectDataState,
  (state: LoglistState) => state?.LogListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: LoglistState) => state?.totalItems || 0
);
export const selectLogById = createSelector(
  selectDataState,
  (state: LoglistState) =>  state?.selectedLog || null
  );
  
export const selectDataLoading = createSelector(
  selectDataState,
  (state: LoglistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: LoglistState) => state?.error || null
);
