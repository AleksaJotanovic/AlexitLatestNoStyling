import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../../services/alexit.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'banner',
  standalone: true,
  imports: [NgFor, NgStyle, RouterLink],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
  animations: [
    trigger('slide', [
      transition(':increment', [
        style({ transform: 'translateX(0)' }),
        animate('500ms ease-out', style({ transform: 'translateX(-100%)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(0)' }),
        animate('500ms ease-out', style({ transform: 'translateX(100%)' }))
      ]),
    ])
  ]
})
export class BannerComponent implements OnInit {

  offers = [];
  currentIndex = 0;



  constructor(private alexit: AlexitService, private router: Router) { }
  ngOnInit(): void {
  }



  next() {
    if (this.currentIndex < this.offers.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  jumpTo(index: number) {
    this.currentIndex = index;
  }

}
