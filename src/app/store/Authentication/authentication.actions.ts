/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction, props } from '@ngrx/store';
import { _User } from './auth.models';

// Register action
export const Register = createAction('[Authentication] Register', props<{ newData : any }>());
export const RegisterSuccess = createAction('[Authentication] Register Success', props<{ user: any }>());
export const RegisterFailure = createAction('[Authentication] Register Failure', props<{ error: string }>());

//modal Register Success
export const modalRegisterSuccess = createAction('[Authentication] modal Register Success');

// Email verification action
export const verifyEmail = createAction('[Authentication] verifyEmail', props<{ token : string }>());
export const verifyEmailSuccess = createAction('[Authentication] verifyEmail Success', props<{ message: string }>());
export const verifyEmailFailure = createAction('[Authentication] verifyEmail Failure', props<{ error: string }>());
// login action
export const login = createAction('[Authentication] Login', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[Authentication] Login Success', props<{ user: _User, token: string }>());
export const loginFailure = createAction('[Authentication] Login Failure', props<{ error: any }>());

// forgotPassword action
export const forgetPassword = createAction('[Authentication] forgetPassword', props<{ email: string }>());
export const forgetPasswordSuccess = createAction('[Authentication] forgetPassword Success', props<{ message: any }>());
export const forgetPasswordFailure = createAction('[Authentication] forgetPassword Failure', props<{ error: any }>());

// UpdatePassword action
export const updatePassword = createAction('[Authentication] updatePassword', props<{ password: string , token: string}>());
export const updatePasswordSuccess = createAction('[Authentication] updatePassword Success', props<{ message: any }>());
export const updatePasswordFailure = createAction('[Authentication] updatePassword Failure', props<{ error: any }>());


// Update Profile Password action
export const updateProfilePassword = createAction('[Profile] updateProfilePassword', props<{ oldPassword: string , newPassword: string}>());
export const updateProfilePasswordSuccess = createAction('[Profile] updateProfilePassword Success', props<{ message: any }>());
export const updateProfilePasswordFailure = createAction('[Profile] updateProfilePassword Failure', props<{ error: any }>());


// logout action
export const logout = createAction('[Authentication] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success',props<{ message: string }>());
export const logoutFailure = createAction('[Profile] Logout Failure', props<{ error: any }>());

 
// Update Profile action
export const updateProfile = createAction('[Profile] updateProfile', props<{ user: any }>());
export const updateProfileSuccess = createAction('[Profile] updateProfile Success', props<{ user: any }>());
export const updateProfileFailure = createAction('[Profile] updateProfile Failure', props<{ error: any }>());

// Update Company Profile action
export const updateCompanyProfile = createAction('[Profile] updateCompanyProfile', props<{ company: any }>());
export const updateCompanyProfileSuccess = createAction('[Profile] updateCompanyProfile Success', props<{ company: any }>());
export const updateCompanyProfileFailure = createAction('[Profile] updateCompanyProfile Failure', props<{ error: string }>());

// get Company Profile by ID action
export const getCompanyProfile = createAction('[Profile] getCompanyProfile', props<{ companyId: number }>());
export const getCompanyProfileSuccess = createAction('[Profile] getCompanyProfileSuccess Success', props<{ company: any }>());
export const getCompanyProfileFailure = createAction('[Profile] getCompanyProfileFailure Failure', props<{ error: string }>());
