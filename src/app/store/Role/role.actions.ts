import { createAction, props } from '@ngrx/store';
import { RoleListModel } from './role.models';

// fetch all list
export const fetchRolelistData = createAction('[Data] fetch Rolelist',props<{ page?: number; itemsPerPage?: number , status?: any}>());
export const fetchRolelistSuccess = createAction('[Data] fetch Rolelist success', props<{ RoleListdata: any }>())
export const fetchRolelistFail = createAction('[Data fetch Rolelist failed]', props<{ error: string }>())

// Add Data
export const addRolelist = createAction('[Data] Add Rolelist',  props<{ newData: RoleListModel }>());
export const addRolelistSuccess = createAction('[Data] Add Rolelist Success', props<{ newData: any }>());
export const addRolelistFailure = createAction('[Data] Add Rolelist Failure', props<{ error: string }>());
//get Role by ID
export const getRoleById = createAction('[Data] get Role', props<{ RoleId: string }>());
export const getRoleByIdSuccess = createAction('[Data] get Role success', props<{ Role: any }>());
export const getRoleByIdFailure = createAction('[Data] get Role Failure', props<{ error: string }>());

// Update Data
export const updateRolelist = createAction(
    '[Data] Update Rolelist',
    props<{ updatedData: RoleListModel }>()
);
export const updateRolelistSuccess = createAction(
    '[Data] Update Rolelist Success',
    props<{ updatedData: RoleListModel }>()
);
export const updateRolelistFailure = createAction(
    '[Data] Update Rolelist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteRolelist = createAction(
    '[Data] Delete Rolelist',
    props<{ RoleId: string }>()
);
export const deleteRolelistSuccess = createAction(
    '[Data] Delete Rolelist Success',
    props<{ RoleId: string }>()
);
export const deleteRolelistFailure = createAction(
    '[Data] Delete Rolelist Failure',
    props<{ error: string }>()
);