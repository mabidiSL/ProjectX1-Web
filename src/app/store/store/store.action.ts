import { createAction, props } from '@ngrx/store';
import { StoreListModel } from './store.model';

// fetch all list
export const fetchStorelistData = createAction('[Data] fetch Storelist', props<{ page?: number; itemsPerPage?: number, status?: string, city_id?:any,  merchant_id?: any }>());
export const fetchStorelistSuccess = createAction('[Data] fetch Storelist success', props<{ StoreListdata: any /*StoreListModel[]*/ }>())
export const fetchStorelistFail = createAction('[Data fetch Storelist failed]', props<{ error: string }>())

// Add Data
export const addStorelist = createAction('[Data] Add Storelist',  props<{ newData: StoreListModel }>());
export const addStorelistSuccess = createAction('[Data] Add Storelist Success', props<{ newData: any }>());
export const addStorelistFailure = createAction('[Data] Add Storelist Failure', props<{ error: string }>());

//get Store by ID
export const getStoreById = createAction('[Data] get Store', props<{ StoreId: string }>());
export const getStoreByIdSuccess = createAction('[Data] get Store success', props<{ Store: any }>());
export const getStoreByIdFailure = createAction('[Data] get Store Failure', props<{ error: string }>());

// Update Data
export const updateStorelist = createAction(
    '[Data] Update Storelist',
    props<{ updatedData: any }>()
);
export const updateStorelistSuccess = createAction(
    '[Data] Update Storelist Success',
    props<{ updatedData: StoreListModel }>()
);
export const updateStorelistFailure = createAction(
    '[Data] Update Storelist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteStorelist = createAction(
    '[Data] Delete Storelist',
    props<{ storeId: string }>()
);
export const deleteStorelistSuccess = createAction(
    '[Data] Delete Storelist Success',
    props<{ storeId: string }>()
);
export const deleteStorelistFailure = createAction(
    '[Data] Delete Storelist Failure',
    props<{ error: string }>()
);