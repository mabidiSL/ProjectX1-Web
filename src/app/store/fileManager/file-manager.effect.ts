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
    getFileManagerByIdFailure
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
                      
                        this.toastr.success('The new FileManager has been added successfully.');
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
   

    // updateData$ = createEffect(() =>
    //     this.actions$.pipe(
    //       ofType(updateFileManagerlist),
    //       mergeMap(({ updatedData }) =>
    //         this.CrudService.updateData(`/special-days/${updatedData.id}`, updatedData).pipe(
    //           map(() => {
                
    //             this.toastr.success('The FileManager has been updated successfully.');
    //             this.router.navigate(['/private/file-manager']);
    //             return updateFileManagerlistSuccess({ updatedData }); // Make sure to return the action
    //           }),
    //           catchError((error) => {
    //             const errorMessage = this.formUtilService.getErrorMessage(error);
    //             this.toastr.error(errorMessage); 
    //             return of(updateFileManagerlistFailure({ error: errorMessage }));}) // Catch errors and return the failure action
    //         )
    //       )
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
  //  deleteData$ = createEffect(() =>
    
  //       this.actions$.pipe(
  //           ofType(deleteFileManagerlist),
  //           mergeMap(({ FileManagerId }) =>
  //                   this.CrudService.deleteData(`/files-or-folders/${FileManagerId}`).pipe(
  //                       map(() => {
  //                         this.toastr.success('FileManager deleted successfully.');
  //                         return deleteFileManagerlistSuccess({ FileManagerId });
  //                         }),
  //                   catchError((error) => {
  //                     const errorMessage = this.formUtilService.getErrorMessage(error);
  //                     this.toastr.error(errorMessage); 
  //                     return  of(deleteFileManagerlistFailure({ error: errorMessage }))})
  //               )
  //           )
  //       )
  //   );
    
    
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