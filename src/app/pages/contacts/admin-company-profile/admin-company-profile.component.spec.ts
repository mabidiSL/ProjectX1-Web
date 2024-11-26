import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompanyProfileComponent } from './admin-company-profile.component';

describe('AdminCompanyProfileComponent', () => {
  let component: AdminCompanyProfileComponent;
  let fixture: ComponentFixture<AdminCompanyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCompanyProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
