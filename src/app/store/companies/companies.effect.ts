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
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCompaniesData),
            mergeMap(({page, itemsPerPage, query}) => 
              //this.http.get(this.url).pipe(
                  this.CrudService.fetchData('/crm/companies',{ limit: itemsPerPage, page: page, query: query}).pipe(
                    map((response: any) => {
                    return fetchCompaniesSuccess({ Companiesdata: response.result })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
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
                this.CrudService.addData('/crm/companies', newData).pipe(
                    map((response: any) => {
                        this.toastr.success('The new Company has been added successfully.');
                        //this.router.navigate(['/private/Companies/list']);
                        const company = newData
                        company.id = response?.result?.id
                        // Dispatch the action to fetch the updated Company list after adding a new Company
                        return addCompaniesSuccess({newData: company});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
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
           //   return this.http.get(`${this.url}`).pipe(

          return this.CrudService.getDataById('/crm/companies', CompanyId).pipe(
            map((data: any) => {
              if (data ) {
                   
                // Dispatch success action with the Company data
                return getCompanyByIdSuccess({ Company: data.result });
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
                //return this.http.post(`${this.url}/${updatedData.id}`, updatedData).pipe(
                return this.CrudService.updateData(`/crm/companies/${updatedData.id}`, updatedData).pipe(
                map((response: any) => 
                {
                    this.toastr.success('The Company has been updated successfully.');
                    return  updateCompaniesSuccess({ updatedData: response.result })}),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   

                      return of(updateCompaniesFailure({ error: errorMessage }));
                      })                 );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCompanies),
            mergeMap(({ userId }) =>
                    this.CrudService.deleteData(`/crm/companies/${userId}`).pipe(
                        map(() => {
                            this.toastr.success('Company deleted successfully.');
                            return deleteCompaniesSuccess({ userId });
                          }),
                          catchError((error) => {
                            const errorMessage = this.formUtilService.getErrorMessage(error);
                            if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
                        
                            return  of(deleteCompaniesFailure({ error: errorMessage }))})                )
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