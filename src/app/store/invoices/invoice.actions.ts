import { createAction, props } from '@ngrx/store';
import { Invoice, InvoiceListModel } from './invoice.models';

// fetch all list
export const fetchInvoicelistData = createAction('[Data] fetch Invoicelist',props<{ page?: number; itemsPerPage?: number, query?: string, date?:string, status?: string}>());
export const fetchInvoicelistSuccess = createAction('[Data] fetch Invoicelist success', props<{ InvoiceListdata: InvoiceListModel }>())
export const fetchInvoicelistFail = createAction('[Data fetch Invoicelist failed]', props<{ error: string }>())

// Add Data
export const addInvoicelist = createAction('[Data] Add Invoicelist',  props<{ newData: Invoice }>());
export const addInvoicelistSuccess = createAction('[Data] Add Invoicelist Success', props<{ newData: Invoice }>());
export const addInvoicelistFailure = createAction('[Data] Add Invoicelist Failure', props<{ error: string }>());
//get Invoice by ID
export const getInvoiceById = createAction('[Data] get Invoice', props<{ InvoiceId: number }>());
export const getInvoiceByIdSuccess = createAction('[Data] get Invoice success', props<{ Invoice: Invoice }>());
export const getInvoiceByIdFailure = createAction('[Data] get Invoice Failure', props<{ error: string }>());

// Update Data
export const updateInvoicelist = createAction(
    '[Data] Update Invoicelist',
    props<{ updatedData: Invoice }>()
);
export const updateInvoicelistSuccess = createAction(
    '[Data] Update Invoicelist Success',
    props<{ updatedData: Invoice }>()
);
export const updateInvoicelistFailure = createAction(
    '[Data] Update Invoicelist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteInvoicelist = createAction(
    '[Data] Delete Invoicelist',
    props<{ InvoiceId: number }>()
);
export const deleteInvoicelistSuccess = createAction(
    '[Data] Delete Invoicelist Success',
    props<{ InvoiceId: number }>()
);
export const deleteInvoicelistFailure = createAction(
    '[Data] Delete Invoicelist Failure',
    props<{ error: string }>()
);