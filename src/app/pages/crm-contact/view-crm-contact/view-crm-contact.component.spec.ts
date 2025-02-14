import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCrmContactComponent } from './view-crm-contact.component';

describe('ViewCrmContactComponent', () => {
  let component: ViewCrmContactComponent;
  let fixture: ComponentFixture<ViewCrmContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCrmContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCrmContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
