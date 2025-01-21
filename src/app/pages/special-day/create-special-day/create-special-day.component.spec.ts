import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecialDayComponent } from './create-special-day.component';

describe('CreateSpecialDayComponent', () => {
  let component: CreateSpecialDayComponent;
  let fixture: ComponentFixture<CreateSpecialDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSpecialDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSpecialDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
