import { TestBed } from '@angular/core/testing';

import { ScrollHandleService } from './scroll-handle.service';

describe('ScrollHandleService', () => {
  let service: ScrollHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
