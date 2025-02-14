import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmContactComponent } from './crm-contact.component';

describe('CrmContactComponent', () => {
  let component: CrmContactComponent;
  let fixture: ComponentFixture<CrmContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrmContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrmContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
