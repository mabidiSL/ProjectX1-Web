/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';
import { environment } from 'src/environments/environment';
//import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject = new BehaviorSubject<_User | null>(null);
    public currentUser$: Observable<_User | null> = this.currentUserSubject.asObservable();
    

    constructor(private http: HttpClient) {
        
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          this.currentUserSubject.next(JSON.parse(storedUser));
        }
      }
    
      public get currentUserValue(): _User | null {
        return this.currentUserSubject.value;
      }
      
    
      setCurrentUser(user: _User | null): void {
        if (user) {
         
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {

          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(user);
      }

    verifyEmail(token: string){
        return this.http.post<any>(`${environment.baseURL}/auth/verify-email`, {token} );

    }
    register ( data: any){
        return this.http.post<any>(`${environment.baseURL}/auth/register-merchant`, data );

    }
    login(loginKey: string, password: string) {
       
        return this.http.post<any>(`${environment.baseURL}/auth/login`, { loginKey, password });
      
    }
    forgotPassword(email: string){
        return this.http.post(`${environment.baseURL}/auth/forgot-password`,{email}) ;
    }
    updateProfilePassword( oldPassword: string, newPassword: string){
       // const id = this.currentUserSubject.value.userId;
         return this.http.post(`${environment.baseURL}/auth/change-password`,{oldPassword,newPassword});
        
    }
    updatePassword(password: string, token: string){

        return this.http.post(`${environment.baseURL}/auth/reset-password`,{password, token});
      
   }
    updateProfile(user: any){
        const id = user.id;
        delete user.id;
        return this.http.patch(`${environment.baseURL}/users/${id}`,user) ;
    }
    updateCompanyProfile(company: any){
        const id = company.id;
        delete company.id;
        return this.http.patch(`${environment.baseURL}/companies/${id}`,company) ;
    }
    getCompanyProfile(companyId: number){
 
        return this.http.get<any>(`${environment.baseURL}/companies/${companyId}`) ;
    }
    refreshToken(refreshToken: string): Observable<any> {
        return this.http.post(`${environment.baseURL}/auth/refresh`, { refreshToken: refreshToken });
    }
    logout() {
        
        this.currentUserSubject.next(null);
        return this.http.post(`${environment.baseURL}/auth/logout`,{}) ;
        
    }
    clearSession(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
}
