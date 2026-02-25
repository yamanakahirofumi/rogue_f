import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FieldsAccessService } from './fields-access.service';

describe('FieldsAccessService', () => {
  let service: FieldsAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(FieldsAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
