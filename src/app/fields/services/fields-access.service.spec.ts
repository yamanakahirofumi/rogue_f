import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { FieldsAccessService } from './fields-access.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FieldsAccessService', () => {
  let service: FieldsAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(FieldsAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
