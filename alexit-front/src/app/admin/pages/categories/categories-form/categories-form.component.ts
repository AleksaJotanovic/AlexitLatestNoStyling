import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PtIfPipe } from '../../../../pipes/pt-if.pipe';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'categories-form',
  standalone: true,
  imports: [PtIfPipe, ReactiveFormsModule],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.css'
})
export class CategoriesFormComponent implements OnInit {

  @Input() categories: Category[] = [];

  @Output() onCategorySave = new EventEmitter<{ categoryForm: FormGroup, imageInput: HTMLInputElement }>();

  categoryForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    parent_id: new FormControl('')
  });



  constructor(private ctgService: CategoriesService) { }

  ngOnInit(): void {
    this.ctgService.categoryFormValue$.subscribe(v => this.categoryForm.setValue({
      name: v.name,
      parent_id: v.parent_id
    }));
  }



  emitOnCategorySave(imageInput: HTMLInputElement) {
    this.onCategorySave.emit({ categoryForm: this.categoryForm, imageInput: imageInput });
  }


}
