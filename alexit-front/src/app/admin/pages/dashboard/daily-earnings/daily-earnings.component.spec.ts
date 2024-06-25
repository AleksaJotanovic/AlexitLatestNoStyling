import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyEarningsComponent } from './daily-earnings.component';

describe('DailyEarningsComponent', () => {
  let component: DailyEarningsComponent;
  let fixture: ComponentFixture<DailyEarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyEarningsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
