import { ElementRef, Injectable, QueryList } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollHandleService {

  headerHeight$ = new BehaviorSubject<number>(0);

  isNavbarSticky: boolean = false;



  constructor() { }



  setHeaderHeight(height: number) {
    this.headerHeight$.next(height);
  };

  headerOnScroll(offset: number, header: HTMLElement, afternav: HTMLElement) {
    if (offset > header.clientHeight) {
      this.isNavbarSticky = true;
      afternav.style.display = 'none';
      header.className = header.className + ' on-scroll';
    } else {
      this.isNavbarSticky = false;
      afternav.style.display = 'flex';
      header.className = 'cl-header';
    };
  };

  sectionsOnScroll(sections: QueryList<ElementRef<HTMLElement>>) {
    for (let section of sections) {
      section.nativeElement.className = section.nativeElement.className + ' on-scroll';
    };
  };

  adjustScrollPosition(headerHeight: number, fragment: string) {
    if (!this.isNavbarSticky) {
      if (fragment) {
        const target = document.getElementById(fragment);
        if (target) {
          window.scrollTo({ top: (target.offsetTop - 3.5) - headerHeight, behavior: 'smooth' });
        };
      };
    } else {
      if (fragment) {
        const target = document.getElementById(fragment);
        if (target) {
          window.scrollTo({ top: (target.offsetTop - 3.5) - (headerHeight - 37), behavior: 'smooth' });
        };
      };
    };
  };


}