/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchNotificationlistData, fetchNotificationlistSuccess,
    fetchNotificationlistFail,
    addNotificationlistFailure,
    addNotificationlistSuccess,
    addNotificationlist,
    updateNotificationlistFailure,
    updateNotificationlistSuccess,
    updateNotificationlist,
    deleteNotificationlistFailure,
    deleteNotificationlistSuccess,
    deleteNotificationlist,
    getNotificationById,
    getNotificationByIdSuccess,
    fetchMyNotificationlistData,
    fetchMyNotificationlistSuccess,
    fetchMyNotificationlistFail,
    getNotificationByIdFailure
} from './notification.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class NotificationsEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchNotificationlistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/notifications/',{ limit: itemsPerPage, page: page}).pipe(
                    map((response: any) => fetchNotificationlistSuccess({ NotificationListdata : response.result })),
                    catchError((error) =>{
                      const errorMessage = this.formUtilService.getErrorMessage(error);
                      this.toastr.error(errorMessage);
                      return of(fetchNotificationlistFail({ error: errorMessage })); 
                    })
                )
            ),
        ),
    );
    fetchDataNotif$ = createEffect(() =>
      this.actions$.pipe(
          ofType(fetchMyNotificationlistData),
          mergeMap(() =>
              this.CrudService.fetchMyNotif('/notifications/my-notifications').pipe(
                  map((response: any) => fetchMyNotificationlistSuccess({ NotificationListdata : response.result })),
                  catchError((error) =>{
                    const errorMessage = this.formUtilService.getErrorMessage(error);
                    this.toastr.error(errorMessage);
                    return of(fetchMyNotificationlistFail({ error: errorMessage })); 
                  })
              )
          ),
      ),
  );

    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addNotificationlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/notifications/mobile', newData).pipe(
                    map((newData) => {
                        
                        this.router.navigate(['/private/notifications']);
                        this.toastr.success('The new Notification has been added .');
                        // Dispatch the action to fetch the updated Notification list after adding a new Notification
                        return addNotificationlistSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.formUtilService.getErrorMessage(error);
                        this.toastr.error(errorMessage);
                        return of(addNotificationlistFailure({ error: errorMessage })); // Dispatch failure action
                      })                )
            )
        )
    );
   
    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateNotificationlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/notifications/${updatedData.id}`, updatedData).pipe(
              map(() => {
                this.router.navigate(['/private/notifications']);
                this.toastr.success('The Notification has been updated successfully.');
                return updateNotificationlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) =>{
                const errorMessage = this.formUtilService.getErrorMessage(error);
                this.toastr.error(errorMessage);
                return of(updateNotificationlistFailure({ error: errorMessage }));
              })             )
          )
        )
      );
      

   getNotificationById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getNotificationById),
      mergeMap(({ notificationId }) => {
        // Use the selector to get the Notification from the store
        return this.CrudService.getDataById('/notifications', notificationId).pipe(
          map((Notification: any) => {
            if (Notification) {
              // Dispatch success action with the Notification data
              return getNotificationByIdSuccess({ Notification: Notification.result });
            } else {
              //this.toastr.error('Notification not found.'); // Show error notification
              return getNotificationByIdFailure({ error: 'Notification not found' });
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteNotificationlist),
            mergeMap(({ notificationId }) =>
                    this.CrudService.deleteData(`/notifications/${notificationId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            
                            this.toastr.success('The Notification has been deleted successfully.');
                            return deleteNotificationlistSuccess({ notificationId });
                          }),
                          catchError((error) => {
                          const errorMessage = this.formUtilService.getErrorMessage(error);
                          this.toastr.error(errorMessage);
                          return  of(deleteNotificationlistFailure({ error: error.message }))})
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