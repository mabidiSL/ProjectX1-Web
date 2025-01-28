/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/FileManagerlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addFileManagerlist, addFileManagerlistFailure, addFileManagerlistSuccess, deleteFileManagerlistFailure, deleteFileManagerlist, deleteFileManagerlistSuccess, /*deleteFileManagerlist, deleteFileManagerlistFailure, deleteFileManagerlistSuccess,*/ fetchFileManagerlistData, fetchFileManagerlistFail, fetchFileManagerlistSuccess, getFileManagerById, getFileManagerByIdFailure, getFileManagerByIdSuccess, getStorageQuota, getStorageQuotaSuccess, getStorageQuotaFailure, addFile, addFileFailure, addFileSuccess,  /* updateFileManagerlist, updateFileManagerlistFailure, updateFileManagerlistSuccess */
/*updateFileManagerlist,
updateFileManagerlistFailure,
updateFileManagerlistSuccess*/
} from './file-manager.action';
import { FileManager, Folder, StorageQuota } from './file-manager.model';

export interface FileManagerlistState {
  FileManagerListdata: FileManager;
  currentFolder: string;
  rootFolder: string;
  totalItems: number;
  storageQuota: StorageQuota;
  selectedFileManager: Folder | any;
  loading: boolean;
  error: string;
}

export const initialState: FileManagerlistState = {
  FileManagerListdata: null,
  currentFolder: null,
  rootFolder: null,
  storageQuota: null,
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
// Handle updating Coupon list
// on(updateFileManagerlist, (state) => ({
//   ...state,
//   loading: true,
//   error: null 
// })),
//  // Handle updating FileManager status
// on(updateFileManagerlistSuccess, (state, { oldName, newNamefolderName }) => {
//     // Find the folder to update in the list
//     const updatedFolders = state.FileManagerListdata.folders.map(folder => {
//       const oldPath = folder.split('/');
//       const newPath = folderName.split('/');
      
//       // If this is the folder being renamed or a subfolder
//       if (folder.startsWith(oldPath[0])) {
//         // Replace the old folder name with the new one while keeping the same structure
//         return folder.replace(oldPath[0], newPath[newPath.length - 1]);
//       }
//       return folder;
//     });

//     // Update files paths if they were in the renamed folder
//     const updatedFiles = state.FileManagerListdata.files.map(file => {
//       if (file.name.startsWith(folderName)) {
//         return {
//           ...file,
//           name: file.name.replace(folderName.split('/')[0], folderName.split('/')[newPath.length - 1])
//         };
//       }
//       return file;
//     });

//     return {
//       ...state,
//       FileManagerListdata: {
//         ...state.FileManagerListdata,
//         folders: updatedFolders,
//         files: updatedFiles
//       },
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
on(addFile, (state) => ({
  ...state,
  loading: true,
  error: null   
})),
on(addFileSuccess, (state, { formData }) => ({
  ...state,
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
  on(deleteFileManagerlistSuccess, (state, { key, typeFile }) => {
    if (typeFile === 'file') {
      return {
        ...state,
        FileManagerListdata: {
          ...state.FileManagerListdata,
          files: state.FileManagerListdata.files.filter(file => file.name !== key)
        },
        loading: false,
        error: null
      };
    } else {
      return {
        ...state,
        FileManagerListdata: {
          ...state.FileManagerListdata,
          folders: state.FileManagerListdata.folders.filter(folder => !folder.startsWith(key))
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
