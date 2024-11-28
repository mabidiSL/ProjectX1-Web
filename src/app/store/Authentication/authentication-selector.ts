import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState } from './authentication.reducer';

export const getLayoutState = createFeatureSelector<AuthenticationState>('auth');

export const getUser = createSelector(
    getLayoutState,
    (state: AuthenticationState) => state.user
);

export const selectUserToken = createSelector(
    getLayoutState,
    (state: AuthenticationState) => state.token
  );
export const getisLoggedIn = createSelector(
    getLayoutState,
    (state: AuthenticationState) => state.isLoggedIn
);
export const selectMessage = createSelector(
  getLayoutState,
  (state: AuthenticationState) => state.message
);
export const selectDataLoading = createSelector(
    getLayoutState,
    (state: AuthenticationState) => state?.loading || false
  );
  export const selectCompany = createSelector(
    getLayoutState,
    (state: AuthenticationState) => state?.company || null
  );
  export const selectLoggedUser = createSelector(
    getLayoutState,
    (state: AuthenticationState) => state?.user || null
  );
export const getError = createSelector(
    getLayoutState,
    (state: AuthenticationState) => state.error
);