import { createAction, props } from '@ngrx/store';
import { CountryListModel } from './country.model';

// fetch all list
export const fetchCountrylistData = createAction('[Data] fetch Countrylist',props<{ page: number; itemsPerPage: number, status: string }>());
export const fetchCountrylistSuccess = createAction('[Data] fetch Countrylist success', props<{ CountryListdata: any}>())
export const fetchCountrylistFail = createAction('[Data fetch Countrylist failed]', props<{ error: string }>())

// Add Data
export const addCountrylist = createAction('[Data] Add Countrylist',  props<{ newData: CountryListModel }>());
export const addCountrylistSuccess = createAction('[Data] Add Countrylist Success', props<{ newData: any }>());
export const addCountrylistFailure = createAction('[Data] Add Countrylist Failure', props<{ error: string }>());
//get Country by ID
export const getCountryById = createAction('[Data] get Country', props<{ CountryId: string }>());
export const getCountryByIdSuccess = createAction('[Data] get Country success', props<{ Country: any }>());
export const getCountryByIdFailure = createAction('[Data] get Country Failure', props<{ error: string }>());

// Update Data
export const updateCountrylist = createAction(
    '[Data] Update Countrylist',
    props<{ updatedData: CountryListModel }>()
);
export const updateCountrylistSuccess = createAction(
    '[Data] Update Countrylist Success',
    props<{ updatedData: CountryListModel }>()
);
export const updateCountrylistFailure = createAction(
    '[Data] Update Countrylist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteCountrylist = createAction(
    '[Data] Delete Countrylist',
    props<{ CountryId: string }>()
);
export const deleteCountrylistSuccess = createAction(
    '[Data] Delete Countrylist Success',
    props<{ CountryId: string }>()
);
export const deleteCountrylistFailure = createAction(
    '[Data] Delete Countrylist Failure',
    props<{ error: string }>()
);