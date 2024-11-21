/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchSectionlistData, fetchSectionlistSuccess,
    fetchSectionlistFail,
    
} from './section.action';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class SectionEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchSectionlistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/sections',{ limit: itemsPerPage, page: page}).pipe(
                    map((response: any) => fetchSectionlistSuccess({ SectionListdata: response.result.data })),
                    catchError((error) =>
                        of(fetchSectionlistFail({ error }))
                    )
                )
            ),
        ),
    );
  
    
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
      
    ) { 
    }

}