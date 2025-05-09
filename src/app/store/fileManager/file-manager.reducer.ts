/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/FileManagerlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addFileManagerlist, addFileManagerlistFailure, addFileManagerlistSuccess, deleteFileManagerlistFailure, deleteFileManagerlist, deleteFileManagerlistSuccess, /*deleteFileManagerlist, deleteFileManagerlistFailure, deleteFileManagerlistSuccess,*/ fetchFileManagerlistData, fetchFileManagerlistFail, fetchFileManagerlistSuccess, getFileManagerById, getFileManagerByIdFailure, getFileManagerByIdSuccess, getStorageQuota, getStorageQuotaSuccess, getStorageQuotaFailure, addFile, addFileFailure, addFileSuccess, renameFileManager, renameFileManagerSuccess, renameFileManagerFailure, fetchRecentFilesData, fetchRecentFilesFailure, fetchRecentFilesSuccess,  /* updateFileManagerlist, updateFileManagerlistFailure, updateFileManagerlistSuccess */
/*updateFileManagerlist,
updateFileManagerlistFailure,
updateFileManagerlistSuccess*/
} from './file-manager.action';
import { FileManager, Folder, StorageQuota } from './file-manager.model';

export interface FileManagerlistState {
  FileManagerListdata: FileManager;
  currentFolder: number;
  rootFolder: string;
  totalItems: number;
  storageQuota: StorageQuota;
  lastUpdatedFiles: any[];
  selectedFileManager: Folder | any;
  loading: boolean;
  error: string;
}

export const initialState: FileManagerlistState = {
  FileManagerListdata: null,
  currentFolder: null,
  rootFolder: null,
  storageQuota: null,
  lastUpdatedFiles: null,
  totalItems: 0,
  selectedFileManager: null,
  loading: false,
  error: null,
};

export const FileManagerListReducer = createReducer(
  initialState,
  on(fetchFileManagerlistData, (state, { folderId }) => ({
    ...state,
    currentFolder: folderId,
    loading: true,
    error: null
  })),
  on(fetchFileManagerlistSuccess, (state, { FileManagerListdata }) => ({
    ...state,
    FileManagerListdata: 
    {
      folders: FileManagerListdata.result?.folders || [], // Map the folders from backend response
      files: FileManagerListdata.result?.files || [], // Map the files from backend response
    },
    rootFolder: FileManagerListdata.result?.folders? FileManagerListdata.result?.folders?.[0]?.name: 'MyFiles',
    totalItems: FileManagerListdata.totalItems,
    loading: false,
    error: null 

  })),
  on(fetchFileManagerlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Fetch Recent Files
  on(fetchRecentFilesData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchRecentFilesSuccess, (state, { lastUpdatedFiles }) => ({
    ...state,
    lastUpdatedFiles: lastUpdatedFiles,
    loading: false,
    error: null 

  })),
  on(fetchRecentFilesFailure, (state, { error }) => ({
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
  on(addFileManagerlistSuccess, (state, { folderName, id }) => ({
    ...state,
    FileManagerListdata: {
      ...state.FileManagerListdata,
      folders: [...state.FileManagerListdata.folders, {name: folderName, id: id}], // Add new folder
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
//Handle updating Coupon list
on(renameFileManager, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
 // Handle updating FileManager status
on(renameFileManagerSuccess, (state, { id, new_name, file_type, from}) => { 
  let updatedFolders = []
  let updatedFiles = []
  if(file_type === 'folder'){ 
  // Find the folder to update in the list
     updatedFolders = state.FileManagerListdata.folders.map(folder => {
      if(folder.id === id){
        return {
          ...folder,
          name: new_name
        }
      }
      return folder;
    });
    console.log('updatedFolders', updatedFolders);
    
  }else{
    if(from === 'recent'){
      updatedFiles = state.lastUpdatedFiles.map(file => {
        if(file.id === id){
          return {
            ...file,
            name: new_name
          };
        }
        return file;
      });
    }else{
      // Update files paths if they were in the renamed folder
     updatedFiles = state.FileManagerListdata.files.map(file => {
      if (file.id === id) {
        return {
          ...file,
          name: new_name
        };
      }
      return file;
    });
    console.log('updatedFiles', updatedFiles);
  }}
    return {
      ...state,
      FileManagerListdata: {
        ...state.FileManagerListdata,
        folders: file_type === 'folder' ? updatedFolders : state.FileManagerListdata.folders, // Use the updatedFolders array for foldersupdatedFolders,
        files: file_type === 'file' && from !== 'recent' ? updatedFiles : state.FileManagerListdata.files,   // Use the updatedFiles array for filesupdatedFiles
      },
      lastUpdatedFiles: from === 'recent' ? updatedFiles : state.lastUpdatedFiles,
      loading: false,
      error: null
    };
  }),
   // Handle updating FileManager failure
   on(renameFileManagerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
on(addFile, (state) => ({
  ...state,
  loading: true,
  error: null   
})),
on(addFileSuccess, (state, { formData }) => ({
  ...state,
  FileManagerListdata: {
    ...state.FileManagerListdata,
    files: [...state.FileManagerListdata.files, formData], // Add new files
  },
  loading: false,
  error: null 
})),
on(addFileFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
})),
  on(getStorageQuota, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  on(getStorageQuotaSuccess, (state, { storageQuota }) => ({
    ...state,
    storageQuota,
    loading: false,
    error: null
  })),
  on(getStorageQuotaFailure, (state, { error }) => ({
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
  on(deleteFileManagerlistSuccess, (state, { id, typeFile, from }) => {

    if (typeFile === 'file') {
      return {
        ...state,
        FileManagerListdata: {
          ...state.FileManagerListdata,
          files: state.FileManagerListdata.files.filter(file => file.id !== id)
        },
        // Move lastUpdatedFiles to root level
        lastUpdatedFiles: from === 'recent' 
          ? state.lastUpdatedFiles?.filter(file => file.id !== id) 
          : state.lastUpdatedFiles,
        loading: false,
        error: null
      };
    } else {
      return {
        ...state,
        FileManagerListdata: {
          ...state.FileManagerListdata,
          folders: state.FileManagerListdata.folders.filter(folder => folder.id !== id)
        },
        loading: false,
        error: null
      };
    }
  }),
  // Handle failure of deleting a FileManager
  on(deleteFileManagerlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
 );
