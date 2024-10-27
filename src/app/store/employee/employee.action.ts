import { createAction, props } from '@ngrx/store';
import { EmployeeListModel } from './employee.model';

// fetch all list
export const fetchEmployeelistData = createAction('[Data] fetch Employeelist', props<{ page?: number; itemsPerPage?: number, role?: number}>());
export const fetchEmployeelistSuccess = createAction('[Data] fetch Employeelist success', props<{ EmployeeListdata: any}>())
export const fetchEmployeelistFail = createAction('[Data fetch Employeelist failed]', props<{ error: string }>())

// Add Data
export const addEmployeelist = createAction('[Data] Add Employeelist',  props<{ newData: EmployeeListModel }>());
export const addEmployeelistSuccess = createAction('[Data] Add Employeelist Success', props<{ newData: any }>());
export const addEmployeelistFailure = createAction('[Data] Add Employeelist Failure', props<{ error: string }>());
//get Employee by ID
export const getEmployeeById = createAction('[Data] get Employee', props<{ employeeId: string }>());
export const getEmployeeByIdSuccess = createAction('[Data] get Employee success', props<{ employee: any }>());
export const getEmployeeByIdFailure = createAction('[Data] get Employee Failure', props<{ error: string }>());

// Update Data
export const updateEmployeelist = createAction(
    '[Data] Update Employeelist',
    props<{ updatedData: EmployeeListModel }>()
);
export const updateEmployeelistSuccess = createAction(
    '[Data] Update Employeelist Success',
    props<{ updatedData: EmployeeListModel }>()
);
export const updateEmployeelistFailure = createAction(
    '[Data] Update Employeelist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteEmployeelist = createAction(
    '[Data] Delete Employeelist',
    props<{ employeeId: string }>()
);
export const deleteEmployeelistSuccess = createAction(
    '[Data] Delete Employeelist Success',
    props<{ employeeId: string }>()
);
export const deleteEmployeelistFailure = createAction(
    '[Data] Delete Employeelist Failure',
    props<{ error: string }>()
);