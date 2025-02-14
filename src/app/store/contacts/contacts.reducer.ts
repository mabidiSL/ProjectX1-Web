// src/app/Contacts.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addContacts, addContactsFailure, addContactsSuccess, deleteContacts, deleteContactsFailure, deleteContactsSuccess, fetchContactsData, fetchContactsFail, fetchContactsSuccess, getContactById, getContactByIdFailure, getContactByIdSuccess, updateContacts, updateContactsFailure, updateContactsSuccess } from './contacts.action';
import { Contact } from './contacts.model';

export interface ContactsState {
  Contactsdata: Contact[];
  currentPage: number;
  totalItems: number;
  selectedContact: Contact,
  loading: boolean;
  error: string;
}

export const initialState: ContactsState = {
  Contactsdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedContact: null,
  loading: false,
  error: null,
};

export const ContactsReducer = createReducer(
  initialState,
  on(fetchContactsData,(state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchContactsSuccess, (state, { Contactsdata }) => ({
    ...state,
    Contactsdata: Contactsdata,
    loading: false,
    error: null

  })),
  on(fetchContactsFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding Contact 
   on(addContacts, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Contact success
  on(addContactsSuccess, (state, { newData }) => ({
    ...state,
    Contactsdata: [newData, ...state.Contactsdata],
    loading: false,
    error: null 

  })),
    //Handle adding Contact failure
    on(addContactsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false, 
    })),

    //Handle getting Contact by id
  on(getContactById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  
  // Handle success of getting Employee by ID and store the Employee object in the state
  on(getContactByIdSuccess, (state, { Contact }) => ({
    ...state,
    selectedContact: Contact,
    loading: false,
    error: null 
  })),
  // Handle success of getting Contact by ID and store the Contact object in the state
  on(getContactByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
   // Handle updating Contact list
   on(updateContacts, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
 
// Handle updating Contact status
  on(updateContactsSuccess, (state, { updatedData }) => {
   const ContactsUpdated = state.Contactsdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      Contactsdata: ContactsUpdated,
      loading: false,
      error: null
    };
  }),
   // Handle updating Contact failure
   on(updateContactsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Contact 
  on(deleteContacts, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Contact
  on(deleteContactsSuccess, (state, { userId }) => {
    
    const updatedContacts = state.Contactsdata.filter(Contact => Contact.id !== userId);
    return { 
    ...state,
    Contactsdata: updatedContacts,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Contact
  on(deleteContactsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
