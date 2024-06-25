import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ScrollHandleService } from '../../services/scroll-handle.service';
import { BannerComponent } from './banner/banner.component';
import { ProductsOnDiscountComponent } from './products-on-discount/products-on-discount.component';

@Component({
  selector: 'client-main',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, BannerComponent, ProductsOnDiscountComponent],
  templateUrl: './client-main.component.html',
  styleUrl: './client-main.component.css',
  providers: [provideNgxMask()],
})
export class ClientMainComponent implements OnInit {

  @ViewChildren('mainsect') sections!: QueryList<ElementRef<HTMLElement>>;



  constructor(private scrollHandle: ScrollHandleService) { }
  ngOnInit(): void {
  }



  navigateToSection(sectionId: string) {
    window.history.pushState({}, '', `#${sectionId}`);
    this.scrollHandle.headerHeight$.subscribe({
      next: v => {
        this.scrollHandle.sectionsOnScroll(this.sections);
        this.scrollHandle.adjustScrollPosition(v, window.location.hash.substring(1))
      }
    });
  };

  @HostListener('window:scroll', []) onScroll() {
    this.scrollHandle.sectionsOnScroll(this.sections);
  };

}
