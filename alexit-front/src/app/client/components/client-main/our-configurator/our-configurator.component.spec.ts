import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurConfiguratorComponent } from './our-configurator.component';

describe('OurConfiguratorComponent', () => {
  let component: OurConfiguratorComponent;
  let fixture: ComponentFixture<OurConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurConfiguratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
