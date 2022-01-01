import { TestBed } from '@angular/core/testing';

import { SseFieldService } from './sse-field.service';

describe('SseFieldService', () => {
  let service: SseFieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
