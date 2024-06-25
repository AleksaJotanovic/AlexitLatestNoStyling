import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { FormsModule } from '@angular/forms';
import { PtIfPipe } from '../../../../pipes/pt-if.pipe';

@Component({
  selector: 'categories-table',
  standalone: true,
  imports: [FormsModule, PtIfPipe],
  templateUrl: './categories-table.component.html',
  styleUrl: './categories-table.component.css'
})
export class CategoriesTableComponent {

  @Input() categories: Category[] = [];

  @ViewChild('name') name!: HTMLTextAreaElement;
  @ViewChild('parent_id') parent_id!: HTMLSelectElement;

  @Output() onCategoryDelete = new EventEmitter<{ id: string, imagePath: string }>();
  @Output() onCategoryEdit = new EventEmitter<{ category: Category }>();



  emitOnCategoryDelete(id: string) {
    const imagePath = this.categories.filter(c => c._id === id)[0].image;
    this.onCategoryDelete.emit({ id: id, imagePath: imagePath });
  }

  emitOnCategoryEdit(id: string) {
    const category = this.categories.filter(c => c._id === id)[0];
    this.onCategoryEdit.emit({ category: category });
  }

}
