import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecialDayComponent } from './edit-special-day.component';

describe('EditSpecialDayComponent', () => {
  let component: EditSpecialDayComponent;
  let fixture: ComponentFixture<EditSpecialDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSpecialDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSpecialDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
