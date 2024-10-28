import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap, first } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { AuthenticationService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure,forgetPassword, logout, logoutSuccess, Register, RegisterSuccess, RegisterFailure, updatePassword, updatePasswordFailure, updatePasswordSuccess, updateProfile, updateProfilePassword, updateProfileSuccess, updateProfileFailure, updateProfilePasswordSuccess, updateProfilePasswordFailure } from './authentication.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { _User, User } from './auth.models';

@Injectable()
export class AuthenticationEffects {
  
  private currentUserSubject: BehaviorSubject<_User>;
  public currentUser: Observable<_User>;

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private AuthfakeService: AuthfakeauthenticationService,
    private userService: UserProfileService,
    private router: Router,
    public toastr:ToastrService) {

      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
     }
          
  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ newData }) => {
        
          return this.AuthfakeService.register(newData ).pipe(
            map((user) => {
              if(user){
              this.toastr.success('Registration completed, Check you Inbox soon!!!');
              this.router.navigate(['/auth/login']);
              return RegisterSuccess({ user })
              }
            }),
            catchError((error) => {
              const errorMessage = this.getErrorMessage(error); 
              this.toastr.error(errorMessage);
              return of(RegisterFailure({ error: error.message }))
            })
          );
       
      })
    )
  );



  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) => {
        
          return this.AuthfakeService.login(email, password).pipe(
            map((response) => {
                      
                console.log(JSON.stringify(response.result.accessToken));
                localStorage.setItem('token', response.result.accessToken);
                localStorage.setItem('refreshToken', response.result.refreshToken);
                localStorage.setItem('currentUser', JSON.stringify(response.result.user));

                this.currentUserSubject.next(response.result.user);
                this.router.navigate(['/private']);
                //this.toastr.success('Login successfully!!!');
                return loginSuccess({ user: response.result.user, token: response.result.accessToken });

            }),
            catchError((error) => {
              const errorMessage = this.getErrorMessage(error); 
              this.toastr.error(error.message);
              return of(loginFailure({ error: error.message }))})); 
            
        
      })
    )
  );
 
  forgetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forgetPassword),
      exhaustMap((action) => {
        return this.AuthfakeService.forgotPassword(action.email).pipe(
          map((response: any) => {
            this.toastr.success('An Email was sent check your inbox');
            return { type: '[Auth] Forgot Password Success', payload: response };
          }),
          catchError((error: any) => {
            this.toastr.error(`Forgot Password Failure: ${error.message}`);
            return of({ type: '[Auth] Forgot Password Failure', payload: error });
          }),
          tap(() => {
            // Navigate to another route after successful response
            this.router.navigate(['auth/login']); // or any other route you want
          }),
        );
      }),
    ));
  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePassword),
      exhaustMap(({ password, token }) => {
        return this.AuthfakeService.updatePassword(password, token).pipe(
          map((response: any) => {
            this.toastr.success('Password has been updated successfully!!!');
            return { type: '[Auth] Update Password Success', payload: response };
          }),
          catchError((error: any) => {
            this.toastr.error(`Update Password Failure: ${error.message}`);
            return of({ type: '[Auth] Update Password Failure', payload: error });
          }),
          tap(() => {
            // Navigate to another route after successful response
            this.router.navigate(['auth/login']); // or any other route you want
          }),
        );
      }),
    ));
  updateProfile$ = createEffect(()=>
    this.actions$.pipe(
    ofType(updateProfile),
    exhaustMap((user : any ) => {
      return this.AuthfakeService.updateProfile(user.user).pipe(
        map(() => {
             localStorage.setItem('currentUser', JSON.stringify(user.user));
            this.toastr.success('The profile was updated successfully.');
            this.router.navigate(['/private/dashboard']);
            return updateProfileSuccess({user:user.user});
          }
         
        ),
        catchError((error: any) => {
          this.toastr.error(`Update Profile Failure: ${error.message}`);
          return of(updateProfileFailure({ error }));
        }),
       
      );
    }),
  ));
     
  updateProfilePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProfilePassword),
      exhaustMap(({ oldPassword, newPassword}) => {
        return this.AuthfakeService.updateProfilePassword( oldPassword, newPassword).pipe(
          map((response: any) => {
            if (response) {
             
              this.toastr.success('The password was updated successfully.');
              this.router.navigate(['/private/dashboard']);
              return updateProfilePasswordSuccess({message:response});
            }
            
          }),
          catchError((error: any) => {
            
            this.toastr.error(`Update Password Failure: ${error.message}`);
            return of(updateProfilePasswordFailure({error:error}));
          }),
         
        );
      }),
    ));

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
       
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
        this.toastr.success('You are logged out !!!');
      }),
      exhaustMap(() => of(logoutSuccess({user: null, token: null})))
    )
  );

  private getErrorMessage(error: any): string {
    // Implement logic to convert backend error to user-friendly message
    if (error.status === 400) {
      return 'Please check your inputs and try again.';
    } else if (error.status === 409) {
      return 'A Merchant with these data already exists.';
    } else {
      return 'An unexpected error occurred. Please try again later.';
    }
  }

}