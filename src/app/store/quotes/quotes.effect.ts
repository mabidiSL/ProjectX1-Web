/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchQuotesData, fetchQuotesSuccess,
    fetchQuotesFail,
    addQuotesFailure,
    addQuotesSuccess,
    addQuotes,
    updateQuotesFailure,
    updateQuotesSuccess,
    updateQuotes,
    deleteQuotesFailure,
    deleteQuotesSuccess,
    deleteQuotes,
    getQuoteById,
    getQuoteByIdSuccess,
    getQuoteByIdFailure,
   
} from './quotes.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { HttpClient } from '@angular/common/http';
import { Quote } from './quotes.model';


@Injectable()
export class QuotesEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchQuotesData),
            mergeMap(({page, itemsPerPage, query}) => 
              //this.http.get(this.url).pipe(
                  this.CrudService.fetchData('/crm/quotes',{ limit: itemsPerPage, page: page, query: query}).pipe(
                    map((response: any) => {
                    return fetchQuotesSuccess({ Quotesdata: response.result })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
                      return of(fetchQuotesFail({ error: errorMessage })); 
                      })
                )
                ),
        ),
    );
   
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addQuotes),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/crm/quotes', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new Quote has been added successfully.');
                        this.router.navigate(['/private/Quotes/list']);
                        // Dispatch the action to fetch the updated Quote list after adding a new Quote
                        return addQuotesSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
                        return of(addQuotesFailure({ error: errorMessage })); // Dispatch failure action
                      }))
            )
        )
    );
    getLoggedQuote$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getQuoteById),
        mergeMap(({ QuoteId }) => {
          // get Quote by id     
           //   return this.http.get(`${this.url}`).pipe(

          return this.CrudService.getDataById('/crm/quotes', QuoteId).pipe(
            map((data: any) => {
              if (data ) {
                console.log(data);
                console.log(QuoteId);
                
                const quote = data?.quotes?.find((item: Quote) => {
                  console.log('Checking item id:', item.id);  // Debugging the check
                  return item.id === QuoteId;
                });
                
                console.log(quote);
                
                // Dispatch success action with the Quote data
                return getQuoteByIdSuccess({ Quote: quote });
              } else {
                this.toastr.error('Quote not found.'); // Show error notification
                return getQuoteByIdFailure({ error: 'Quote not found' });
              }
            })
          );
        })
      )
    );
   
  
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateQuotes),
            mergeMap(({ updatedData }) => {
                //return this.http.post(`${this.url}/${updatedData.id}`, updatedData).pipe(
                return this.CrudService.updateData(`/crm/quotes/${updatedData.id}`, updatedData).pipe(
                map(() => 
                {
                    this.toastr.success('The Quote has been updated successfully.');
                    this.router.navigate(['/private/Quotes/list']);
                    return  updateQuotesSuccess({ updatedData })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   

                      return of(updateQuotesFailure({ error: errorMessage }));
                      })                 );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteQuotes),
            mergeMap(({ userId }) =>
                    this.CrudService.deleteData(`/crm/quotes/${userId}`).pipe(
                        map(() => {
                            this.toastr.success('Quote deleted successfully.');
                            return deleteQuotesSuccess({ userId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
                        
                            return  of(deleteQuotesFailure({ error: errorMessage }))})                )
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