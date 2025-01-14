/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
//import { selectDataArea } from 'src/app/store/area/area-selector';
//import { fetchArealistData } from 'src/app/store/area/area.action';
import { Area } from 'src/app/store/area/area.model';
import { selectDataCity, selectDataLoadingCities } from 'src/app/store/City/city-selector';
import { getCityByCountryId } from 'src/app/store/City/city.action';
import { City } from 'src/app/store/City/city.model';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { Country } from 'src/app/store/country/country.model';
import { selectDataLoading, selectedEmployee } from 'src/app/store/employee/employee-selector';
import { addEmployeelist, getEmployeeById, updateEmployeelist } from 'src/app/store/employee/employee.action';
import { Employee } from 'src/app/store/employee/employee.model';
import { selectDataRole } from 'src/app/store/Role/role-selector';
import { fetchRolelistData } from 'src/app/store/Role/role.actions';
import { Modules, Permission, Role } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-form-employee',
  templateUrl: './form-employee.component.html',
  styleUrl: './form-employee.component.css'
})
export class FormEmployeeComponent implements OnInit, OnDestroy{
  
  @Input() type: string;
  employeeForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  modalRef?: BsModalRef;

  isEditing: boolean = false;
  isCollapsed: boolean;
  private destroy$ = new Subject<void>();
  public firstColleaps:boolean = false;
  public secondColleaps:boolean = false;
  public bothColleaps:boolean = false;

  isFirstOpen:boolean = true;
  isPermissionsOpen: boolean = true;

  banks : any[] = [{id: '1', name:'Riyad Bank'},{id: '2', name:'Al Bilad Bank'}];
  
  
  countrylist: Country[] = [];
  arealist$:  Observable<Area[]>  ;
  citylist$:  Observable<City[]> ;
  loading$: Observable<boolean>;
  loadingCities$: Observable<boolean>;
  country: any = null;

  moduleKeys: any[] = [];
  permissionKeys: any[] = [];
  phoneCode!: string;

