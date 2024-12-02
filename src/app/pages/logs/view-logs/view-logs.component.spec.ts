import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLogsComponent } from './view-logs.component';

describe('ViewLogsComponent', () => {
  let component: ViewLogsComponent;
  let fixture: ComponentFixture<ViewLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
