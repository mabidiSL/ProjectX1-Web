/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCompaniesData, fetchCompaniesSuccess,
    fetchCompaniesFail,
    addCompaniesFailure,
    addCompaniesSuccess,
    addCompanies,
    updateCompaniesFailure,
    updateCompaniesSuccess,
    updateCompanies,
    deleteCompaniesFailure,
    deleteCompaniesSuccess,
    deleteCompanies,
    getCompanyById,
    getCompanyByIdSuccess,
    getCompanyByIdFailure,
   
} from './companies.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CompaniesEffects {
  url = 'assets/companies.json';
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCompaniesData),
            mergeMap(() => 
              this.http.get(this.url).pipe(
                  //this.CrudService.fetchData(this.url).pipe(
                    map((response: any) => {
                      console.log(response.companies);
                      
                      return fetchCompaniesSuccess({ Companiesdata: response.companies })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   

                      return of(fetchCompaniesFail({ error: errorMessage })); 
                      })
                )
                ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCompanies),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/Companies', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new Company has been added successfully.');
                        this.router.navigate(['/private/Companies/list']);
                        // Dispatch the action to fetch the updated Company list after adding a new Company
                        return addCompaniesSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage);   
                        return of(addCompaniesFailure({ error: errorMessage })); // Dispatch failure action
                      }))
            )
        )
    );
    getLoggedCompany$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getCompanyById),
        mergeMap(({ CompanyId }) => {
          // get Company by id
          return this.CrudService.getDataById('/Companies', CompanyId).pipe(
            map((Company: any) => {
              if (Company ) {
                // Dispatch success action with the Company data
                return getCompanyByIdSuccess({ Company: Company.result });
              } else {
                this.toastr.error('Company not found.'); // Show error notification
                return getCompanyByIdFailure({ error: 'Company not found' });
              }
            })
          );
        })
      )
    );
   
  
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateCompanies),
            mergeMap(({ updatedData }) => {
                
                return this.CrudService.updateData(`/Companies/${updatedData.id}`, updatedData).pipe(
                map(() => 
                {
                    this.toastr.success('The Company has been updated successfully.');
                    this.router.navigate(['/private/Companies/list']);
                    return  updateCompaniesSuccess({ updatedData })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);   

                      return of(updateCompaniesFailure({ error: errorMessage }));
                      })                 );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCompanies),
            mergeMap(({ userId }) =>
                    this.CrudService.deleteData(`/Companies/${userId}`).pipe(
                        map(() => {
                            this.toastr.success('Company deleted successfully.');
                            return deleteCompaniesSuccess({ userId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            this.toastr.error(errorMessage);   
                        
                            return  of(deleteCompaniesFailure({ error: errorMessage }))})                )
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