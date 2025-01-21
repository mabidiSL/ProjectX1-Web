import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSpecialDayComponent } from './form-special-day.component';

describe('FormSpecialDayComponent', () => {
  let component: FormSpecialDayComponent;
  let fixture: ComponentFixture<FormSpecialDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSpecialDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSpecialDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
