/* eslint-disable @typescript-eslint/no-explicit-any */



  import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
  import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { select, Store } from '@ngrx/store';
  import { Observable, Subject, takeUntil } from 'rxjs';
  import { addCountrylist, getCountryById, updateCountrylist } from 'src/app/store/country/country.action';
  import { selectCountryById, selectDataLoading } from 'src/app/store/country/country-selector';
  import { FormUtilService } from 'src/app/core/services/form-util.service';
  import { CountryListModel } from '../../../store/country/country.model';
  
  
  
  @Component({
    selector: 'app-form-country',
    templateUrl: './form-country.component.html',
    styleUrl: './form-country.component.css'
  })
  export class FormCountryComponent implements OnInit, OnDestroy {
    
    @Input() type: string;
    countryForm: UntypedFormGroup;
    formError: string | null = null;
    formSubmitted = false;
    loading$: Observable<boolean>;


    private destroy$ = new Subject<void>();
    CountryFlagBase64 : string = null ;
    submitted: boolean = false;
    error: string = '';
    successmsg: boolean = false;
    fieldTextType!: boolean;
    imageURL: string | undefined;
    isEditing: boolean = false;
    flag: string = '';

    @ViewChild('formElement', { static: false }) formElement: ElementRef;
    originalCountryData: CountryListModel = {}; 

    
    constructor(
      private formBuilder: UntypedFormBuilder,
      private route: ActivatedRoute, 
      private router: Router,
      private formUtilService: FormUtilService,
      public store: Store) {
        
        this.loading$ = this.store.pipe(select(selectDataLoading)); 
        this.countryForm = this.formBuilder.group({
          id:[null],
          name: ['', Validators.required],
          name_ar: ['', Validators.required],
          phoneCode: ['', Validators.required ],
          flag:[null, Validators.required],
                     
        });
       }

      
    ngOnInit() {
  
      const CountryId = this.route.snapshot.params['id'];
      if (CountryId) {
        // Dispatch action to retrieve the Country by ID
        this.store.dispatch(getCountryById({ CountryId }));
        
        // Subscribe to the selected Country from the Country
        this.store
          .pipe(select(selectCountryById(CountryId)), takeUntil(this.destroy$))
          .subscribe(Country => {
            if (Country) {
              this.flag = Country.flag;
              this.countryForm.patchValue(Country);
              this.isEditing = true;
              }
          });
      }
     
    }
    
    /**
     * On submit form
     */
    onSubmit() {
      this.formSubmitted = true;

    if (this.countryForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.countryForm.controls).forEach(control => {
        this.countryForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.countryForm);
      return;
    }
    this.formError = null;
    
              
        const newData = this.countryForm.value;
        if(this.CountryFlagBase64){
          newData.flag = this.CountryFlagBase64;
        }
        
        if(!this.isEditing)
          {
            this.store.dispatch(addCountrylist({ newData }));          
          }
          else
          { 
            const updatedDta = this.formUtilService.detectChanges<CountryListModel>(this.countryForm, this.originalCountryData);
            if (Object.keys(updatedDta).length > 0) {
              updatedDta.id = newData.id;
              console.log(updatedDta);
              this.store.dispatch(updateCountrylist({ updatedData: updatedDta }));
            }
            else
            {
              this.formError = 'Nothing has been changed!!!';
              this.formUtilService.scrollToTopOfForm(this.formElement);
            }
            
          }
        
     
    }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fileChange(event: any): Promise<string> {
    const fileList: any = (event.target as HTMLInputElement);
    const file: File = fileList.files[0];
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }
    /**
     * Upload Country Logo
     */
    async uploadCountryFlag(event: any){
      try {
        this.imageURL = await this.fileChange(event);
        document.querySelectorAll('#projectlogo-img').forEach((element: any) => {
          element.src = this.imageURL;
        });
        //this.CountryForm.controls['CountryLogo'].setValue(imageURL);
         this.CountryFlagBase64 = this.imageURL;
      } catch (error: any) {
        console.error('Error reading file:', error);
      }
    }
   
 
  
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    onCancel(){
     
      this.countryForm.reset();
      this.router.navigateByUrl('/private/countries');
    }
    toggleViewMode(){
          this.router.navigateByUrl('/private/countries');

    }
  
  }

