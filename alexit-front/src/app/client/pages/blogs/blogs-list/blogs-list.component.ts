import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../../../models/blog.model';
import { AlexitService } from '../../../../services/alexit.service';
import { NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'blogs-list',
  standalone: true,
  imports: [NgStyle, RouterLink],
  templateUrl: './blogs-list.component.html',
  styleUrl: './blogs-list.component.css'
})
export class BlogsListComponent implements OnInit {
  blogs: Blog[] = [];

  blogTopics: { _id: string, name: string }[] = [];





  constructor(private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.blogs$.subscribe({ next: v => this.blogs = v, error: err => console.log(err) });
    this.alexit.blogTopics$.subscribe({ next: v => this.blogTopics = v, error: err => console.log(err) });
  }



  topicName(id: string) {
    const topic = this.blogTopics.find(t => t._id === id);
    if (topic !== undefined) {
      return topic.name;
    } else {
      return 'Topic not found';
    }
  }






}
