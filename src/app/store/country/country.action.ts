import { createAction, props } from '@ngrx/store';
import { CountryListModel } from './country.model';

// fetch all list
export const fetchCountrylistData = createAction('[Data] fetch Countrylist',props<{ page: number; itemsPerPage: number, status: string }>());
export const fetchCountrylistSuccess = createAction('[Data] fetch Countrylist success', props<{ CountryListdata: CountryListModel}>())
export const fetchCountrylistFail = createAction('[Data fetch Countrylist failed]', props<{ error: string }>())

