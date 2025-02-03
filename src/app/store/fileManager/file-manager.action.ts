import { createAction, props } from '@ngrx/store';
import { FileManager, FileManagerListModel, StorageQuota } from './file-manager.model';

// fetch all list
export const fetchFileManagerlistData = createAction('[Data] fetch FileManagerlist', props<{ folderId: number  }>());
export const fetchFileManagerlistSuccess = createAction('[Data] fetch FileManagerlist success', props<{ FileManagerListdata: FileManagerListModel }>())
export const fetchFileManagerlistFail = createAction('[Data fetch FileManagerlist failed]', props<{ error: string }>())
// fetch all list
export const fetchRecentFilesData = createAction('[Data] fetch Recent Files', props<{ limit: number  }>());
export const fetchRecentFilesSuccess = createAction('[Data] fetch Recent Files success', props<{ lastUpdatedFiles: any[] }>())
export const fetchRecentFilesFailure = createAction('[Data fetch Recent Files failed]', props<{ error: string }>())
// Add Data
export const addFileManagerlist = createAction('[Data] Add FileManagerlist',  props<{ folderName: string, name: string}>());
export const addFileManagerlistSuccess = createAction('[Data] Add FileManagerlist Success', props<{ folderName: string, id: number }>());
export const addFileManagerlistFailure = createAction('[Data] Add FileManagerlist Failure', props<{ error: string }>());
//RenameFileManager
export const renameFileManager = createAction('[Data] Rename FileManager',  props<{ id: number, new_name: string , file_type: string }>());
export const renameFileManagerSuccess = createAction('[Data] Rename FileManager Success', props<{ id: number, new_name: string, file_type: string}>());
export const renameFileManagerFailure = createAction('[Data] Rename FileManager Failure', props<{ error: string }>());
//Add File 
export const addFile = createAction('[Data] Add File',  props<{ formData: any, file_type: string }>());
export const addFileSuccess = createAction('[Data] Add File Success', props<{ formData: any[], file_type: string}>());
export const addFileFailure = createAction('[Data] Add File Failure', props<{ error: string }>());

//get FileManager by ID
export const getFileManagerById = createAction('[Data] get FileManager', props<{ FileManagerId: number }>());
export const getFileManagerByIdSuccess = createAction('[Data] get FileManager success', props<{ FileManager: FileManager }>());
export const getFileManagerByIdFailure = createAction('[Data] get FileManager Failure', props<{ error: string }>());

// // Update Data
// export const updateFileManagerlist = createAction('[Data] Update FileManagerlist', props<{ oldName: string, newName: string }>());
// export const updateFileManagerlistSuccess = createAction('[Data] Update FileManagerlist Success', props<{ folderName: string }>());
// export const updateFileManagerlistFailure = createAction('[Data] Update FileManagerlist Failure', props<{ error: string }>());

//Delete Data
export const deleteFileManagerlist = createAction('[Data] Delete FileManagerlist',   props<{ id: number, typeFile: 'file' | 'folder' }>());
export const deleteFileManagerlistSuccess = createAction('[Data] Delete FileManagerlist Success',  props<{ id:number, typeFile: 'file' | 'folder' }>());
export const deleteFileManagerlistFailure = createAction('[Data] Delete FileManagerlist Failure',  props<{ error: string }>());

//get Storage Quota
export const getStorageQuota = createAction('[Data] get Storage Quota');
export const getStorageQuotaSuccess = createAction('[Data] get Storage Quota Success', props<{ storageQuota: StorageQuota }>());
export const getStorageQuotaFailure = createAction('[Data] get Storage Quota Failure', props<{ error: string }>());