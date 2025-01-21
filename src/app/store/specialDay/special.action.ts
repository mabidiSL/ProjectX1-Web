import { createAction, props } from '@ngrx/store';
import { SpecialDay, SpecialDayListModel } from './special.model';

// fetch all list
export const fetchSpecialDaylistData = createAction('[Data] fetch SpecialDaylist',props<{ page: number; itemsPerPage: number,query: string, startDate?: string, endDate?: string }>());
export const fetchSpecialDaylistSuccess = createAction('[Data] fetch SpecialDaylist success', props<{ SpecialDayListdata: SpecialDayListModel }>())
export const fetchSpecialDaylistFail = createAction('[Data fetch SpecialDaylist failed]', props<{ error: string }>())

// Add Data
export const addSpecialDaylist = createAction('[Data] Add SpecialDaylist',  props<{ newData: SpecialDay}>());
export const addSpecialDaylistSuccess = createAction('[Data] Add SpecialDaylist Success', props<{ newData: SpecialDay }>());
export const addSpecialDaylistFailure = createAction('[Data] Add SpecialDaylist Failure', props<{ error: string }>());

//get SpecialDay by ID
export const getSpecialDayById = createAction('[Data] get SpecialDay', props<{ SpecialDayId: number }>());
export const getSpecialDayByIdSuccess = createAction('[Data] get SpecialDay success', props<{ SpecialDay: SpecialDay }>());
export const getSpecialDayByIdFailure = createAction('[Data] get SpecialDay Failure', props<{ error: string }>());

// Update Data
export const updateSpecialDaylist = createAction('[Data] Update SpecialDaylist', props<{ updatedData: SpecialDay }>());
export const updateSpecialDaylistSuccess = createAction('[Data] Update SpecialDaylist Success', props<{ updatedData: SpecialDay }>());
export const updateSpecialDaylistFailure = createAction('[Data] Update SpecialDaylist Failure', props<{ error: string }>());

// Delete Data
export const deleteSpecialDaylist = createAction('[Data] Delete SpecialDaylist', props<{ SpecialDayId: number }>());
export const deleteSpecialDaylistSuccess = createAction('[Data] Delete SpecialDaylist Success', props<{ SpecialDayId: number }>());
export const deleteSpecialDaylistFailure = createAction('[Data] Delete SpecialDaylist Failure', props<{ error: string }>());