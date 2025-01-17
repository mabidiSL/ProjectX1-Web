import { createAction, props } from '@ngrx/store';
import { Order, OrderListModel } from './order.models';

// fetch all list
export const fetchOrderlistData = createAction('[Data] fetch Orderlist',props<{ page?: number; itemsPerPage?: number, query?: string, company_id?: number,date?:string, status?: string}>());
export const fetchOrderlistSuccess = createAction('[Data] fetch Orderlist success', props<{ OrderListdata: OrderListModel }>())
export const fetchOrderlistFail = createAction('[Data fetch Orderlist failed]', props<{ error: string }>())

// Add Data
export const addOrderlist = createAction('[Data] Add Orderlist',  props<{ newData: Order }>());
export const addOrderlistSuccess = createAction('[Data] Add Orderlist Success', props<{ newData: Order }>());
export const addOrderlistFailure = createAction('[Data] Add Orderlist Failure', props<{ error: string }>());
//get Order by ID
export const getOrderById = createAction('[Data] get Order', props<{ OrderId: number }>());
export const getOrderByIdSuccess = createAction('[Data] get Order success', props<{ Order: Order }>());
export const getOrderByIdFailure = createAction('[Data] get Order Failure', props<{ error: string }>());

// Update Data
export const updateOrderlist = createAction(
    '[Data] Update Orderlist',
    props<{ updatedData: Order }>()
);
export const updateOrderlistSuccess = createAction(
    '[Data] Update Orderlist Success',
    props<{ updatedData: Order }>()
);
export const updateOrderlistFailure = createAction(
    '[Data] Update Orderlist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteOrderlist = createAction(
    '[Data] Delete Orderlist',
    props<{ OrderId: number }>()
);
export const deleteOrderlistSuccess = createAction(
    '[Data] Delete Orderlist Success',
    props<{ OrderId: number }>()
);
export const deleteOrderlistFailure = createAction(
    '[Data] Delete Orderlist Failure',
    props<{ error: string }>()
);