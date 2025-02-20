import { createAction, props } from '@ngrx/store';
import { CompaniesModel, Company } from './companies.model';

// fetch all list
export const fetchCompaniesData = createAction('[Data] fetch Companies', props<{page: number, itemsPerPage: number, query?: string}>());
export const fetchCompaniesSuccess = createAction('[Data] fetch Companies success', props<{ Companiesdata: CompaniesModel}>())
export const fetchCompaniesFail = createAction('[Data fetch Companies failed]', props<{ error: string }>())


// Add Data
export const addCompanies = createAction('[Data] Add Companies',  props<{ newData: Company }>());
export const addCompaniesSuccess = createAction('[Data] Add Companies Success', props<{ newData: Company }>());
export const addCompaniesFailure = createAction('[Data] Add Companies Failure', props<{ error: string }>());

//get Company by ID

export const getCompanyById = createAction('[Data] get Company', props<{ CompanyId: number }>());
export const getCompanyByIdSuccess = createAction('[Data] get Company success', props<{ Company: Company }>());
export const getCompanyByIdFailure = createAction('[Data] get Company Failure', props<{ error: string }>());

// Update Data
export const updateCompanies = createAction(
    '[Data] Update Companies',
   // props<{ updatedData: CompaniesModel }>()
   props<{ updatedData: Company }>()

);
export const updateCompaniesSuccess = createAction(
    '[Data] Update Companies Success',
    props<{ updatedData: Company }>()
);
export const updateCompaniesFailure = createAction(
    '[Data] Update Companies Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteCompanies = createAction(
    '[Data] Delete Companies',
    props<{ userId: number }>()
);
export const deleteCompaniesSuccess = createAction(
    '[Data] Delete Companies Success',
    props<{ userId: number }>()
);
export const deleteCompaniesFailure = createAction(
    '[Data] Delete Companies Failure',
    props<{ error: string }>()
);