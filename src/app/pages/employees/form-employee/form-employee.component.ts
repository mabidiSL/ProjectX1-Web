import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { selectDataLoading, selectEmployeeById } from 'src/app/store/employee/employee-selector';
import { addEmployeelist, getEmployeeById, updateEmployeelist } from 'src/app/store/employee/employee.action';
import { selectDataRole } from 'src/app/store/Role/role-selector';
import { fetchRolelistData } from 'src/app/store/Role/role.actions';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-form-employee',
  templateUrl: './form-employee.component.html',
  styleUrl: './form-employee.component.css'
})
export class FormEmployeeComponent implements OnInit{
  
  @Input() type: string;
  employeeForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  isEditing: boolean = false;
  isCollapsed: boolean;
  private destroy$ = new Subject<void>();
  public firstColleaps:boolean = false;
  public secondColleaps:boolean = false;
  public bothColleaps:boolean = false;

  isFirstOpen:boolean = true;
  banks : any[] = [{id: '1', name:'BIAT'},{id: '2', name:'BT'}];
  
  
  countrylist: Country[] = [];
  arealist$:  Observable<Area[]>  ;
  citylist$:  Observable<City[]> ;
  loading$: Observable<boolean>

  rolelist:  Role[] = [] ;
  selectedRole : Role = null;

  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];

  public Permission: Permission;
  public Module: Modules;

moduleKeys = Object.keys(Modules).filter(key => isNaN(Number(key))); // Get the module names
permissionKeys = Object.keys(Permission).filter(key => isNaN(Number(key))); // Get the permission names




  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store){
      
      this.loading$ = this.store.pipe(select(selectDataLoading)); 

      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchRolelistData({page: 1, itemsPerPage: 10, status: 'active' }));

      this.initForm();

    }
  
    private initForm() {
      this.employeeForm = this.formBuilder.group({
        id: [''],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        phone:['',Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
        country_id:[''],
        city_id:[''],
        area_id:[''], 
        bankAccountNumber: [''],
        bankName:[''],
        role_id:['', Validators.required]
  
      });
    }
  ngOnInit() {
   
    this.store.select(selectDataCountry).subscribe(
      (data)  => {
        this.countrylist = data;
    });
    this.arealist$ = this.store.select(selectDataArea);
    this.citylist$ = this.store.select(selectDataCity);
    this.store.select(selectDataRole).subscribe(
      (data)  => {
        this.rolelist = data;
    });;

    
    const employeeId = this.route.snapshot.params['id'];
    if (employeeId) {
      // Dispatch action to retrieve the employee by ID
      this.store.dispatch(getEmployeeById({ employeeId }));
      
      // Subscribe to the selected employee from the store
      this.store
        .pipe(select(selectEmployeeById(employeeId)), takeUntil(this.destroy$))
        .subscribe(employee => {
          if (employee) {
            // Patch the form with employee data
            this.arealist$.subscribe(
              areas => 
                this.filteredAreas = areas.filter(c =>c.country_id == employee.city.area.country_id )
            );
            this.citylist$.subscribe(
              cities => 
                this.filteredCities = cities.filter(c =>c.area_id == employee.city.area_id )
            );
            this.employeeForm.controls['country_id'].setValue(employee.city.area.country_id);
            this.employeeForm.controls['area_id'].setValue(employee.city.area_id);
            this.employeeForm.controls['city_id'].setValue(employee.city_id);
            this.employeeForm.controls['role_id'].setValue(employee.role_id);

            this.employeeForm.patchValue(employee);
          
            this.isEditing = true;

          }
        });
    }
   
    
  }
  getCountryName(id: any){
    this.arealist$.subscribe(
      areas => 
        this.filteredAreas = areas.filter(c =>c.country_id == id )
    );
    return this.countrylist.find(country => country.id === id)?.name ;
  }
  getAreaName(id: any){
    this.citylist$.subscribe(
      cities => 
        this.filteredCities = cities.filter(c =>c.area_id == id )
    );
    return this.filteredAreas.find(area => area.id === id)?.name ;
  }
  getCityName(id: any){
    return this.filteredCities.find(city => city.id === id)?.name ;
  }
  getRoleName(id: any){
    return this.rolelist.find(role => role.id === id)?.name ;
  }
  onChangeCountrySelection(event: any){
    const country = event.target.value;
    if(country){
      this.arealist$.subscribe(
        areas => 
          this.filteredAreas = areas.filter(c =>c.country_id == country )
      );
    }
    else{
      this.filteredAreas = [];
    }
    
  }
  onChangeAreaSelection(event: any){
    const area = event.target.value;
    if(area){
      this.citylist$.subscribe(
        cities => 
          this.filteredCities = cities.filter(c =>c.area_id == area )
      );
    }
    else{
      this.filteredCities = [];
    }
    
  }
  onChangeRoleSelection(event: any){
    const role = event.target.value;
    if(role){
      
          this.selectedRole = this.rolelist.find(r => r.id == role);
        }

    }
  
  onSubmit() {
    this.formSubmitted = true;

    if (this.employeeForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.employeeForm.controls).forEach(control => {
        this.employeeForm.get(control).markAsTouched();
      });
      this.focusOnFirstInvalid();
      return;
    }
    this.formError = null;
      const newData = this.employeeForm.value;
      if(!this.isEditing)
        {
            delete newData.id;
            delete newData.role;
            this.store.dispatch(addEmployeelist({ newData }));
        }
        else{
          delete newData.password;
          this.store.dispatch(updateEmployeelist({ updatedData: newData }));
  
        }
    
  }
  private focusOnFirstInvalid() {
    const firstInvalidControl = this.getFirstInvalidControl();
    if (firstInvalidControl) {
      firstInvalidControl.focus();
    }
  }

  private getFirstInvalidControl(): HTMLInputElement | null {
    const controls = this.employeeForm.controls;
    for (const key in controls) {
      if (controls[key].invalid) {
        const inputElement = document.getElementById(key) as HTMLInputElement;
        if (inputElement) {
          return inputElement;
        }
      }
    }
    return null;
  }
  onPhoneNumberChanged(phoneNumber: string) {
    this.employeeForm.get('phone').setValue(phoneNumber);
  }

hasPermission(module: string, permission: string): boolean {
  const moduleEnum = Modules[module as keyof typeof Modules];
  const permissionEnum = Permission[permission as keyof typeof Permission];
  if(this.selectedRole){
    const claim = this.selectedRole.claims.find((claim) => claim.claimType === moduleEnum);
    return claim ? claim.claimValue.includes(permissionEnum) : false;
  }
  return false;
}

togglePermission(module: string, permission: string, event: any): void {
  const moduleEnum = this.Module[module as keyof typeof Modules];
  const permissionEnum = this.Permission[permission as keyof typeof Permission];

  const claim = this.selectedRole.claims.find((claim) => claim.claimType === moduleEnum);
  if (claim) {
    if (event.target.checked) {
      // Add the permission
      claim.claimValue.push(permissionEnum);
    } else {
      // Remove the permission
      claim.claimValue = claim.claimValue.filter((perm) => perm !== permissionEnum);
    }
  } else {
    // If there's no claim for this module, create one and add the permission
    this.selectedRole.claims.push({
      claimType: moduleEnum,
      claimValue: [permissionEnum],
    });
  }
}





  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    this.employeeForm.reset();
    this.router.navigateByUrl('/private/employees');
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/employees');
}

}
