// src/app/merchantlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  ContactsState } from './contacts.reducer';

export const selectDataState = createFeatureSelector<ContactsState>('ContactList');

export const selectDataContact = createSelector(
  selectDataState,
  (state: ContactsState) => state?.Contactsdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: ContactsState) => state?.totalItems || 0
);

export const selectedContact = createSelector(
    selectDataState,
    (state: ContactsState) =>  state?.selectedContact || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: ContactsState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: ContactsState) => state?.error || null
);
