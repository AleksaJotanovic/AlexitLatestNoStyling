import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../../models/category.model';
import { CtgIfPipe } from '../../../pipes/ctg-if.pipe';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { countEarning, countRegularPrice, countSalePrice } from '../../../../middlewares/library';
import { AlexitService } from '../../../services/alexit.service';

@Component({
  selector: 'add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CtgIfPipe, NgStyle, FormsModule, NgFor, NgIf],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {

  categories: Category[] = [];

  isDiscountSet: boolean = false;

  selectedCategory: any = {};

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





  constructor(private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe({ next: v => this.categories = v, error: err => console.log(err) });
  }





  add(productImages: HTMLInputElement) {
    const files = productImages.files as FileList;
    const formdata = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formdata.append("files", file);
    };
    const categoryFilter = this.categories.find((ctg) => ctg._id === this.productForm.get('category_id')?.value);
    if (categoryFilter !== undefined) {
      const product: any = {
        category: { _id: categoryFilter._id, name: categoryFilter.name },
        name: this.productForm.value.name,
        uom: this.productForm.value.uom,
        sku: this.productForm.value.sku,
        price: {
          margin: this.productForm.value.price.margin,
          purchase: this.productForm.value.price.purchase,
          regular: this.productForm.value.price.regular,
          sale: this.productForm.value.price.sale,
          earning: this.productForm.value.price.earning,
          onDiscount: {
            state: this.productForm.value.price.onDiscount.state,
            rate: this.productForm.value.price.onDiscount.rate
          }
        },
        specifications: this.productForm.value.specifications,
        inStock: this.productForm.value.inStock,
        weight: this.productForm.value.weight,
        garantee: this.productForm.value.garantee,
        published: this.productForm.value.published
      };
      this.alexit.addProduct(product, formdata);
      this.productForm.reset();
    }

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

  get specifications() {
    return this.productForm.get('specifications') as FormArray<FormGroup<{ key: FormControl, value: FormControl }>>;
  }

  newSpecification(key: string) {
    this.specifications.push(new FormGroup({ key: new FormControl(key), value: new FormControl('') }));
  }

  onCategorySelect(categoryId: string) {
    this.specifications.clear();
    for (let ctg of this.categories) {
      if (ctg._id === categoryId) {
        this.selectedCategory = ctg;
      }
    }
    for (let spec of this.selectedCategory.specifications) {
      this.newSpecification(spec.key);
    }
  }


}
