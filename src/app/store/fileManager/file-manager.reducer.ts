// src/app/FileManagerlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addFileManagerlist, addFileManagerlistFailure, addFileManagerlistSuccess, deleteFileManagerlist, deleteFileManagerlistFailure, deleteFileManagerlistSuccess, fetchFileManagerlistData, fetchFileManagerlistFail, fetchFileManagerlistSuccess, getFileManagerById, getFileManagerByIdFailure, getFileManagerByIdSuccess, updateFileManagerlist, updateFileManagerlistFailure, updateFileManagerlistSuccess } from './file-manager.action';
import { FileManager } from './file-manager.model';

export interface FileManagerlistState {
  FileManagerListdata: FileManager[];
  currentPage: number;
  totalItems: number;
  selectedFileManager: FileManager;
  loading: boolean;
  error: string;
}

export const initialState: FileManagerlistState = {
  FileManagerListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedFileManager: null,
  loading: false,
  error: null,
};

export const FileManagerListReducer = createReducer(
  initialState,
  on(fetchFileManagerlistData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchFileManagerlistSuccess, (state, { FileManagerListdata }) => ({
    ...state,
    FileManagerListdata: FileManagerListdata.data,
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
  on(addFileManagerlistSuccess, (state, { newData }) => ({
    ...state,
    FileManagerListdata: [newData,...state.FileManagerListdata ],
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
// Handle updating Coupon list
on(updateFileManagerlist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
 // Handle updating FileManager status
  on(updateFileManagerlistSuccess, (state, { updatedData }) => {
   const FileManagerListUpdated = state.FileManagerListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      FileManagerListdata: FileManagerListUpdated,
      loading: false,
      error: null 
    };
  }),
   // Handle updating FileManager failure
   on(updateFileManagerlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting FileManager 
  on(deleteFileManagerlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a FileManager
  on(deleteFileManagerlistSuccess, (state, { FileManagerId }) => {
    const updatedFileManagerList = state.FileManagerListdata.filter(FileManager => FileManager.id !== FileManagerId);
    return { 
    ...state,
    FileManagerListdata: updatedFileManagerList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a FileManager
  on(deleteFileManagerlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
