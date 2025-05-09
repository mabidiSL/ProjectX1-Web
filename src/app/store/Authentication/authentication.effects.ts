/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { login, loginSuccess, loginFailure, forgetPassword, logout, logoutSuccess, Register, RegisterSuccess, RegisterFailure, updatePassword, updatePasswordFailure, updatePasswordSuccess, updateProfile, updateProfilePassword, updateProfileSuccess, updateProfileFailure, updateProfilePasswordSuccess, updateProfilePasswordFailure, forgetPasswordSuccess, forgetPasswordFailure, verifyEmailSuccess, verifyEmail, verifyEmailFailure, updateCompanyProfile, updateCompanyProfileSuccess, updateCompanyProfileFailure, getCompanyProfile, getCompanyProfileSuccess, getCompanyProfileFailure, logoutFailure } from './authentication.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormUtilService } from 'src/app/core/services/form-util.service';

@Injectable()
export class AuthenticationEffects {

  

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthService: AuthenticationService,
    private router: Router, 
    private route: ActivatedRoute,
    private formUtilService: FormUtilService,
    public toastr:ToastrService) {

      
     }
     
 

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ newData }) => {
        
          return this.AuthService.register(newData ).pipe(
            map((user) => {
              if(user){
             
              return RegisterSuccess({ user })
              }
            }),
            catchError((error) => {
              const errorMessage = this.formUtilService.getErrorMessage(error);
              if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 

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
              return verifyEmailSuccess({ message: message.result })
              }
            }),
            catchError((error) => {
              const errorMessage = this.formUtilService.getErrorMessage(error);
              if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
 
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

              const user = response.result.user;
              const token = response.result.accessToken;
              const refreshToken = response.result.refreshToken;
              const companyId = response.result.user.companyId;
              // Delegate state update to the AuthenticationService
              this.AuthService.setCurrentUser(user);
              localStorage.setItem('token', token);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('companyId', companyId);


              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/private';
              this.router.navigate([returnUrl]);
              return loginSuccess({ user: user, token: token });

            }),
            catchError((error) => {
              const errorMessage = this.formUtilService.getErrorMessage(error);
              if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  }   
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
            if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
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
            if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
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
        map((response:any) => {
          
          this.AuthService.setCurrentUser(response.result);
            this.toastr.success('The profile was updated successfully.');
            this.router.navigate(['/private/dashboard']);
            return updateProfileSuccess({user:response.result});
          }
         
        ),
        catchError((error: any) => {
          const errorMessage = this.formUtilService.getErrorMessage(error);
          if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
          return of(updateProfileFailure({ error:errorMessage }));
        }),
       
      );
    }),
  ));

  updateCompanyProfile$ = createEffect(()=>
    this.actions$.pipe(
    ofType(updateCompanyProfile),
    exhaustMap(({company} ) => {
      return this.AuthService.updateCompanyProfile(company).pipe(
        map((response : any) => {
            const user = response.result.user;
            const companyId = localStorage.getItem('companyId');
            user.companyId = companyId;
            console.log(user);
            
            this.AuthService.setCurrentUser(user);
            this.toastr.success('The company profile was updated successfully.');
            this.router.navigate(['/private/dashboard']);
            return updateCompanyProfileSuccess({company:response.result});
          }
         
        ),
        catchError((error: any) => {
          const errorMessage = this.formUtilService.getErrorMessage(error);
          if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
          return of(updateCompanyProfileFailure({ error:errorMessage }));
        }),
       
      );
    }),
  ));   
  getCompanyProfile$ = createEffect(()=>
    this.actions$.pipe(
    ofType(getCompanyProfile),
    exhaustMap(({companyId}) => {
      return this.AuthService.getCompanyProfile(companyId).pipe(
        map((response : any) => {
            
            return getCompanyProfileSuccess({company:response.result});
          }
         
        ),
        catchError((error: any) => {
          const errorMessage = this.formUtilService.getErrorMessage(error);
          if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
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
            console.log(errorMessage);
            if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
              return of(updateProfilePasswordFailure({error: errorMessage}));
          }),
         
        );
      }),
    ));
    
    logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(logout),
        exhaustMap(() => {
          return this.AuthService.logout().pipe(
            map((response: any) => {
              if (response) {

                this.AuthService.clearSession(); // Clear local storage and subject
                this.router.navigate(['/auth/login']);
                this.toastr.success(response.result);
                return logoutSuccess({message:response.result});
              }
              
            }),
            catchError((error: any) => {
              
              const errorMessage = this.formUtilService.getErrorMessage(error);
              if (errorMessage !== 'An unknown error occurred') {
    this.toastr.error(errorMessage);
  } 
              return of(logoutFailure({error: errorMessage}));
            }),
           
          );
        }),
      )
    );
  
   
  
  

}