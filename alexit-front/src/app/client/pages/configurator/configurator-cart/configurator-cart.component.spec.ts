import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguratorCartComponent } from './configurator-cart.component';

describe('ConfiguratorCartComponent', () => {
  let component: ConfiguratorCartComponent;
  let fixture: ComponentFixture<ConfiguratorCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguratorCartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguratorCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
