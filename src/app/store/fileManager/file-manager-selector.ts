// src/app/FileManagerlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  FileManagerlistState } from './file-manager.reducer';

export const selectDataState = createFeatureSelector<FileManagerlistState>('FileManagerList');

export const selectDataFileManager = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.FileManagerListdata || null
);
export const selectRecentFiles = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.lastUpdatedFiles || null
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.totalItems || 0
);
export const selectedFileManager = createSelector(
    selectDataState,
    (state: FileManagerlistState) =>  state?.selectedFileManager || null
);
export const selectStorageQuota = createSelector(
    selectDataState,
    (state: FileManagerlistState) =>  state?.storageQuota || null
);
export const selectDataRootFolder = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.rootFolder || 'MyFiles'
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: FileManagerlistState) => state?.error || null
);
