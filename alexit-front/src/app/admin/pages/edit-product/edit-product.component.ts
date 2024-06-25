import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../models/product.model';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlexitService } from '../../../services/alexit.service';
import { CtgIfPipe } from '../../../pipes/ctg-if.pipe';
import { countEarning, countRegularPrice, countSalePrice } from '../../../../middlewares/library';
import { NgFor } from '@angular/common';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CtgIfPipe, NgFor],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {

  categories: Category[] = [];

  categorySpecifications: { key: string, values: string[] }[] = [];

  images: string[] = [];

  product!: Product;

  productForm: FormGroup = new FormGroup({
    category_id: new FormControl(''),
    name: new FormControl(''),
    uom: new FormControl(''),
    sku: new FormControl(''),
    price: new FormGroup({
      margin: new FormControl(0),
      purchase: new FormControl(0),
      regular: new FormControl(0),
      sale: new FormControl(0),
      earning: new FormControl(0),
      onDiscount: new FormGroup({
        state: new FormControl(false),
        rate: new FormControl(0)
      })
    }),
    specifications: new FormArray([]),
    inStock: new FormControl(0),
    weight: new FormControl(0),
    garantee: new FormControl(''),
    published: new FormControl(false)
  });



  constructor(public route: ActivatedRoute, private alexit: AlexitService, private router: Router) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.alexit.products$.subscribe(prodsSubValue => {
        const productInit = prodsSubValue.find(prod => prod._id === params['id']);
        if (productInit !== undefined) this.product = productInit;
        if (this.product !== undefined) {

          this.productForm.patchValue({
            category_id: this.product.category._id,
            name: this.product.name,
            uom: this.product.uom,
            sku: this.product.sku,
            price: {
              margin: this.product.price.margin,
              purchase: this.product.price.purchase,
              regular: this.product.price.regular,
              sale: this.product.price.sale,
              earning: this.product.price.earning,
              onDiscount: {
                state: this.product.price.onDiscount.state,
                rate: this.product.price.onDiscount.rate
              }
            },
            specifications: this.product.specifications,
            inStock: this.product.inStock,
            weight: this.product.weight,
            garantee: this.product.garantee,
            published: this.product.published
          });
          this.images = this.product.images;

          this.alexit.categories$.subscribe(ctgsSubValue => {
            this.categories = ctgsSubValue;
            if (this.categories.length > 0 && this.product !== undefined) {
              const category = this.categories.find(c => c._id === this.product.category._id);
              if (category !== undefined) this.categorySpecifications = category.specifications;

              for (let spec of this.product.specifications) {
                const specGroup = new FormGroup({ key: new FormControl(''), value: new FormControl('') });
                for (let ctgSpec of this.categorySpecifications) {
                  const value = ctgSpec.values.find(v => v === spec.value);
                  if (value !== undefined) {
                    specGroup.patchValue({
                      key: spec.key,
                      value: value
                    });
                  }
                }
                this.specifications.push(specGroup);
              }

            }
          });
        }
      });
    });
  }



  countPrices() {
    this.productForm.patchValue({
      price: {
        ...this.productForm.value.price,
        regular: countRegularPrice(this.productForm.value.price.margin, this.productForm.value.price.purchase),
        sale: countSalePrice(countRegularPrice(this.productForm.value.price.margin, this.productForm.value.price.purchase)),
        earning: countEarning(this.productForm.value.price.margin, countRegularPrice(this.productForm.value.price.margin, this.productForm.value.price.purchase)),
      }
    });
  }

  update() {
    const category = this.categories.find(c => c._id === this.productForm.value.category_id);
    if (category !== undefined) {
      const product: Product = {
        ...this.productForm.value,
        _id: this.route.snapshot.params['id'],
        category: { _id: category._id, name: category.name },
      };
      this.alexit.updateProduct(product);
      this.router.navigate(['admin/products']);
    };
  }


  setImageSrc(event: any, expandedImg: HTMLImageElement) {
    expandedImg.src = event.target.src;
  }


  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
  }


  newSpecification(key: string) {
    this.specifications.push(new FormGroup({ key: new FormControl(key), value: new FormControl('') }));
  }

  matchingValues(matchingKey: string): string[] {
    const matchingSpec = this.categorySpecifications.find(spec => spec.key === matchingKey);
    if (matchingSpec !== undefined) return matchingSpec.values;
    return [];
  }

  onCategorySelect(categoryId: string) {
    this.specifications.clear();
    for (let ctg of this.categories) {
      if (ctg._id === categoryId) {
        this.categorySpecifications = ctg.specifications;
      }
    }
    for (let spec of this.categorySpecifications) {
      this.newSpecification(spec.key);
    }
  }






}
