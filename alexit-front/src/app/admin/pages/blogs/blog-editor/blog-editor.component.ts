import { Component, ElementRef, HostListener, NgModuleRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { AlexitService } from '../../../../services/alexit.service';
import { blogContentItemTypes } from '../../../../../constants/blog-content-item-types';
import { Blog } from '../../../../../models/blog.model';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../../../../services/crud.service';

@Component({
  selector: 'blog-editor',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatButton],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.css'
})
export class BlogEditorComponent implements OnInit {

  id: string = '';

  selectedItem_id = null;

  idIncrementor: number = -1;

  blogTopics: { _id: string, name: string }[] = [];

  contentItemTypes = blogContentItemTypes;

  singleImagesList: { id: number, file: FormData }[] = [];

  galleriesList: { id: number, files: FormData }[] = [];

  featuredImage: FormData = new FormData();

  blog: Blog = {
    topic_id: '',
    title: '',
    featuredImage: '',
    content: [],
    published: false,
    date: ''
  }

  @ViewChildren('textarea') textareas!: QueryList<ElementRef<HTMLTextAreaElement>>;



  constructor(private alexit: AlexitService, private route: ActivatedRoute, private crud: CrudService) { }
  ngOnInit(): void {
    this.alexit.blogTopics$.subscribe(bt => {
      this.blogTopics = bt;
    });
    this.route.params.subscribe(p => {
      this.id = p['id'];
      if (this.id !== '') {
        this.alexit.blogs$.subscribe({
          next: v => {
            const blog = v.find(b => b._id === this.id);
            if (blog !== undefined) {
              this.blog = blog;
              if (this.blog.content.length > 0) {
                setTimeout(() => {
                  this.textareas.forEach(txt => this.fitTextareaDimensions({ target: txt.nativeElement }));
                }, 0);
              }
            }
          }, error: err => console.log(err)
        });
      }
    });



  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.textareas.forEach(txt => this.fitTextareaDimensions({ target: txt.nativeElement }));
  }




  fitTextareaDimensions(e: any) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }



  resetFileInput(e: any) {
    e.target.value = "";
    this.selectedItem_id = e.currentTarget.id;
  }

  uploadFeaturedImage(e: any, featuredImage: HTMLImageElement) {
    let imageBlob = e.target.files;
    this.featuredImage.set("file", imageBlob[0]);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      featuredImage.src = event.target.result;
    }
    reader.readAsDataURL(imageBlob.item(0));
  }

  uploadContentImage(e: any, contentImage: HTMLImageElement) {
    this.singleImagesList = this.singleImagesList.filter(img => img.id !== Number(e.currentTarget.id));
    let fileToUpload = e.target.files;
    const formdata = new FormData();
    formdata.set('file', fileToUpload[0]);
    if (e.currentTarget.id === contentImage.id) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        contentImage.src = event.target.result;
      }
      reader.readAsDataURL(fileToUpload.item(0));
    }
    this.singleImagesList.push({ id: Number(e.currentTarget.id), file: formdata });
  }


  uploadGallery(e: any, glrImage1: HTMLImageElement, glrImage2: HTMLImageElement, glrImage3: HTMLImageElement) {
    this.galleriesList = this.galleriesList.filter(glr => glr.id !== Number(e.currentTarget.id));
    const gallery = [glrImage1, glrImage2, glrImage3]
    let filesToUpload = e.target.files;
    const formdata = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formdata.append("files", filesToUpload[i]);
      if (glrImage1.id === e.currentTarget.id && glrImage2.id === e.currentTarget.id && glrImage3.id === e.currentTarget.id) {
        for (let x in gallery) {
          let reader = new FileReader();
          reader.onload = (event: any) => {
            gallery[x].src = event.target.result;
          }
          reader.readAsDataURL(filesToUpload.item(x));
        }
      }
    }
    this.galleriesList.push({ id: Number(e.currentTarget.id), files: formdata })
  }


  addContentItem(e: any) {
    this.idIncrementor++;
    if (e.currentTarget.id === this.contentItemTypes.GALLERY || e.currentTarget.id === this.contentItemTypes.IMAGE) {
      this.blog.content.push({ _id: this.idIncrementor, key: e.currentTarget.id, value: [] });
    } else {
      this.blog.content.push({ _id: this.idIncrementor, key: e.currentTarget.id, value: [''] });
    }
  }


  publish() {
    // this.alexit.addBlog(this.blog, this.featuredImage, this.singleImagesList, this.galleriesList);
    console.log(this.id);
  }








}
