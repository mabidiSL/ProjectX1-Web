/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { login, loginSuccess, loginFailure, forgetPassword, logout, logoutSuccess, Register, RegisterSuccess, RegisterFailure, updatePassword, updatePasswordFailure, updatePasswordSuccess, updateProfile, updateProfilePassword, updateProfileSuccess, updateProfileFailure, updateProfilePasswordSuccess, updateProfilePasswordFailure, forgetPasswordSuccess, forgetPasswordFailure, verifyEmailSuccess, verifyEmail, verifyEmailFailure, updateCompanyProfile, updateCompanyProfileSuccess, updateCompanyProfileFailure, getCompanyProfile, getCompanyProfileSuccess, getCompanyProfileFailure } from './authentication.actions';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { _User, User } from './auth.models';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class AuthenticationEffects {
  
  private currentUserSubject: BehaviorSubject<_User>;
  public currentUser: Observable<_User>;

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthService: AuthenticationService,
    private router: Router,
    private formUtilService: FormUtilService,
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
        
          return this.AuthService.register(newData ).pipe(
            map((user) => {
              if(user){
              this.toastr.success('Registration completed, Check you Inbox soon!!!');
              this.router.navigate(['/auth/login']);
              return RegisterSuccess({ user })
              }
            }),
            catchError((error) => {
              const errorMessage = this.formUtilService.getErrorMessage(error);
              this.toastr.error(errorMessage); 
              return of(RegisterFailure({ error: errorMessage }))
            })
          );
       
      })
    )
  );

  verifyEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(verifyEmail),
      exhaustMap(({ token }) => {
        
          return this.AuthService.verifyEmail(token).pipe(
            map((message: any) => {
              if(message){
              this.toastr.success('Email Verified');
             // this.router.navigate(['/auth/login']);
              return verifyEmailSuccess({ message: message.result })
              }
            }),
            catchError((error) => {
              const errorMessage = this.formUtilService.getErrorMessage(error);
              this.toastr.error(errorMessage); 
              return of(verifyEmailFailure({ error: errorMessage }))
            })
          );
       
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) => {
        
          return this.AuthService.login(email, password).pipe(
            map((response) => {
                      
                localStorage.setItem('token', response.result.accessToken);
                localStorage.setItem('refreshToken', response.result.refreshToken);
                localStorage.setItem('currentUser', JSON.stringify(response.result.user));
               // console.log(response.result.user);
                this.currentUserSubject.next(response.result.user);
                this.router.navigate(['/private']);
                //this.toastr.success('Login successfully!!!');
                return loginSuccess({ user: response.result.user, token: response.result.accessToken });

            }),
            catchError((error) => {
              const errorMessage = this.formUtilService.getErrorMessage(error);
              this.toastr.error(errorMessage); 
              return of(loginFailure({ error: errorMessage }))})); 
            
        
      })
    )
  );
 
  forgetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forgetPassword),
      exhaustMap((action) => {
        return this.AuthService.forgotPassword(action.email).pipe(
          map((response: any) => {
            this.toastr.success(response.result);
            return forgetPasswordSuccess({message: response.result});
          }),
          catchError((error: any) => {
            const errorMessage = this.formUtilService.getErrorMessage(error);
              this.toastr.error(errorMessage);
            return of(forgetPasswordFailure({error: errorMessage}));
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
        return this.AuthService.updatePassword(password, token).pipe(
          map((response: any) => {
            this.toastr.success('Password has been updated successfully!!!');
            return updatePasswordSuccess({message: response});

          }),
          catchError((error: any) => {
            const errorMessage = this.formUtilService.getErrorMessage(error);
              this.toastr.error(errorMessage);
            return of(updatePasswordFailure({error: errorMessage}));}),
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
      return this.AuthService.updateProfile(user.user).pipe(
        map(() => {
             localStorage.setItem('currentUser', JSON.stringify(user.user));
            this.toastr.success('The profile was updated successfully.');
            this.router.navigate(['/private/dashboard']);
            return updateProfileSuccess({user:user.user});
          }
         
        ),
        catchError((error: any) => {
          const errorMessage = this.formUtilService.getErrorMessage(error);
          this.toastr.error(errorMessage);
          return of(updateProfileFailure({ error:errorMessage }));
        }),
       
      );
    }),
  ));

  updateCompanyProfile$ = createEffect(()=>
    this.actions$.pipe(
    ofType(updateCompanyProfile),
    exhaustMap((company : any ) => {
      return this.AuthService.updateCompanyProfile(company).pipe(
        map((response : any) => {
            //localStorage.setItem('currentUser', JSON.stringify(user.user));
            this.toastr.success('The company profile was updated successfully.');
            this.router.navigate(['/private/dashboard']);
            return updateCompanyProfileSuccess({company:response});
          }
         
        ),
        catchError((error: any) => {
          const errorMessage = this.formUtilService.getErrorMessage(error);
          this.toastr.error(errorMessage);
          return of(updateCompanyProfileFailure({ error:errorMessage }));
        }),
       
      );
    }),
  ));   
  getCompanyProfile$ = createEffect(()=>
    this.actions$.pipe(
    ofType(getCompanyProfile),
    exhaustMap(({companyId}) => {
      console.log(companyId);
      return this.AuthService.getCompanyProfile(companyId).pipe(
        map((response : any) => {
            
            return getCompanyProfileSuccess({company:response.result});
          }
         
        ),
        catchError((error: any) => {
          const errorMessage = this.formUtilService.getErrorMessage(error);
          this.toastr.error(errorMessage);
          return of(getCompanyProfileFailure({ error:errorMessage }));
        }),
       
      );
    }),
  ));
  updateProfilePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProfilePassword),
      exhaustMap(({ oldPassword, newPassword}) => {
        return this.AuthService.updateProfilePassword( oldPassword, newPassword).pipe(
          map((response: any) => {
            if (response) {
             
              this.toastr.success('The password was updated successfully.');
              this.router.navigate(['/private/dashboard']);
              return updateProfilePasswordSuccess({message:response});
            }
            
          }),
          catchError((error: any) => {
            
            const errorMessage = this.formUtilService.getErrorMessage(error);
            this.toastr.error(errorMessage);
            return of(updateProfilePasswordFailure({error: errorMessage}));
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

  

}