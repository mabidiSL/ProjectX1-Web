import { createAction, props } from '@ngrx/store';
import { WinsModel, Win } from './wins.model';

// fetch all list
export const fetchWinsData = createAction('[Data] fetch Wins', props<{page: number, itemsPerPage: number, query?: string}>());
export const fetchWinsSuccess = createAction('[Data] fetch Wins success', props<{ Winsdata: WinsModel}>())
export const fetchWinsFail = createAction('[Data fetch Wins failed]', props<{ error: string }>())


// Add Data
export const addWins = createAction('[Data] Add Wins',  props<{ newData: Win }>());
export const addWinsSuccess = createAction('[Data] Add Wins Success', props<{ newData: Win }>());
export const addWinsFailure = createAction('[Data] Add Wins Failure', props<{ error: string }>());

//get Win by ID
export const getWinById = createAction('[Data] get Win', props<{ WinId: number }>());
export const getWinByIdSuccess = createAction('[Data] get Win success', props<{ Win: Win }>());
export const getWinByIdFailure = createAction('[Data] get Win Failure', props<{ error: string }>());

// Update Data
export const updateWins = createAction(
    '[Data] Update Wins',
   // props<{ updatedData: WinsModel }>()
   props<{ updatedData: Win }>()

);
export const updateWinsSuccess = createAction(
    '[Data] Update Wins Success',
    props<{ updatedData: Win }>()
);
export const updateWinsFailure = createAction(
    '[Data] Update Wins Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteWins = createAction(
    '[Data] Delete Wins',
    props<{ userId: number }>()
);
export const deleteWinsSuccess = createAction(
    '[Data] Delete Wins Success',
    props<{ userId: number }>()
);
export const deleteWinsFailure = createAction(
    '[Data] Delete Wins Failure',
    props<{ error: string }>()
);