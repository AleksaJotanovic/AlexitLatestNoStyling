import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfUsesComponent } from './terms-of-uses.component';

describe('TermsOfUsesComponent', () => {
  let component: TermsOfUsesComponent;
  let fixture: ComponentFixture<TermsOfUsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsOfUsesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TermsOfUsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
