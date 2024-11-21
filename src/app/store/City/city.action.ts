import { createAction, props } from '@ngrx/store';
import { CityListModel } from './city.model';

// fetch all list
export const fetchCitylistData = createAction('[Data] fetch Citylist',props<{ page: number; itemsPerPage: number, status: string }>());
export const fetchCitylistSuccess = createAction('[Data] fetch Citylist success', props<{ CityListdata: CityListModel}>())
export const fetchCitylistFail = createAction('[Data fetch Citylist failed]', props<{ error: string }>())
