import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlySalaryComponent } from './yearly-salary.component';

describe('YearlySalaryComponent', () => {
  let component: YearlySalaryComponent;
  let fixture: ComponentFixture<YearlySalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlySalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YearlySalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
