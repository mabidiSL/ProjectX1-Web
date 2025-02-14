import { createAction, props } from '@ngrx/store';
import { Contact } from './contacts.model';

// fetch all list
export const fetchContactsData = createAction('[Data] fetch Contacts');
export const fetchContactsSuccess = createAction('[Data] fetch Contacts success', props<{ Contactsdata: Contact[]}>())
export const fetchContactsFail = createAction('[Data fetch Contacts failed]', props<{ error: string }>())


// Add Data
export const addContacts = createAction('[Data] Add Contacts',  props<{ newData: Contact }>());
export const addContactsSuccess = createAction('[Data] Add Contacts Success', props<{ newData: Contact }>());
export const addContactsFailure = createAction('[Data] Add Contacts Failure', props<{ error: string }>());

//get Contact by ID

export const getContactById = createAction('[Data] get Contact', props<{ ContactId: number }>());
export const getContactByIdSuccess = createAction('[Data] get Contact success', props<{ Contact: Contact }>());
export const getContactByIdFailure = createAction('[Data] get Contact Failure', props<{ error: string }>());

// Update Data
export const updateContacts = createAction(
    '[Data] Update Contacts',
   // props<{ updatedData: ContactsModel }>()
   props<{ updatedData: Contact }>()

);
export const updateContactsSuccess = createAction(
    '[Data] Update Contacts Success',
    props<{ updatedData: Contact }>()
);
export const updateContactsFailure = createAction(
    '[Data] Update Contacts Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteContacts = createAction(
    '[Data] Delete Contacts',
    props<{ userId: number }>()
);
export const deleteContactsSuccess = createAction(
    '[Data] Delete Contacts Success',
    props<{ userId: number }>()
);
export const deleteContactsFailure = createAction(
    '[Data] Delete Contacts Failure',
    props<{ error: string }>()
);