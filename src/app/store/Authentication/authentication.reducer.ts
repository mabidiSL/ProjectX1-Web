import { createReducer, on } from '@ngrx/store';
import { Register, RegisterFailure, RegisterSuccess, forgetPassword, forgetPasswordFailure, forgetPasswordSuccess, login, loginFailure, loginSuccess, logout, logoutSuccess, updatePassword, updatePasswordFailure, updatePasswordSuccess, updateProfile, updateProfileFailure, updateProfilePassword, updateProfilePasswordFailure, updateProfilePasswordSuccess, updateProfileSuccess, verifyEmail, verifyEmailFailure, verifyEmailSuccess } from './authentication.actions';
import { _User } from './auth.models';

export interface AuthenticationState {
    isLoggedIn: boolean;
    loading: boolean,
    user: _User | null;
    message: string;
    token: string |null;
    error: string | null;
}

const initialState: AuthenticationState = {
    isLoggedIn: false,
    loading: false,
    message: null,
    user: null,
    token: null,
    error: null,
};

export const authenticationReducer = createReducer(
    initialState,
    on(Register, (state) => ({ ...state, loading: true, error: null })),
    on(RegisterSuccess, (state, { user }) => ({ ...state, loading: false, isLoggedIn: false, user, error: null, })),
    on(RegisterFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(verifyEmail, (state) => ({ ...state, loading: true, error: null })),
    on(verifyEmailSuccess, (state, {message}) => ({ ...state, loading: false, isLoggedIn: false,message,  error: null, })),
    on(verifyEmailFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(login, (state) => ({ ...state, loading: true, error: null })),
    on(loginSuccess, (state, { user, token }) => ({ ...state, loading: false, isLoggedIn: true, user,token, error: null, })),
    on(loginFailure, (state, { error }) => ({ ...state, loading: false, isLoggedIn: false, error })),
   
    on(logout, (state) => ({ ...state, user: null, loading: true, isLoggedIn: false, token: null, error: null })),
    on(logoutSuccess, (state, { user, token }) => ({ ...state, loading: false, user, token, isLoggedIn: false, error: null })),
    
    on(forgetPassword, state => ({ ...state, loading: true, error: null, })),
    on(forgetPasswordSuccess, (state, { message }) => ({ ...state, loading: false,  message,  error: null,    })),
    on(forgetPasswordFailure, (state, { error }) => ({ ...state,  loading: false,  error,  })) ,
    
    on(updatePassword, state => ({   ...state,  loading: true, error: null, })),
    on(updatePasswordSuccess, (state, { message }) => ({  ...state,   loading: false, message, error: null,   })),
    on(updatePasswordFailure, (state, { error }) => ({ ...state, loading: false, error,  })),
    
    on(updateProfile, (state) => ({ ...state, loading: true, error: null })),
    on(updateProfileSuccess, (state, { user }) => ({ ...state, loading: false, user, error: null })),
    on(updateProfileFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(updateProfilePassword, state => ({ ...state,  loading: true,  error: null, })),
    on(updateProfilePasswordSuccess, (state, { message }) => ({ ...state, loading: false,message, error: null,  })),
    on(updateProfilePasswordFailure, (state, { error }) => ({ ...state, loading: false,  error, }))

);
