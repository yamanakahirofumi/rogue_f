import { TestBed } from '@angular/core/testing';

import { FieldsAccessService } from './fields-access.service';

describe('FieldsAccessService', () => {
  let service: FieldsAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldsAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
