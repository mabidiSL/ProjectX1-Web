/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

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
    addFileSuccess
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
            mergeMap(({ folderName }) =>
                this.CrudService.fetchData('/storage/files-and-folders',{ folderName: folderName }).pipe(
                    map((response: any) => fetchFileManagerlistSuccess({ FileManagerListdata : response })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage); 
                      return of(fetchFileManagerlistFail({ error: errorMessage })); 
                    })
                    )
                ),
            ),
        
    );
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addFileManagerlist),
            mergeMap(({ folderName }) =>
                this.CrudService.addData('/storage/folders', {folderName: folderName}).pipe(
                    map(() => {
                      
                        this.toastr.success('The new Folder has been added successfully.');
                        this.router.navigate(['/private/file-manager']);
                        // Dispatch the action to fetch the updated FileManager list after adding a new FileManager
                        return addFileManagerlistSuccess({folderName: folderName});
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
                  map(() => {
                      this.toastr.success('Files uploaded successfully.');
                      this.router.navigate(['/private/file-manager']);
                      return addFileSuccess({ formData });
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

    // updateData$ = createEffect(() =>
    //     this.actions$.pipe(
    //       ofType(updateFileManagerlist),
    //       mergeMap(({ updatedData }) => {
    //         const { oldPath, newPath } = JSON.parse(updatedData);
    //         return this.CrudService.renameFolder(oldPath, newPath).pipe(
    //           map(() => {
    //             this.toastr.success('The FileManager has been updated successfully.');
    //             this.router.navigate(['/private/file-manager']);
    //             return updateFileManagerlistSuccess({ folderName: newPath });
    //           }),
    //           catchError((error) => {
    //             const errorMessage = this.formUtilService.getErrorMessage(error);
    //             this.toastr.error(errorMessage); 
    //             return of(updateFileManagerlistFailure({ error: errorMessage }));
    //           })
    //         );
    //       })
    //     )
    //   );
      
    
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
      mergeMap(({ key, typeFile }) => {
        // Replace forward slash with %2F for the API call if key contains project-x1/
        const encodedKey = key.includes('/') ? key.replace('/', '%2F') : key;
        
        return this.CrudService.deleteData(`/storage/files-or-folders/${encodedKey}`).pipe(
          map(() => {
            this.toastr.success(`${typeFile === 'file' ? 'File' : 'Folder'} deleted successfully.`);
            return deleteFileManagerlistSuccess({ key: key, typeFile: typeFile });
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