import { createAction, props } from '@ngrx/store';
import { AreaListModel } from './area.model';

// fetch all list
export const fetchArealistData = createAction('[Data] fetch Arealist',props<{ page: number; itemsPerPage: number, status: string }>());
export const fetchArealistSuccess = createAction('[Data] fetch Arealist success', props<{ AreaListdata: any }>())
export const fetchArealistFail = createAction('[Data fetch Arealist failed]', props<{ error: string }>())


// Add Data
export const addArealist = createAction('[Data] Add Arealist',  props<{ newData: AreaListModel }>());
export const addArealistSuccess = createAction('[Data] Add Arealist Success', props<{ newData: any }>());
export const addArealistFailure = createAction('[Data] Add Arealist Failure', props<{ error: string }>());
//get Area by ID
export const getAreaById = createAction('[Data] get Area', props<{ AreaId: string }>());
export const getAreaByIdSuccess = createAction('[Data] get Area success', props<{ Area: any }>());
export const getAreaByIdFailure = createAction('[Data] get Area Failure', props<{ error: string }>());

// Update Data
export const updateArealist = createAction(
    '[Data] Update Arealist',
    props<{ updatedData: AreaListModel }>()
);
export const updateArealistSuccess = createAction(
    '[Data] Update Arealist Success',
    props<{ updatedData: AreaListModel }>()
);
export const updateArealistFailure = createAction(
    '[Data] Update Arealist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteArealist = createAction(
    '[Data] Delete Arealist',
    props<{ AreaId: string }>()
);
export const deleteArealistSuccess = createAction(
    '[Data] Delete Arealist Success',
    props<{ AreaId: string }>()
);
export const deleteArealistFailure = createAction(
    '[Data] Delete Arealist Failure',
    props<{ error: string }>()
);