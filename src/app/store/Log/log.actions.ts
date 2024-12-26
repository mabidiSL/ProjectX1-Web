import { createAction, props } from '@ngrx/store';
import { Log, LogListModel } from './log.models';

// fetch all list
export const fetchLoglistData = createAction('[Data] fetch Loglist',props<{ page?: number; itemsPerPage?: number , query?: string, actionDate?: string}>());
export const fetchLoglistSuccess = createAction('[Data] fetch Loglist success', props<{ LogListdata: LogListModel }>())
export const fetchLoglistFail = createAction('[Data fetch Loglist failed]', props<{ error: string }>())


//get Log by ID
export const getLogById = createAction('[Data] get Log', props<{ LogId: number }>());
export const getLogByIdSuccess = createAction('[Data] get Log success', props<{ Log: Log }>());
export const getLogByIdFailure = createAction('[Data] get Log Failure', props<{ error: string }>());
