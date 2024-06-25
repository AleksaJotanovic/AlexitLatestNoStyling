import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCustomersComponent } from './total-customers.component';

describe('TotalCustomersComponent', () => {
  let component: TotalCustomersComponent;
  let fixture: ComponentFixture<TotalCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalCustomersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
