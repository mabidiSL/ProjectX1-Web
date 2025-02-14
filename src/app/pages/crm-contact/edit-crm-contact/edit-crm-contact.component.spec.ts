import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCrmContactComponent } from './edit-crm-contact.component';

describe('EditCrmContactComponent', () => {
  let component: EditCrmContactComponent;
  let fixture: ComponentFixture<EditCrmContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCrmContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCrmContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
