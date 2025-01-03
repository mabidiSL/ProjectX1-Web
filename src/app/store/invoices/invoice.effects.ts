/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchInvoicelistData, fetchInvoicelistSuccess,
    fetchInvoicelistFail,
   
    deleteInvoicelistFailure,
    deleteInvoicelistSuccess,
    deleteInvoicelist,
    getInvoiceById,
    getInvoiceByIdSuccess,
    getInvoiceByIdFailure
} from './invoice.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class InvoicesEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchInvoicelistData),
            mergeMap(({ page, itemsPerPage, query, category, date, status }) =>
                this.CrudService.fetchData('/invoices',{ limit: itemsPerPage, page: page,query: query, category: category, date: date,status: status}).pipe(
                    map((response: any) => fetchInvoicelistSuccess({ InvoiceListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(fetchInvoicelistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );
  
   
  

   getInvoiceById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getInvoiceById),
      mergeMap(({ InvoiceId }) => {
        // Use the selector to get the Invoice from the store
        return this.CrudService.getDataById('/invoices', InvoiceId).pipe(
          map((Invoice: any) => {
            if (Invoice) {
              // Dispatch success action with the Invoice data
              return getInvoiceByIdSuccess({ Invoice: Invoice.result });
            } else {
              //this.toastr.error('Invoice not found.'); // Show error notification
              return getInvoiceByIdFailure({ error: 'Invoice not found' });
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteInvoicelist),
            mergeMap(({ InvoiceId }) =>
                    this.CrudService.deleteData(`/invoices/${InvoiceId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            this.toastr.success('The Invoice has been deleted successfully.');
                            return deleteInvoicelistSuccess({ InvoiceId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage);  
                            return  of(deleteInvoicelistFailure({ error: errorMessage }))})      
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