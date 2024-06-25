import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDeliveryComponent } from './about-delivery.component';

describe('AboutDeliveryComponent', () => {
  let component: AboutDeliveryComponent;
  let fixture: ComponentFixture<AboutDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutDeliveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
