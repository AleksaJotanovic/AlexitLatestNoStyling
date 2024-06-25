import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsOnDiscountComponent } from './products-on-discount.component';

describe('ProductsOnDiscountComponent', () => {
  let component: ProductsOnDiscountComponent;
  let fixture: ComponentFixture<ProductsOnDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsOnDiscountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsOnDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
