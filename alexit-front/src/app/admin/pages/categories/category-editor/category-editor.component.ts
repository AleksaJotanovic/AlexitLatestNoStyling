import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PtIfPipe } from '../../../../pipes/pt-if.pipe';
import { NgFor } from '@angular/common';
import { Category } from '../../../../../models/category.model';

@Component({
  selector: 'category-editor',
  standalone: true,
  imports: [ReactiveFormsModule, PtIfPipe, NgFor],
  templateUrl: './category-editor.component.html',
  styleUrl: './category-editor.component.css'
})
export class CategoryEditorComponent implements OnInit {

  @Input() categories: Category[] = [];

  categoryForm = this.formBuilder.group({
    name: [''],
    specifications: this.formBuilder.array([]),
    parent_id: ['']
  });

  @Output() onUpdate = new EventEmitter<{ categoryValue: any, isImageSelected: boolean, fileToUpload: any }>();

  @Output() onEditModeExit = new EventEmitter();

  @Input() category!: Category | undefined;

  fileToUpload: any;









  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    if (this.category !== undefined) {
      this.categoryForm.patchValue({
        name: this.category.name,
        parent_id: this.category.parent._id
      });

      this.specifications.clear();

      this.category.specifications.forEach(spec => {
        const specGroup = this.newSpecification();
        specGroup.patchValue({
          key: spec.key,
          values: []
        });

        spec.values.forEach(value => {
          const valuesArray = specGroup.get('values') as FormArray;
          valuesArray.push(this.formBuilder.control(value));
        });

        this.specifications.push(specGroup);
      });
    }
  }







  emitOnUpdate(imageInput: HTMLInputElement) {
    const category = {
      name: this.categoryForm.value.name,
      parent_id: this.categoryForm.value.parent_id,
      specifications: this.categoryForm.value.specifications
    };
    let isImageSelected = false;
    if (imageInput.value !== '') {
      isImageSelected = true;
    }
    this.onUpdate.emit({ categoryValue: category, isImageSelected: isImageSelected, fileToUpload: this.fileToUpload });
  }

  emitOnEditModeExit() {
    this.onEditModeExit.emit();
  }

  handleFileInput(e: any, image: HTMLImageElement) {
    this.fileToUpload = e.target.files.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      image.src = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
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
