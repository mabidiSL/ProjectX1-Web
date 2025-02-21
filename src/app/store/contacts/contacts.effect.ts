/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchContactsData, fetchContactsSuccess,
    fetchContactsFail,
    addContactsFailure,
    addContactsSuccess,
    addContacts,
    updateContactsFailure,
    updateContactsSuccess,
    updateContacts,
    deleteContactsFailure,
    deleteContactsSuccess,
    deleteContacts,
    getContactById,
    getContactByIdSuccess,
    getContactByIdFailure,
   
} from './contacts.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ContactsEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchContactsData),
              mergeMap(({page, itemsPerPage, query}) => 
             // this.http.get(this.url).pipe(
                this.CrudService.fetchData('/crm/contacts', {page, itemsPerPage, query}).pipe(
                    map((response: any) => {
                      
                      return fetchContactsSuccess({ Contactsdata: response.result })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   

                      return of(fetchContactsFail({ error: errorMessage })); 
                      })
                )
                ),
        ),
    );
   
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addContacts),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/crm/contacts', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new Contact has been added successfully.');
                        this.router.navigate(['/private/crm-contact/list']);
                        // Dispatch the action to fetch the updated Contact list after adding a new Contact
                        return addContactsSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        if (errorMessage !== 'An unknown error occurred') {
                          this.toastr.error(errorMessage);
                           }   
                        return of(addContactsFailure({ error: errorMessage })); // Dispatch failure action
                      }))
            )
        )
    );
    getLoggedContact$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getContactById),
        mergeMap(({ ContactId }) => {
          // get Contact by id     
          return this.CrudService.getDataById('/crm/contacts', ContactId).pipe(
            map((data: any) => {
              if (data ) {
                            
                // Dispatch success action with the Contact data
                return getContactByIdSuccess({ Contact: data.result });
              } else {
                this.toastr.error('Contact not found.'); // Show error notification
                return getContactByIdFailure({ error: 'Contact not found' });
              }
            })
          );
        })
      )
    );
   
  
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateContacts),
            mergeMap(({ updatedData }) => {
              return this.CrudService.updateData(`/crm/contacts/${updatedData.id}`, updatedData).pipe(
                map(() => 
                {
                    this.toastr.success('The Contact has been updated successfully.');
                    this.router.navigate(['/private/Contacts/list']);
                    return  updateContactsSuccess({ updatedData })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   

                      return of(updateContactsFailure({ error: errorMessage }));
                      })                 );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteContacts),
            mergeMap(({ userId }) =>
                  this.CrudService.deleteData(`/crm/contacts/${userId}`).pipe(
                        map(() => {
                            this.toastr.success('Contact deleted successfully.');
                            return deleteContactsSuccess({ userId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
                        
                            return  of(deleteContactsFailure({ error: errorMessage }))})                )
            )
        )
    );
    
    
    constructor(
        private readonly actions$: Actions,
        private readonly CrudService: CrudService,
        public readonly toastr:ToastrService,
        private readonly router: Router,
        private readonly http: HttpClient,
        private readonly formUtilService: FormUtilService,
        private readonly store: Store
    ) {

     }

    
     
}