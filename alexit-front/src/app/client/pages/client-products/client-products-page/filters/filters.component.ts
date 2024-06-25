import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../../../models/category.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  @Input() category!: Category;

  @Output() onFilterSelect = new EventEmitter<{ key: string, value: string }>();

  specifications: { key: string, values: string[] }[] = [];





  collapseFilters(collapser: HTMLDivElement) {
    collapser.classList.toggle('collapser-active');
  }

  emitOnFilterSelect(key: string, value: string, input: any) {
    if (input.checked) {
      if (this.specifications.some(spec => spec.key === key)) {
        for (let spec of this.specifications) {
          if (spec.key === key) {
            spec.values.push(value);
            this.onFilterSelect.emit({ key: key, value: `${spec.values.map(v => v).join(",")}` });
          }
        }
      } else {
        this.specifications.push({ key: key, values: [value] });
        this.onFilterSelect.emit({ key: key, value: value });
      }
    } else {
      if (this.specifications.some(spec => spec.key === key)) {
        for (let spec of this.specifications) {
          if (spec.key === key) {
            spec.values = spec.values.filter(v => v !== value);
            this.onFilterSelect.emit({ key: key, value: `${spec.values.map(v => v).join(",")}` });
            if (spec.values.length === 0) {
              this.specifications = this.specifications.filter(s => s.values.length !== 0);
            }
          }
        }
      }
    }
  }




}
