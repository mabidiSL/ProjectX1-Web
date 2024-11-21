/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCountrylistData, fetchCountrylistSuccess,
    fetchCountrylistFail,
  
} from './country.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class countrieslistEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCountrylistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/countries',{ limit: itemsPerPage, page: page}).pipe(
                    map((response: any) => fetchCountrylistSuccess({ CountryListdata: response.result })),
                    catchError((error) =>
                        of(fetchCountrylistFail({ error }))
                    )
                )
            ),
        ),
    );
  
  
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private formUtilService: FormUtilService
    ) { }
    
}