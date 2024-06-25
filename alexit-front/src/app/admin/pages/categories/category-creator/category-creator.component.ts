import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../categories.service';
import { PtIfPipe } from '../../../../pipes/pt-if.pipe';
import { NgFor } from '@angular/common';

@Component({
  selector: 'category-creator',
  standalone: true,
  imports: [ReactiveFormsModule, PtIfPipe, NgFor],
  templateUrl: './category-creator.component.html',
  styleUrl: './category-creator.component.css'
})
export class CategoryCreatorComponent {

  @Input() categories: Category[] = [];

  @Output() onCategoryAdd = new EventEmitter<{ categoryForm: FormGroup, imageInput: HTMLInputElement }>();


  categoryForm = this.formBuilder.group({
    name: [''],
    specifications: this.formBuilder.array([]),
    parent_id: ['']
  });





  constructor(private ctgService: CategoriesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.ctgService.categoryFormValue$.subscribe(v => this.categoryForm.setValue({
      name: v.name,
      parent_id: v.parent_id,
      specifications: v.specifications
    }));
  }




  emitOnCategoryAdd(imageInput: HTMLInputElement) {
    this.onCategoryAdd.emit({ categoryForm: this.categoryForm, imageInput: imageInput });
  }

  get specifications(): FormArray {
    return this.categoryForm.get('specifications') as FormArray;
  }

  newSpecification(): FormGroup {
    return this.formBuilder.group({
      key: [''],
      values: this.formBuilder.array([]),
    });
  }

  addSpecification() {
    this.specifications.push(this.newSpecification());
  }

  addValue(specIndex: number) {
    const values = this.getValues(specIndex);
    values.push(this.formBuilder.control(''));
  }

  removeSpecification(specIndex: number) {
    this.specifications.removeAt(specIndex);
  }

  removeValue(specIndex: number, valueIndex: number) {
    const values = this.getValues(specIndex);
    values.removeAt(valueIndex);
  }

  getValues(specIndex: number): FormArray {
    return this.specifications.at(specIndex).get('values') as FormArray;
  }
}
