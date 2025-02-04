/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchRolelistData, fetchRolelistSuccess,
    fetchRolelistFail,
    addRolelistFailure,
    addRolelistSuccess,
    addRolelist,
    updateRolelistFailure,
    updateRolelistSuccess,
    updateRolelist,
    deleteRolelistFailure,
    deleteRolelistSuccess,
    deleteRolelist,
    getRoleById,
    getRoleByIdSuccess,
    getRoleByIdFailure
} from './role.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class RolesEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchRolelistData),
            mergeMap(({ page, itemsPerPage, query,status }) =>
                this.CrudService.fetchData('/roles/me',{ limit: itemsPerPage, page: page,query: query,status: status}).pipe(
                    map((response: any) => fetchRolelistSuccess({ RoleListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                       
                      return of(fetchRolelistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addRolelist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/roles', newData).pipe(
                    map((newData) => {
                        
                        this.toastr.success('The new Role has been added successfully.');
                        this.router.navigate(['/private/roles/list']);
                        // Dispatch the action to fetch the updated Role list after adding a new Role
                        return addRolelistSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                         
                        return of(addRolelistFailure({ error: errorMessage })); // Dispatch failure action
                      })                )
            )
        )
    );
   updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateRolelist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/roles/${updatedData.id}`, updatedData).pipe(
              map(() => {
                this.toastr.success('The Role has been updated successfully.');
                this.router.navigate(['/private/roles/list']);
                return updateRolelistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) =>{
                const errorMessage = this.formUtilService.getErrorMessage(error);
                 
                return of(updateRolelistFailure({ error: errorMessage }));
              })             )
          )
        )
      );
      

   getRoleById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRoleById),
      mergeMap(({ RoleId }) => {
        // Use the selector to get the Role from the store
        return this.CrudService.getDataById('/roles', RoleId).pipe(
          map((Role: any) => {
            if (Role) {
              // Dispatch success action with the Role data
              return getRoleByIdSuccess({ Role: Role.result });
            } else {
              //this.toastr.error('Role not found.'); // Show error notification
              return getRoleByIdFailure({ error: 'Role not found' });
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteRolelist),
            mergeMap(({ RoleId }) =>
                    this.CrudService.deleteData(`/roles/${RoleId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            this.toastr.success('The Role has been deleted successfully.');
                            return deleteRolelistSuccess({ RoleId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                               
                            return  of(deleteRolelistFailure({ error: errorMessage }))})      
                                    )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        private router: Router,
        private formUtilService: FormUtilService,
        public toastr:ToastrService
    ) { }
    
}