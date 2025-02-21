import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCrmContactComponent } from './create-crm-contact.component';

describe('CreateCrmContactComponent', () => {
  let component: CreateCrmContactComponent;
  let fixture: ComponentFixture<CreateCrmContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCrmContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCrmContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
