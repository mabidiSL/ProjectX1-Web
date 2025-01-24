/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/FileManagerlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addFileManagerlist, addFileManagerlistFailure, addFileManagerlistSuccess, /*deleteFileManagerlist, deleteFileManagerlistFailure, deleteFileManagerlistSuccess,*/ fetchFileManagerlistData, fetchFileManagerlistFail, fetchFileManagerlistSuccess, getFileManagerById, getFileManagerByIdFailure, getFileManagerByIdSuccess  /* updateFileManagerlist, updateFileManagerlistFailure, updateFileManagerlistSuccess */} from './file-manager.action';
import { FileManager, Folder } from './file-manager.model';

export interface FileManagerlistState {
  FileManagerListdata: FileManager;
  currentFolder: string;
  rootFolder: string;
  totalItems: number;
  selectedFileManager: Folder | any;
  loading: boolean;
  error: string;
}

export const initialState: FileManagerlistState = {
  FileManagerListdata: null,
  currentFolder: null,
  rootFolder: null,
  totalItems: 0,
  selectedFileManager: null,
  loading: false,
  error: null,
};

export const FileManagerListReducer = createReducer(
  initialState,
  on(fetchFileManagerlistData, (state, { folderName }) => ({
    ...state,
    currentPage: folderName,
    loading: true,
    error: null
  })),
  on(fetchFileManagerlistSuccess, (state, { FileManagerListdata }) => ({
    ...state,
    FileManagerListdata: 
    {
      folders: FileManagerListdata.result?.folders, // Map the folders from backend response
      files: FileManagerListdata.result?.files, // Map the files from backend response
    },
    rootFolder: FileManagerListdata.result?.folders? FileManagerListdata.result?.folders?.[0]?.split('/')[0]: 'MyFiles',
    totalItems: FileManagerListdata.totalItems,
    loading: false,
    error: null 

  })),
  on(fetchFileManagerlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding FileManager 
   on(addFileManagerlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding FileManager success
  on(addFileManagerlistSuccess, (state, { folderName }) => ({
    ...state,
    FileManagerListdata: {
      ...state.FileManagerListdata,
      folders: [...state.FileManagerListdata.folders, folderName], // Add new folder
    },
    rootFolder: folderName,
    loading: false,
    error: null

  })),
  //Handle adding FileManager failure
  on(addFileManagerlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
    //Handle getting FileManager by id
    on(getFileManagerById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting FileManager by ID and store the FileManager object in the state
   on(getFileManagerByIdSuccess, (state, { FileManager }) => ({
    ...state,
    selectedFileManager: FileManager,
    loading: false,
    error: null

  })),
// Handle failure of getting FileManager by ID and store the FileManager object in the state
on(getFileManagerByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
// // Handle updating Coupon list
// on(updateFileManagerlist, (state) => ({
//   ...state,
//   loading: true,
//   error: null 
// })),
//  // Handle updating FileManager status
//   on(updateFileManagerlistSuccess, (state, { updatedData }) => {
//    const FileManagerListUpdated = updatedData
//    //state.FileManagerListdata.map(item => item.id === updatedData.id ? updatedData : item );
//    return {
//       ...state,
//       FileManagerListdata: FileManagerListUpdated,
//       loading: false,
//       error: null 
//     };
//   }),
//    // Handle updating FileManager failure
//    on(updateFileManagerlistFailure, (state, { error }) => ({
//     ...state,
//     error,
//     loading: false 
//   })),
//   // Handle deleting FileManager 
//   on(deleteFileManagerlist, (state) => ({
//     ...state,
//     loading: true,
//     error: null 
//   })),
//   // Handle the success of deleting a FileManager
//   on(deleteFileManagerlistSuccess, (state, { FileManagerId }) => {
//     const updatedFileManagerList = FileManagerId
//     //state.FileManagerListdata.filter(FileManager => FileManager.id !== FileManagerId);
//     return { 
//     ...state,
//     FileManagerListdata: updatedFileManagerList,
//     loading: false,
//     error: null};
//   }),
//   // Handle failure of deleting a FileManager
//   on(deleteFileManagerlistFailure, (state, { error }) => ({
//     ...state,
//     error,
//     loading: false
//   }))
 );
