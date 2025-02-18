/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, exhaustMap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchFileManagerlistData, fetchFileManagerlistSuccess,
    fetchFileManagerlistFail,
    addFileManagerlistFailure,
    addFileManagerlistSuccess,
    addFileManagerlist,
    /*updateFileManagerlistFailure,
    updateFileManagerlistSuccess,
    updateFileManagerlist,
   deleteFileManagerlistFailure,
    deleteFileManagerlistSuccess,
    deleteFileManagerlist,*/
    getFileManagerById,
    getFileManagerByIdSuccess,
    getFileManagerByIdFailure,
    // updateFileManagerlist,
    // updateFileManagerlistSuccess,
    // updateFileManagerlistFailure
    deleteFileManagerlist,
    deleteFileManagerlistSuccess,
    deleteFileManagerlistFailure,
    getStorageQuota,
    getStorageQuotaSuccess,
    getStorageQuotaFailure,
    addFile,
    addFileFailure,
    addFileSuccess,
    renameFileManager,
    renameFileManagerFailure,
    renameFileManagerSuccess,
    fetchRecentFilesData,
    fetchRecentFilesSuccess,
    fetchRecentFilesFailure
} from './file-manager.action';
import { ToastrService } from 'ngx-toastr';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class FileManagersEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchFileManagerlistData),
            exhaustMap(({ folderId }) =>
                this.CrudService.fetchData('/storage/files-and-folders',{ id: folderId }).pipe(
                    map((response: any) => fetchFileManagerlistSuccess({ FileManagerListdata : response })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                        
                      return of(fetchFileManagerlistFail({ error: errorMessage })); 
                    })
                    )
                ),
            ),
        
    );
    getData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchRecentFilesData),
            exhaustMap(({ limit }) =>
                this.CrudService.fetchData('/storage/files/last-updated',{ limit: limit }).pipe(
                    map((response: any) => fetchRecentFilesSuccess({ lastUpdatedFiles : response?.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   

                      return of(fetchRecentFilesFailure({ error: errorMessage })); 
                    })
                    )
                ),
            ),
        
    );
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addFileManagerlist),
            mergeMap(({ folderName, name }) =>
                this.CrudService.addData('/storage/folders', {folderName: folderName}).pipe(
                    map((response: any) => {
                      
                        this.toastr.success('The new Folder has been added successfully.');
                       // this.router.navigate(['/private/file-manager']);
                        // Dispatch the action to fetch the updated FileManager list after adding a new FileManager
                        return addFileManagerlistSuccess({folderName: name, id: response?.result?.id }); 
                      }),
                    catchError((error) => {
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   
  
                      return of(addFileManagerlistFailure({ error: errorMessage }));})
                )
            )
        )
    );
    addDataFile$ = createEffect(() =>
      this.actions$.pipe(
          ofType(addFile),
          mergeMap(({ formData }) => {
              // files is already a FormData object, send it directly
              return this.CrudService.addData('/storage/files', formData).pipe(
                  map((response: any) => {
                      this.toastr.success('Files uploaded successfully.');
                     // this.router.navigate(['/private/file-manager']);
                      console.log('response', response);
                      const files = response.result?.files;
                        files?.map((file: any) => {
                          return file.name;
                        });
      
                     console.log('fileTable', files);
                     return addFileSuccess({ formData: files, file_type: 'file'});
                  }),
                  catchError((error) => {
                    const errorMessage = this.formUtilService.getErrorMessage(error);
                    this.toastr.error(errorMessage);   

                    return of(addFileFailure({ error: errorMessage }));
                  })
              );
          })
      )
    );

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(renameFileManager),
          mergeMap(({ id, new_name, file_type }) => {
            let url = '';
            if(file_type === 'folder')  
               url = '/storage/folder';
            else
              url = '/storage/file';

            return this.CrudService.updateData(`${url}/${id}`, {name: new_name}).pipe(
              map(() => {
                this.toastr.success(`${file_type === 'folder' ? 'Folder' : 'File'}`,' has been renamed successfully.');
               // this.router.navigate(['/private/file-manager']);
                return renameFileManagerSuccess({ id: id, new_name: new_name, file_type: file_type });
              }),
              catchError((error) => {
                const errorMessage = this.formUtilService.getErrorMessage(error);
                this.toastr.error(errorMessage);   

                return of(renameFileManagerFailure({ error: errorMessage }));
              })
            );
          })
        )
      );
      
    
   getFileManagerById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getFileManagerById),
      mergeMap(({ FileManagerId }) => {
        // Use the selector to get the FileManager from the store
        return this.CrudService.getDataById('/special-days', FileManagerId).pipe(
          map((FileManager: any) => {
            if (FileManager) {
              // Dispatch success action with the FileManager data
              return getFileManagerByIdSuccess({ FileManager: FileManager.result  });
            } else {
              //this.toastr.error('FileManager not found.')
              return getFileManagerByIdFailure({ error: 'FileManager not found' }); // or handle it differently
            }
          })
        );
      })
    )
  );
  getStorageQuota$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getStorageQuota),
      mergeMap(() => this.CrudService.fetchData('/storage/size').pipe(
        map((response: any) => getStorageQuotaSuccess({ storageQuota: response.result })),
        catchError((error) => {
            const errorMessage = this.formUtilService.getErrorMessage(error);
            this.toastr.error(errorMessage);   

            return of(getStorageQuotaFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  deleteData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteFileManagerlist),
      mergeMap(({ id, typeFile, from }) => {
        let url = '';
        if(typeFile === 'folder')  
           url = '/storage/folder';
        else
          url = '/storage/file';
        
        
        return this.CrudService.deleteData(`${url}/${id}`).pipe(
          map(() => {
            this.toastr.success(`${typeFile === 'file' ? 'File' : 'Folder'} deleted successfully.`);
            return deleteFileManagerlistSuccess({ id: id, typeFile: typeFile, from: from });
          }),
          catchError((error) => {
            const errorMessage = this.formUtilService.getErrorMessage(error);
            this.toastr.error(errorMessage);   

            return of(deleteFileManagerlistFailure({ error: errorMessage }));
          })
        );
      })
    )
  );
    
    
    constructor(
        private readonly actions$: Actions,
        private readonly CrudService: CrudService,
        private readonly router: Router,
        private readonly formUtilService: FormUtilService,
        private readonly authservice: AuthenticationService,
        public toastr:ToastrService
    ) {
        this.authservice.currentUser$.subscribe(user => {
        this.userRole = user?.role.translation_data[0]?.name;
        this.companyId = user?.companyId;
        
      } );
   }
  userRole : string = null;
  companyId: number = null;
}