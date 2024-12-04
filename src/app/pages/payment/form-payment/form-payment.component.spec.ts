import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPaymentComponent } from './form-payment.component';

describe('FormPaymentComponent', () => {
  let component: FormPaymentComponent;
  let fixture: ComponentFixture<FormPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
