import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlexitService } from './services/alexit.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.initPageViews();
    this.alexit.initBlogTopics();
    this.alexit.initBlogs();
  }

}
