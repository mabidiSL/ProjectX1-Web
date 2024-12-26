import { Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subject, Observable, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { DatepickerConfigService } from 'src/app/core/services/date.service';
import { selectDataLoading, selectLogById } from 'src/app/store/Log/log-selector';
import { getLogById } from 'src/app/store/Log/log.actions';
import { Log } from 'src/app/store/Log/log.models';

@Component({
  selector: 'app-form-logs',
  templateUrl: './form-logs.component.html',
  styleUrl: './form-logs.component.scss'
})
export class FormLogsComponent implements OnInit {
  @Input() type: string;
  logForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  currentRole: string = '';
  bsConfig: Partial<BsDatepickerConfig>;

  private destroy$ = new Subject<void>();
  loading$: Observable<boolean>;

 

  submitted: boolean = false;
  error: string = '';
  isEditing: boolean = false;
  
  @ViewChild('formElement', { static: false }) formElement: ElementRef;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthenticationService, 
    private datepickerConfigService: DatepickerConfigService,
    public store: Store) {
     
      this.loading$ = this.store.pipe(select(selectDataLoading)); 
      this.currentRole = this.authService.currentUserValue?.role.translation_data[0].name;
     
      this.initForm();
      this.bsConfig = this.datepickerConfigService.getConfig();
      this.setReadonlyConfig();


    } 
    private initForm() {
      this.logForm = this.formBuilder.group({
      id: [null],
      title: [''],
      //title_ar: [''],
      description: [''],
      //description_ar: [''],
      actionDate: [''],
      ipAdress: [''],
      user_id: ['']
      
    });
  } 
  ngOnInit() {
  const LogId = this.route.snapshot.params['id'];
  if (LogId) {
    // Dispatch action to retrieve the log by ID
    this.store.dispatch(getLogById({ LogId }));
    // Subscribe to the selected log from the store
    this.store
      .pipe(select(selectLogById), takeUntil(this.destroy$))
      .subscribe(log => {
        if (log) {
        
          this.patchValueForm(log);
         
        }
      });
  }
}
setReadonlyConfig() {
  
    this.bsConfig.isDisabled = true;  // Disable the datepicker
 
}
patchValueForm(log: Log){
  this.logForm.patchValue(log);
  this.logForm.patchValue({
    title: log.translation_data[0].title,
    //title_ar: log.translation_data[1].title,
    description: log.translation_data[0].description,
    //description_ar: log.translation_data[1].description,
    
  });

}
  toggleViewMode(){
          this.router.navigateByUrl('/private/logs/list');
    }   

}