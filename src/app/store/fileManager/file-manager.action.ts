import { createAction, props } from '@ngrx/store';
import { FileManager, FileManagerListModel, StorageQuota } from './file-manager.model';

// fetch all list
export const fetchFileManagerlistData = createAction('[Data] fetch FileManagerlist', props<{ folderName: string }>());
export const fetchFileManagerlistSuccess = createAction('[Data] fetch FileManagerlist success', props<{ FileManagerListdata: FileManagerListModel }>())
export const fetchFileManagerlistFail = createAction('[Data fetch FileManagerlist failed]', props<{ error: string }>())

// Add Data
export const addFileManagerlist = createAction('[Data] Add FileManagerlist',  props<{ folderName: string}>());
export const addFileManagerlistSuccess = createAction('[Data] Add FileManagerlist Success', props<{ folderName: string }>());
export const addFileManagerlistFailure = createAction('[Data] Add FileManagerlist Failure', props<{ error: string }>());

//get FileManager by ID
export const getFileManagerById = createAction('[Data] get FileManager', props<{ FileManagerId: number }>());
export const getFileManagerByIdSuccess = createAction('[Data] get FileManager success', props<{ FileManager: FileManager }>());
export const getFileManagerByIdFailure = createAction('[Data] get FileManager Failure', props<{ error: string }>());

// // Update Data
// export const updateFileManagerlist = createAction('[Data] Update FileManagerlist', props<{ oldName: string, newName: string }>());
// export const updateFileManagerlistSuccess = createAction('[Data] Update FileManagerlist Success', props<{ folderName: string }>());
// export const updateFileManagerlistFailure = createAction('[Data] Update FileManagerlist Failure', props<{ error: string }>());

//Delete Data
export const deleteFileManagerlist = createAction('[Data] Delete FileManagerlist',   props<{ key: string; typeFile: 'file' | 'folder' }>());
export const deleteFileManagerlistSuccess = createAction('[Data] Delete FileManagerlist Success',  props<{ key: string; typeFile: 'file' | 'folder' }>());
export const deleteFileManagerlistFailure = createAction('[Data] Delete FileManagerlist Failure',  props<{ error: string }>());

//get Storage Quota
export const getStorageQuota = createAction('[Data] get Storage Quota');
export const getStorageQuotaSuccess = createAction('[Data] get Storage Quota Success', props<{ storageQuota: StorageQuota }>());
export const getStorageQuotaFailure = createAction('[Data] get Storage Quota Failure', props<{ error: string }>());