  rolelist:  Role[] = [] ;
  selectedRole : Role = null;
  originalEmployeeData: Employee = {}; 
  permissions: any = {};
  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];
  @ViewChild('formElement', { static: false }) formElement: ElementRef;
  @ViewChild('ViewContent', { static: false }) showModal?: ModalDirective;

  public Permission: Permission;
  public Module: Modules;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private authservice: AuthenticationService,
    private formUtilService: FormUtilService,
    private store: Store){
      
      // This will be applied when the issue of state user manager is resolved
      this.authservice.currentUser$.subscribe(user => {
        this.country = user?.country; 
        
      });
     

      this.loading$ = this.store.pipe(select(selectDataLoading)); 
      this.loadingCities$ = this.store.pipe(select(selectDataLoadingCities));

      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 1000,query:'', status: 'active' }));
      this.store.dispatch(fetchRolelistData({page: 1, itemsPerPage: 100, query:'',status: 'active' }));

      this.initForm();

    }
  
    private initForm() {
      this.employeeForm = this.formBuilder.group({
        id: [null],
        l_name:['',Validators.required],
        //l_name_ar:['',Validators.required],
        f_name:['',Validators.required],
        //f_name_ar:['',Validators.required],
        //username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        //password: ['', Validators.required],
        phone:['',Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
        country_id:[null],
        city_id:[null],
        //area_id:[null], 
         role_id:[null, Validators.required],
         status:['active']

  
      });
    }
  ngOnInit() {
    this.setPhoneCodeByCountry();
    this.fetchCountry();
    this.fetchRoles();
     
    const employeeId = this.route.snapshot.params['id'];
    if (employeeId) {
      if (this.type === 'view') {
        this.formUtilService.disableFormControls(this.employeeForm);
       }
      // Dispatch action to retrieve the employee by ID
      this.store.dispatch(getEmployeeById({ employeeId }));
      
      // Subscribe to the selected employee from the store
      this.store
        .pipe(select(selectedEmployee), takeUntil(this.destroy$))
        .subscribe(employee => {
          if (employee) {
            this.isEditing = true;   
            this.phoneCode = employee.country?.ISO2;      
            this.employeeForm.controls['country_id'].setValue(employee.country_id);
            this.fetchCities(employee.country_id);
           
            this.employeeForm.controls['role_id'].setValue(employee.role_id);
            this.selectedRole = employee.role;
            this.patchValueForm(employee);
            this.mapClaimsToEnums(this.selectedRole?.claims);
           
            this.originalEmployeeData = { ...employee };

          }
        });
    }
       
  }
  setPhoneCodeByCountry(){
    // this.store.select(selectedCountry).subscribe(
    //   (country)  => {
        if(this.country)
          this.phoneCode = this.country.ISO2;
          this.employeeForm.controls['country_id'].setValue(this.country.id);
          this.fetchCities(this.country.id);
     // });
  }
  /**
   * Open modal
   * @param content modal content
   */
  openViewModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }
  patchValueForm(employee: Employee){
    this.employeeForm.patchValue(employee);
    this.employeeForm.patchValue({
      f_name: employee.translation_data[0].f_name,
      l_name: employee.translation_data[0].l_name,
      // f_name_ar: employee.translation_data[1].f_name,
      // l_name_ar: employee.translation_data[1].l_name,
           
    });
  
  }
  fetchRoles(){
    this.store.select(selectDataRole).subscribe(
      (data)  => {
        this.rolelist =  [...data].map(role =>{
          const translatedName = role.translation_data && role.translation_data[0]?.name || 'No name available';
      
          return {
            ...role,  
            translatedName 
          };
        }).sort((a, b) => {
          // Sort by translatedName
          return a.translatedName.localeCompare(b.translatedName);
        });
    });

  }
  fetchCountry(){
    this.store.select(selectDataCountry).subscribe((data) =>{
      this.countrylist = [...data].map(country =>{
        const translatedName = country.translation_data && country.translation_data[0]?.name || 'No name available';
    
        return {
          ...country,  
          translatedName 
        };
      }).sort((a, b) => {
        // Sort by translatedName
        return a.translatedName.localeCompare(b.translatedName);
      });
    });
  }
  // fetchAreas(){
  //   this.store.select(selectDataArea).subscribe(data =>
  //     this.filteredAreas =  [...data].map(area =>{
  //     const translatedName = area.translation_data && area.translation_data[0]?.name || 'No name available';
  //     return {
  //       ...area,  
  //       translatedName 
  //     };
  //   })
  //   .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
  //   }));
  // }
  fetchCities(id: number){
    this.store.dispatch(getCityByCountryId({page:1, itemsPerPage:1000, country_id:id}));
    this.store.select(selectDataCity).subscribe((data) => {
      this.filteredCities = [...data].map(city =>{
       const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
   
       return {
         ...city,  
         translatedName 
       };
     })
     .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
     });
     
    
   });
  }
 
  onChangeCountrySelection(event: Country){
    const country = event;
    this.employeeForm.get('city_id').setValue(null);
    this.filteredCities = [];
    if(country){
      this.phoneCode = country.ISO2;
      this.fetchCities(country.id);
    }
       
  }
  // onChangeAreaSelection(event: Area){
  //   const area = event;
  //   this.filteredCities = [];
  //   this.employeeForm.get('city_id').setValue(null);
  //   if(area){
  //     this.store.select(selectDataCity).subscribe((data) => {
  //       this.filteredCities = [...data].map(city =>{
  //        const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
     
  //        return {
  //          ...city,  
  //          translatedName 
  //        };
  //      })
  //      .filter(city => city.area_id === area.id)
  //      .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
  //      });
  //    });
          
      
  //   }
    
    
  // }
  
  createEmployeeFromForm(formValue): Employee {
    const employee = formValue;
    employee.translation_data = [];
  
    const enFields = [
      { field: 'f_name', name: 'f_name' },
      { field: 'l_name', name: 'l_name' }
        
    ];
    // const arFields = [
    //   { field: 'f_name_ar', name: 'f_name' },
    //   { field: 'l_name_ar', name: 'l_name' },
    //       ];
    
    // Create the English translation if valid
    const enTranslation = this.formUtilService.createTranslation(employee,'en', enFields);
    if (enTranslation) {
      employee.translation_data.push(enTranslation);
    }

    // // Create the Arabic translation if valid
    // const arTranslation = this.formUtilService.createTranslation(employee,'ar', arFields);
    // if (arTranslation) {
    //   employee.translation_data.push(arTranslation);
    // }
    if(employee.translation_data.length <= 0)
      delete employee.translation_data;
       
          // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(employee).forEach(key => {
      if (employee[key] === undefined || employee[key] === null) {
          delete employee[key];  // Delete property if it's undefined or null
       }
    });
    delete employee.f_name;
    delete employee.l_name;
    delete employee.f_name_ar;
    delete employee.l_name_ar;
    //delete employee.role_id;
    



   return employee;
}

  
  onSubmit() {

    this.formSubmitted = true;
    if (this.employeeForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.employeeForm.controls).forEach(control => {
        this.employeeForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.employeeForm);
      return;
    }
    this.formError = null;
      const newData = this.employeeForm.value;
      if(!this.isEditing)
        {
            delete newData.id;
            this.store.dispatch(addEmployeelist({ newData: this.createEmployeeFromForm(newData) }));
        }
        else
        { 
      
          const updatedDta = this.formUtilService.detectChanges(this.employeeForm, this.originalEmployeeData);

          if (Object.keys(updatedDta).length > 0) {
            updatedDta.id = this.employeeForm.value.id;
            this.store.dispatch(updateEmployeelist({ updatedData: this.createEmployeeFromForm(updatedDta) }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.formUtilService.scrollToTopOfForm(this.formElement);
          }
  
        }
    
  }
  setCountryByPhoneCode(code: string){
   
    
    const country = this.countrylist?.find(c => c.phoneCode === code);
    this.employeeForm.get('country_id').setValue(country?.id);
    this.onChangeCountrySelection(country);
  }
  onPhoneNumberChanged(event: { number: string; countryCode: string }) {
    this.employeeForm.get('phone').setValue(event.number);
    if(this.type === 'create'){
      this.setCountryByPhoneCode(event.countryCode);
    }

  }
  onChangeRoleSelection(event: Role){
    const role = event;
        if(role){
          this.selectedRole = this.rolelist.find(r => r.id == role.id);
        //  this.isPermissionsOpen = true;

      // Update the permission keys and module keys based on the selected role
      if (this.selectedRole) {
        this.isPermissionsOpen = false;
        this.mapClaimsToEnums(this.selectedRole?.claims);
     
      }
    }
  }
  mapClaimsToEnums(claims: any[]) {
    this.moduleKeys = [];
    this.permissionKeys = [];

    this.permissions = {};

    claims.forEach(claim => {
        if (claim.claimType in Modules) {
            this.moduleKeys.push(Modules[claim.claimType]); // Get module name
            claim.claimValue.forEach(value => {
                if (value in Permission) {
                    if(!this.permissionKeys.includes(Permission[value]))
                      this.permissionKeys.push(Permission[value]); // Get permission name
                }
            });
        }
    });
    this.moduleKeys.forEach(module => {
          if (!this.permissions[module]) {
            this.permissions[module] = {}; // Ensure it's initialized
          }
          this.permissionKeys.forEach(permission => {
            // Check if the role has the permission for this module
            this.permissions[module][permission] = this.hasPermission(module, permission);
          });
        });
 
    
    


}
 

  // Check if the selected role has permission for a module and permission
hasPermission(module: string, permission: string): boolean {
    const moduleEnum = Modules[module as keyof typeof Modules];
    const permissionEnum = Permission[permission as keyof typeof Permission];
    
    if (this.selectedRole) {
      const claim = this.selectedRole.claims.find((claim) => claim.claimType === moduleEnum);
      return claim ? claim.claimValue.includes(permissionEnum) : false;
    }
    return false;
  }
  showRolePermissions(role: any){
    console.log(role);
    
  }


onToggle(event: any){

  if(event){
    const newValue = event.target.checked ? 'active' : 'inactive';
    this.employeeForm.get('status')?.setValue(newValue);

  }
}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    this.employeeForm.reset();
    this.router.navigateByUrl('/private/employees/list');
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/employees/list');
}

}
