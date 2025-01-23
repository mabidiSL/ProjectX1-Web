// src/app/FileManagerlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  FileManagerlistState } from './file-manager.reducer';

export const selectDataState = createFeatureSelector<FileManagerlistState>('FileManagerList');

export const selectDataFileManager = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.FileManagerListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.totalItems || 0
);
export const selectedFileManager = createSelector(
    selectDataState,
    (state: FileManagerlistState) =>  state?.selectedFileManager || null
);
export const selectDataLoadingSpecial = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.error || null
);
