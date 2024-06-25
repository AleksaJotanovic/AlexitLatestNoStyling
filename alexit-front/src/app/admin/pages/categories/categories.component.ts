import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category.model';
import { AlexitService } from '../../../services/alexit.service';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { CategoriesTableComponent } from './categories-table/categories-table.component';
import { FormGroup } from '@angular/forms';
import { CategoryCreatorComponent } from './category-creator/category-creator.component';
import { CategoryEditorComponent } from './category-editor/category-editor.component';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'categories',
  standalone: true,
  imports: [CategoriesFormComponent, CategoriesTableComponent, CategoryCreatorComponent, CategoryEditorComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  category!: Category | undefined;




  constructor(private alexit: AlexitService, private crud: CrudService) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe({ next: v => this.categories = v, error: e => console.log(e) });
  }




  add(e: { categoryForm: FormGroup, imageInput: HTMLInputElement }) {
    const imageBlob = e.imageInput.files as FileList;
    const file = new FormData();
    file.set('file', imageBlob[0]);

    const form = e.categoryForm.value;
    const parent = this.categories.find(c => c._id === form.parent_id);
    if (parent !== undefined) {
      const category: any = { name: form.name, parent: { _id: parent._id, name: parent.name }, specifications: form.specifications };
      this.alexit.addCategory(category, file);
    } else {
      const category: any = { name: form.name, parent: { _id: "", name: "" }, specifications: form.specifications };
      this.alexit.addCategory(category, file);
    }
  }

  delete(e: { id: string, imagePath: string }) {
    this.alexit.deleteCategory(e.id, e.imagePath);
  }


  edit(e: { category: Category }) {
    this.category = e.category;
  }

  update(e: { categoryValue: any, isImageSelected: boolean, fileToUpload: any }) {
    const parent = this.categories.find(c => c._id === e.categoryValue.parent_id);
    if (e.isImageSelected) {
      const file = new FormData();
      file.set('file', e.fileToUpload);
      this.crud.categoryImageUpload(file).subscribe((res: any) => {
        let categoryBody = {
          _id: this.category?._id,
          name: e.categoryValue.name,
          parent: {
            _id: e.categoryValue.parent_id,
            name: parent !== undefined ? parent.name : ''
          },
          specifications: e.categoryValue.specifications,
          image: `http://localhost:3000/categories/${res.data}`
        };
        this.alexit.updateCategory(categoryBody);
        if (this.category !== undefined) {
          this.alexit.deleteAnyFile(this.category.image);
        }
      });
    } else {
      let categoryBody = {
        _id: this.category?._id,
        name: e.categoryValue.name,
        parent: {
          _id: e.categoryValue.parent_id,
          name: parent !== undefined ? parent.name : ''
        },
        specifications: e.categoryValue.specifications,
        image: this.category?.image
      };
      this.alexit.updateCategory(categoryBody);
    }
  }

}