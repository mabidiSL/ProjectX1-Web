import { createAction, props } from '@ngrx/store';
import { QuotesModel, Quote } from './quotes.model';

// fetch all list
export const fetchQuotesData = createAction('[Data] fetch Quotes', props<{page: number, itemsPerPage: number, query?: string}>());
export const fetchQuotesSuccess = createAction('[Data] fetch Quotes success', props<{ Quotesdata: QuotesModel}>())
export const fetchQuotesFail = createAction('[Data fetch Quotes failed]', props<{ error: string }>())


// Add Data
export const addQuotes = createAction('[Data] Add Quotes',  props<{ newData: Quote }>());
export const addQuotesSuccess = createAction('[Data] Add Quotes Success', props<{ newData: Quote }>());
export const addQuotesFailure = createAction('[Data] Add Quotes Failure', props<{ error: string }>());

//get Quote by ID
export const getQuoteById = createAction('[Data] get Quote', props<{ QuoteId: number }>());
export const getQuoteByIdSuccess = createAction('[Data] get Quote success', props<{ Quote: Quote }>());
export const getQuoteByIdFailure = createAction('[Data] get Quote Failure', props<{ error: string }>());

// Update Data
export const updateQuotes = createAction(
    '[Data] Update Quotes',
   // props<{ updatedData: QuotesModel }>()
   props<{ updatedData: Quote }>()

);
export const updateQuotesSuccess = createAction(
    '[Data] Update Quotes Success',
    props<{ updatedData: Quote }>()
);
export const updateQuotesFailure = createAction(
    '[Data] Update Quotes Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteQuotes = createAction(
    '[Data] Delete Quotes',
    props<{ userId: number }>()
);
export const deleteQuotesSuccess = createAction(
    '[Data] Delete Quotes Success',
    props<{ userId: number }>()
);
export const deleteQuotesFailure = createAction(
    '[Data] Delete Quotes Failure',
    props<{ error: string }>()
);