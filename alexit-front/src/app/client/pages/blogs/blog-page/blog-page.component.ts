import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../../services/alexit.service';
import { Blog } from '../../../../../models/blog.model';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../../../../services/crud.service';
import { blogContentItemTypes } from '../../../../../constants/blog-content-item-types';

@Component({
  selector: 'blog-page',
  standalone: true,
  imports: [],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.css'
})
export class BlogPageComponent implements OnInit {

  blog!: Blog;

  contentItemTypes = blogContentItemTypes;

  constructor(private alexit: AlexitService, private route: ActivatedRoute, private crud: CrudService) { }
  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.crud.blogGet(p['id']).subscribe(res => this.blog = res.data);
    });
  }




}
