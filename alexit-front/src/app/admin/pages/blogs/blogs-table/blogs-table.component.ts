import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Blog } from '../../../../../models/blog.model';
import { AlexitService } from '../../../../services/alexit.service';

@Component({
  selector: 'blogs-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blogs-table.component.html',
  styleUrl: './blogs-table.component.css'
})
export class BlogsTableComponent implements OnInit {

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
