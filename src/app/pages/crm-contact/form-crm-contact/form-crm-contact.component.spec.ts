import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrmContactComponent } from './form-crm-contact.component';

describe('FormCrmContactComponent', () => {
  let component: FormCrmContactComponent;
  let fixture: ComponentFixture<FormCrmContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrmContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCrmContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
