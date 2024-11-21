import { createAction, props } from '@ngrx/store';
import {  AreaListModel } from './area.model';

// fetch all list
export const fetchArealistData = createAction('[Data] fetch Arealist',props<{ page: number; itemsPerPage: number, status: string }>());
export const fetchArealistSuccess = createAction('[Data] fetch Arealist success', props<{ AreaListdata: AreaListModel }>())
export const fetchArealistFail = createAction('[Data fetch Arealist failed]', props<{ error: string }>())


