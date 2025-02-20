/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchWinsData, fetchWinsSuccess,
    fetchWinsFail,
    addWinsFailure,
    addWinsSuccess,
    addWins,
    updateWinsFailure,
    updateWinsSuccess,
    updateWins,
    deleteWinsFailure,
    deleteWinsSuccess,
    deleteWins,
    getWinById,
    getWinByIdSuccess,
    getWinByIdFailure,
   
} from './wins.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { HttpClient } from '@angular/common/http';
import { Win } from './wins.model';


@Injectable()
export class WinsEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchWinsData),
            mergeMap(({page, itemsPerPage, query}) => 
              //this.http.get(this.url).pipe(
                  this.CrudService.fetchData('/crm/wins',{ limit: itemsPerPage, page: page, query: query}).pipe(
                    map((response: any) => {
                    return fetchWinsSuccess({ Winsdata: response.result })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   
                      return of(fetchWinsFail({ error: errorMessage })); 
                      })
                )
                ),
        ),
    );
   
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addWins),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/crm/wins', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new Win has been added successfully.');
                        this.router.navigate(['/private/Wins/list']);
                        // Dispatch the action to fetch the updated Win list after adding a new Win
                        return addWinsSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage);   
                        return of(addWinsFailure({ error: errorMessage })); // Dispatch failure action
                      }))
            )
        )
    );
    getLoggedWin$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getWinById),
        mergeMap(({ WinId }) => {
          // get Win by id     
           //   return this.http.get(`${this.url}`).pipe(

          return this.CrudService.getDataById('/crm/wins', WinId).pipe(
            map((data: any) => {
              if (data ) {
                console.log(data);
                console.log(WinId);
                
                const quote = data?.wins?.find((item: Win) => {
                  console.log('Checking item id:', item.id);  // Debugging the check
                  return item.id === WinId;
                });
                
                console.log(quote);
                
                // Dispatch success action with the Win data
                return getWinByIdSuccess({ Win: quote });
              } else {
                this.toastr.error('Win not found.'); // Show error notification
                return getWinByIdFailure({ error: 'Win not found' });
              }
            })
          );
        })
      )
    );
   
  
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateWins),
            mergeMap(({ updatedData }) => {
                //return this.http.post(`${this.url}/${updatedData.id}`, updatedData).pipe(
                return this.CrudService.updateData(`/crm/wins/${updatedData.id}`, updatedData).pipe(
                map(() => 
                {
                    this.toastr.success('The Win has been updated successfully.');
                    this.router.navigate(['/private/Wins/list']);
                    return  updateWinsSuccess({ updatedData })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   

                      return of(updateWinsFailure({ error: errorMessage }));
                      })                 );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteWins),
            mergeMap(({ userId }) =>
                    this.CrudService.deleteData(`/crm/wins/${userId}`).pipe(
                        map(() => {
                            this.toastr.success('Win deleted successfully.');
                            return deleteWinsSuccess({ userId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage);   
                        
                            return  of(deleteWinsFailure({ error: errorMessage }))})                )
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