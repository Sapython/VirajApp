import { TestBed } from '@angular/core/testing';

import { DataProvider } from './data-provider.service';

describe('DataProviderService', () => {
  let service: DataProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
