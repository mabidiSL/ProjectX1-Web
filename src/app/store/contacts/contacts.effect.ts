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
import { Contact } from './contacts.model';


@Injectable()
export class ContactsEffects {
  url = 'assets/contacts.json';
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchContactsData),
            mergeMap(() => 
              this.http.get(this.url).pipe(
                  //this.CrudService.fetchData(this.url).pipe(
                    map((response: any) => {
                      console.log(response.contacts);
                      
                      return fetchContactsSuccess({ Contactsdata: response.contacts })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   

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
                this.CrudService.addData('/Contacts', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new Contact has been added successfully.');
                        this.router.navigate(['/private/crm-contact/list']);
                        // Dispatch the action to fetch the updated Contact list after adding a new Contact
                        return addContactsSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage);   
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
          return this.http.get(`${this.url}`).pipe(

         // return this.CrudService.getDataById('/Contacts', ContactId).pipe(
            map((data: any) => {
              if (data ) {
                console.log(data);
                console.log(ContactId);
                
                const company = data?.contacts?.find((item: Contact) => {
                  console.log('Checking item id:', item.id);  // Debugging the check
                  return item.id === ContactId;
                });
                
                console.log(company);
                
                // Dispatch success action with the Contact data
                return getContactByIdSuccess({ Contact: company });
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
                return this.http.post(`${this.url}/${updatedData.id}`, updatedData).pipe(
               // return this.CrudService.updateData(`/Contacts/${updatedData.id}`, updatedData).pipe(
                map(() => 
                {
                    this.toastr.success('The Contact has been updated successfully.');
                    this.router.navigate(['/private/Contacts/list']);
                    return  updateContactsSuccess({ updatedData })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   

                      return of(updateContactsFailure({ error: errorMessage }));
                      })                 );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteContacts),
            mergeMap(({ userId }) =>
                    this.CrudService.deleteData(`/Contacts/${userId}`).pipe(
                        map(() => {
                            this.toastr.success('Contact deleted successfully.');
                            return deleteContactsSuccess({ userId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage);   
                        
                            return  of(deleteContactsFailure({ error: errorMessage }))})                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private readonly http: HttpClient,
        private formUtilService: FormUtilService,
        private store: Store
    ) {

     }

    
     
}