// src/app/Orderlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addOrderlist, addOrderlistFailure, addOrderlistSuccess, deleteOrderlist, deleteOrderlistFailure, deleteOrderlistSuccess, fetchOrderlistData, fetchOrderlistFail, fetchOrderlistSuccess, getOrderById, getOrderByIdFailure, getOrderByIdSuccess, updateOrderlist, updateOrderlistFailure, updateOrderlistSuccess } from './order.actions';
import { Order } from './order.models';

export interface OrderlistState {
  OrderListdata: Order[];
  currentPage: number;
  totalItems: number;
  selectedOrder: Order;
  loading: boolean;
  error: string;
}

export const initialState: OrderlistState = {
  OrderListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedOrder: null,
  loading: false,
  error: null,
};

export const OrderListReducer = createReducer(
  initialState,
  on(fetchOrderlistData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchOrderlistSuccess, (state, { OrderListdata }) => ({
    ...state,
    OrderListdata: OrderListdata.data,
    totalItems:OrderListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchOrderlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  //Handle adding Order 
  on(addOrderlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Order success
  on(addOrderlistSuccess, (state, { newData }) => ({
    ...state,
    OrderListdata: [newData,...state.OrderListdata],
    loading: false,
    error: null 

  })),
    //Handle adding Order failure
    on(addOrderlistFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false
    })),
    //Handle getting Order by id
    on(getOrderById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting Order by ID and store the Order object in the state
   on(getOrderByIdSuccess, (state, { Order }) => ({
    ...state,
    selectedOrder: Order,
    loading: false,
    error: null 

  })),
 // Handle success of getting Order by ID and store the Order object in the state
 on(getOrderByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
// Handle updating Order list
on(updateOrderlist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
// Handle updating Order success
  on(updateOrderlistSuccess, (state, { updatedData }) => {
   const OrderListUpdated = state.OrderListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      OrderListdata: OrderListUpdated,
      loading: false,
      error: null
    };
  }),
  // Handle updating Order failure
  on(updateOrderlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Order 
  on(deleteOrderlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Order
  on(deleteOrderlistSuccess, (state, { OrderId }) => {
    const updatedOrderList = state.OrderListdata.filter(Order => Order.id !== OrderId);
    return { 
    ...state,
    OrderListdata: updatedOrderList,
    loading: false,
    error: null
  };
  }),
  // Handle failure of deleting a Order
  on(deleteOrderlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
